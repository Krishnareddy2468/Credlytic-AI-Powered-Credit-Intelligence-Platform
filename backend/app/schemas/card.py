from pydantic import BaseModel


class CreditCardResponse(BaseModel):
    id: str
    bank: str
    name: str
    network: str
    joining_fee: int
    annual_fee: int
    waiver_condition: str
    min_monthly_income: int
    min_credit_score: int
    reward_rates: dict
    category_benefits: dict
    welcome_benefits: str
    fuel_surcharge_waiver: str
    lounge_access: str
    foreign_markup_percent: float

    model_config = {"from_attributes": True}
