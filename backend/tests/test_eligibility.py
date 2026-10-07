import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.card import CreditCard
from app.schemas.profile import FinancialProfileBase
from app.services.eligibility import (
    build_feature_frames,
    card_fit,
    city_tier,
    limit_range,
    load_model,
    normalise_employment,
    risk_tier,
)

PROFILE = {
    "age": 31,
    "city": "Pune",
    "employment_type": "salaried",
    "monthly_gross_income": 95000,
    "additional_income": 5000,
    "existing_loan_count": 1,
    "total_emi_amount": 18000,
    "credit_card_count": 2,
    "outstanding_balances": 40000,
    "credit_score": 764,
    "credit_history_months": 84,
    "payment_history_percent": 98,
    "primary_goal": "travel",
    "spending": {"online_shopping": 12000, "dining": 6000},
}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_check_returns_scored_cards(client) -> None:
    response = client.post("/api/v1/eligibility/check", json={"profile": PROFILE})
    assert response.status_code == 200

    body = response.json()
    assert body["evaluated_cards"] >= 30
    assert 0.0 <= body["base_probability"] <= 1.0
    assert len(body["results"]) == body["evaluated_cards"]

    card = body["results"][0]
    assert set(card) >= {"card_id", "probability", "risk_tier", "limit_range", "shap_top5"}
    assert 0.0 <= card["probability"] <= 1.0
    assert card["risk_tier"] in {"low", "moderate", "elevated", "high"}
    assert card["limit_range"]["min"] < card["limit_range"]["max"]
    assert len(card["shap_top5"]) == 5
    assert all(f["direction"] in {"increasing", "decreasing"} for f in card["shap_top5"])


def test_results_sorted_by_probability_desc(client) -> None:
    body = client.post("/api/v1/eligibility/check", json={"profile": PROFILE}).json()
    probabilities = [card["probability"] for card in body["results"]]
    assert probabilities == sorted(probabilities, reverse=True)


def test_top_n_limits_results(client) -> None:
    body = client.post(
        "/api/v1/eligibility/check", json={"profile": PROFILE, "top_n": 3}
    ).json()
    assert len(body["results"]) == 3
    assert body["evaluated_cards"] >= 30


def test_stronger_profile_scores_higher(client) -> None:
    weak = {**PROFILE, "credit_score": 620, "monthly_gross_income": 25000}
    strong = {**PROFILE, "credit_score": 800, "monthly_gross_income": 200000}

    weak_body = client.post("/api/v1/eligibility/check", json={"profile": weak}).json()
    strong_body = client.post("/api/v1/eligibility/check", json={"profile": strong}).json()
    assert strong_body["base_probability"] > weak_body["base_probability"]


def test_response_under_500ms_target(client) -> None:
    client.post("/api/v1/eligibility/check", json={"profile": PROFILE})  # warm
    body = client.post("/api/v1/eligibility/check", json={"profile": PROFILE}).json()
    assert body["latency_ms"] < 500


def test_requires_profile_or_user_id(client) -> None:
    assert client.post("/api/v1/eligibility/check", json={}).status_code == 422


def test_unknown_user_returns_404(client) -> None:
    response = client.post(
        "/api/v1/eligibility/check", json={"user_id": "00000000-0000-0000-0000-000000000000"}
    )
    assert response.status_code == 404


def test_feature_row_matches_model_contract() -> None:
    model = load_model()
    scaled, raw = build_feature_frames(FinancialProfileBase(**PROFILE), model)

    assert list(scaled.columns) == model.feature_cols
    assert len(model.feature_cols) == 15
    # One-hot columns are passed through unscaled.
    assert raw["employment_type_salaried"].iloc[0] == 1.0
    assert scaled["employment_type_salaried"].iloc[0] == 1.0
    assert scaled["city_tier_tier_1"].iloc[0] == 1.0
    assert raw["monthly_income"].iloc[0] == 100000
    assert raw["monthly_surplus"].iloc[0] == 82000


def test_city_tier_mapping() -> None:
    assert city_tier("Mumbai") == "tier_1"
    assert city_tier("  pune ") == "tier_1"
    assert city_tier("Indore") == "tier_2"
    assert city_tier("Bhilwara") == "tier_3"


def test_employment_normalisation() -> None:
    assert normalise_employment("Self-Employed") == "self_employed"
    assert normalise_employment("business") == "business"
    assert normalise_employment("unrecognised") == "salaried"


def test_risk_tier_boundaries() -> None:
    assert risk_tier(0.95) == "low"
    assert risk_tier(0.80) == "low"
    assert risk_tier(0.79) == "moderate"
    assert risk_tier(0.60) == "moderate"
    assert risk_tier(0.40) == "elevated"
    assert risk_tier(0.39) == "high"


def test_limit_range_scales_with_score() -> None:
    low = limit_range(100000, 20000, 640)
    high = limit_range(100000, 20000, 780)
    assert high.min > low.min and high.max > low.max
    assert low.min % 5000 == 0 and low.max % 5000 == 0
    assert limit_range(5000, 4500, 800).min == 10000  # floor holds


def test_card_fit_rewards_headroom() -> None:
    card = CreditCard(
        id="c1", bank="Test", name="Card", network="Visa",
        min_monthly_income=50000, min_credit_score=750,
    )
    comfortable = card_fit(150000, 800, card)
    marginal = card_fit(50000, 750, card)
    short = card_fit(20000, 650, card)

    assert comfortable > marginal > short
    # Exactly on both thresholds is the neutral midpoint by construction.
    assert marginal == pytest.approx(0.5)
    assert 0.0 <= short < 0.5 < comfortable <= 1.0
