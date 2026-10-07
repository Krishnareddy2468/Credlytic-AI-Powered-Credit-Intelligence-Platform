from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator

from app.schemas.profile import FinancialProfileBase

RiskTier = Literal["low", "moderate", "elevated", "high"]


class EligibilityCheckRequest(BaseModel):
    """Either an inline profile or a user_id to load one from the database."""

    profile: Optional[FinancialProfileBase] = None
    user_id: Optional[str] = None
    top_n: Optional[int] = Field(default=None, ge=1, le=100)

    @model_validator(mode="after")
    def require_one_source(self) -> "EligibilityCheckRequest":
        if self.profile is None and self.user_id is None:
            raise ValueError("Provide either 'profile' or 'user_id'.")
        return self


class ShapFactor(BaseModel):
    feature: str
    value: str
    impact: float
    direction: Literal["increasing", "decreasing"]
    explanation: str


class LimitRange(BaseModel):
    min: int
    max: int
    currency: str = "INR"


class CardEligibility(BaseModel):
    card_id: str
    bank: str
    name: str
    probability: float = Field(ge=0, le=1)
    risk_tier: RiskTier
    limit_range: LimitRange
    shap_top5: list[ShapFactor]
    meets_income_requirement: bool
    meets_score_requirement: bool


class EligibilityCheckResponse(BaseModel):
    model_version: str
    base_probability: float = Field(ge=0, le=1)
    evaluated_cards: int
    latency_ms: float
    results: list[CardEligibility]

    model_config = {"protected_namespaces": ()}
