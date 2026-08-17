from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class SpendingBreakdown(BaseModel):
    online_shopping: float = Field(default=0, ge=0)
    groceries: float = Field(default=0, ge=0)
    fuel: float = Field(default=0, ge=0)
    dining: float = Field(default=0, ge=0)
    travel: float = Field(default=0, ge=0)
    utilities: float = Field(default=0, ge=0)
    entertainment: float = Field(default=0, ge=0)


class FinancialProfileBase(BaseModel):
    age: int = Field(ge=18, le=70)
    gender: Optional[str] = None
    city: str = Field(min_length=1, max_length=120)
    employment_type: str
    employer_name: Optional[str] = None
    monthly_gross_income: float = Field(gt=0)
    additional_income: float = Field(default=0, ge=0)
    existing_loan_count: int = Field(default=0, ge=0)
    total_emi_amount: float = Field(default=0, ge=0)
    credit_card_count: int = Field(default=0, ge=0)
    outstanding_balances: float = Field(default=0, ge=0)
    credit_score: int = Field(ge=300, le=900)
    credit_history_months: int = Field(default=0, ge=0)
    payment_history_percent: float = Field(default=100, ge=0, le=100)
    spending: SpendingBreakdown = Field(default_factory=SpendingBreakdown)
    primary_goal: str = "cashback"


class FinancialProfileUpsert(FinancialProfileBase):
    pass


class FinancialProfileResponse(FinancialProfileBase):
    id: str
    user_id: str
    debt_to_income_ratio: float
    credit_utilization_proxy: float
    affordability_index: float

    model_config = {"from_attributes": True}
