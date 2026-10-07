"""Scoring service for POST /api/v1/eligibility/check.

The model learns a single, card-agnostic approval propensity from the training
set. Per-card probability is that base propensity damped by a deterministic
rule layer built from each card's published income and score thresholds -- the
dataset has no per-card labels, so the card term is explicitly rules, not
learning. Keep the two separable so the rule layer can be swapped out once real
per-card outcome data exists.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd

from app.core.config import get_settings
from app.models.card import CreditCard
from app.schemas.eligibility import (
    CardEligibility,
    LimitRange,
    RiskTier,
    ShapFactor,
)
from app.schemas.profile import FinancialProfileBase

_REPO_ARTIFACTS = Path(__file__).resolve().parents[3] / "ml" / "artifacts"
ARTIFACTS_DIR = Path(get_settings().ml_artifacts_dir or _REPO_ARTIFACTS)

EMPLOYMENT_TYPES = ("business", "freelancer", "salaried", "self_employed")
CITY_TIERS = ("tier_1", "tier_2", "tier_3")

TIER_1_CITIES = {
    "mumbai", "delhi", "new delhi", "bengaluru", "bangalore", "chennai",
    "kolkata", "hyderabad", "pune", "ahmedabad",
}
TIER_2_CITIES = {
    "agra", "aligarh", "allahabad", "amritsar", "aurangabad", "bareilly",
    "bhopal", "chandigarh", "coimbatore", "dhanbad", "faridabad", "ghaziabad",
    "gurgaon", "gurugram", "guwahati", "gwalior", "howrah", "hubli", "indore",
    "jabalpur", "jaipur", "jodhpur", "kanpur", "kochi", "kota", "lucknow",
    "ludhiana", "madurai", "meerut", "moradabad", "mysore", "mysuru", "nagpur",
    "nashik", "noida", "patna", "prayagraj", "raipur", "rajkot", "ranchi",
    "solapur", "srinagar", "surat", "thane", "thiruvananthapuram",
    "tiruchirappalli", "vadodara", "varanasi", "vijayawada", "visakhapatnam",
}

VALUE_FORMATS = {
    "cibil_score": "{:.0f}",
    "monthly_income": "Rs {:,.0f}",
    "existing_emi": "Rs {:,.0f}",
    "monthly_surplus": "Rs {:,.0f}",
    "age": "{:.0f} years",
    "years_employed": "{:.1f} years",
    "debt_to_income": "{:.1%}",
    "credit_history_months": "{:.0f} months",
}

# (min_credit_score, low multiple, high multiple) applied to monthly surplus
LIMIT_BANDS = (
    (750, 3.0, 5.0),
    (700, 2.0, 3.5),
    (650, 1.5, 2.5),
    (0, 0.5, 1.5),
)


class ModelUnavailableError(RuntimeError):
    """Raised when the trained artifacts are missing from ml/artifacts."""


@dataclass(frozen=True)
class LoadedModel:
    ensemble: Any
    explainer: Any
    scaler: Any
    feature_cols: list[str]
    numeric_cols: list[str]
    version: str


@lru_cache(maxsize=1)
def load_model() -> LoadedModel:
    """Load artifacts once per process. Cached, so the request path is pure CPU."""
    required = {
        "ensemble": ARTIFACTS_DIR / "ensemble_model_latest.joblib",
        "xgb": ARTIFACTS_DIR / "xgb_model_latest.joblib",
        "scaler": ARTIFACTS_DIR / "scaler_latest.joblib",
        "schema": ARTIFACTS_DIR / "feature_schema_latest.joblib",
    }
    missing = [str(path) for path in required.values() if not path.exists()]
    if missing:
        raise ModelUnavailableError(
            "Missing model artifacts: " + ", ".join(missing)
            + ". Run ml/Notebook.ipynb to regenerate them."
        )

    import shap  # imported lazily; pulls in numba and is slow at import time

    schema = joblib.load(required["schema"])
    xgb_model = joblib.load(required["xgb"])
    return LoadedModel(
        ensemble=joblib.load(required["ensemble"]),
        explainer=shap.TreeExplainer(xgb_model),
        scaler=joblib.load(required["scaler"]),
        feature_cols=list(schema["feature_cols"]),
        numeric_cols=list(schema["numeric_cols"]),
        version=str(schema.get("trained_at", "unknown")),
    )


def normalise_employment(value: str) -> str:
    cleaned = value.strip().lower().replace("-", "_").replace(" ", "_")
    return cleaned if cleaned in EMPLOYMENT_TYPES else "salaried"


def city_tier(city: str) -> str:
    cleaned = city.strip().lower()
    if cleaned in TIER_1_CITIES:
        return "tier_1"
    if cleaned in TIER_2_CITIES:
        return "tier_2"
    return "tier_3"


def build_feature_frames(
    profile: FinancialProfileBase, model: LoadedModel
) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Return (scaled_row, raw_row), both ordered to the model's feature contract."""
    income = profile.monthly_gross_income + profile.additional_income
    emi = profile.total_emi_amount

    raw: dict[str, float] = {
        "cibil_score": float(profile.credit_score),
        "monthly_income": float(income),
        "existing_emi": float(emi),
        "age": float(profile.age),
        # The training set derived credit_history_months from years_employed;
        # inverting that keeps this feature on the distribution the model saw.
        "years_employed": round(profile.credit_history_months / 12, 2),
        "debt_to_income": round(emi / income, 4) if income > 0 else 0.0,
        "monthly_surplus": float(max(income - emi, 0)),
        "credit_history_months": float(profile.credit_history_months),
    }

    employment = normalise_employment(profile.employment_type)
    tier = city_tier(profile.city)
    for option in EMPLOYMENT_TYPES:
        raw[f"employment_type_{option}"] = 1.0 if option == employment else 0.0
    for option in CITY_TIERS:
        raw[f"city_tier_{option}"] = 1.0 if option == tier else 0.0

    raw_row = pd.DataFrame([raw])[model.feature_cols]
    scaled_row = raw_row.copy()
    scaled_row[model.numeric_cols] = model.scaler.transform(raw_row[model.numeric_cols])
    return scaled_row, raw_row


def _positive_class_shap(explainer: Any, frame: pd.DataFrame) -> np.ndarray:
    values = explainer.shap_values(frame)
    if isinstance(values, list):
        values = values[1]
    values = np.asarray(values)
    if values.ndim == 3:
        values = values[:, :, 1]
    return values[0]


def _format_value(feature: str, value: float) -> str:
    if feature in VALUE_FORMATS:
        return VALUE_FORMATS[feature].format(value)
    return "yes" if value >= 0.5 else "no"


def top_shap_factors(model: LoadedModel, scaled_row: pd.DataFrame, raw_row: pd.DataFrame,
                     limit: int = 5) -> list[ShapFactor]:
    shap_values = _positive_class_shap(model.explainer, scaled_row)
    raw_values = raw_row.values[0]

    ranked = sorted(
        zip(model.feature_cols, raw_values, shap_values),
        key=lambda item: abs(item[2]),
        reverse=True,
    )

    factors: list[ShapFactor] = []
    for feature, raw_value, impact in ranked[:limit]:
        direction = "increasing" if impact > 0 else "decreasing"
        display = _format_value(feature, float(raw_value))
        factors.append(
            ShapFactor(
                feature=feature,
                value=display,
                impact=round(float(impact), 4),
                direction=direction,
                explanation=(
                    f"Your {feature.replace('_', ' ')} of {display} is {direction} "
                    f"your probability by {abs(float(impact)):.3f} points"
                ),
            )
        )
    return factors


def _logistic(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-max(min(x, 30.0), -30.0)))


def card_fit(income: float, credit_score: int, card: CreditCard) -> float:
    """Deterministic 0-1 fit term from the card's published thresholds."""
    if card.min_monthly_income > 0:
        income_factor = _logistic((income / card.min_monthly_income - 1.0) * 2.5)
    else:
        income_factor = 1.0
    score_factor = _logistic((credit_score - card.min_credit_score) / 40.0)
    return math.sqrt(income_factor * score_factor)


def risk_tier(probability: float) -> RiskTier:
    if probability >= 0.80:
        return "low"
    if probability >= 0.60:
        return "moderate"
    if probability >= 0.40:
        return "elevated"
    return "high"


def limit_range(income: float, emi: float, credit_score: int) -> LimitRange:
    surplus = max(income - emi, 0.0)
    low_multiple, high_multiple = next(
        (lo, hi) for threshold, lo, hi in LIMIT_BANDS if credit_score >= threshold
    )

    def to_step(value: float) -> int:
        return max(10_000, int(round(value / 5_000.0)) * 5_000)

    low = to_step(surplus * low_multiple)
    high = to_step(surplus * high_multiple)
    return LimitRange(min=low, max=max(high, low + 5_000))


def score_cards(
    profile: FinancialProfileBase, cards: list[CreditCard], top_n: int | None = None
) -> tuple[float, list[CardEligibility], str]:
    """Score every card for one profile. Returns (base_probability, results, version)."""
    model = load_model()
    scaled_row, raw_row = build_feature_frames(profile, model)

    base_probability = float(model.ensemble.predict_proba(scaled_row)[0][1])
    # Card-agnostic: computed once, attached to every card entry.
    factors = top_shap_factors(model, scaled_row, raw_row)

    income = profile.monthly_gross_income + profile.additional_income
    bounds = limit_range(income, profile.total_emi_amount, profile.credit_score)

    results: list[CardEligibility] = []
    for card in cards:
        fit = card_fit(income, profile.credit_score, card)
        probability = round(base_probability * (0.05 + 0.95 * fit), 4)
        results.append(
            CardEligibility(
                card_id=card.id,
                bank=card.bank,
                name=card.name,
                probability=probability,
                risk_tier=risk_tier(probability),
                limit_range=bounds,
                shap_top5=factors,
                meets_income_requirement=income >= card.min_monthly_income,
                meets_score_requirement=profile.credit_score >= card.min_credit_score,
            )
        )

    results.sort(key=lambda item: item.probability, reverse=True)
    if top_n is not None:
        results = results[:top_n]
    return base_probability, results, model.version
