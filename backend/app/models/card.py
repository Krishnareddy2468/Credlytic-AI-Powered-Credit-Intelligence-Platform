from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class CreditCard(Base):
    __tablename__ = "credit_cards"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    bank: Mapped[str] = mapped_column(String(80), index=True)
    name: Mapped[str] = mapped_column(String(160), index=True)
    network: Mapped[str] = mapped_column(String(40))
    joining_fee: Mapped[int] = mapped_column(Integer, default=0)
    annual_fee: Mapped[int] = mapped_column(Integer, default=0)
    waiver_condition: Mapped[str] = mapped_column(String(255), default="")
    min_monthly_income: Mapped[int] = mapped_column(Integer, default=0)
    min_credit_score: Mapped[int] = mapped_column(Integer, default=650)
    reward_rates: Mapped[dict] = mapped_column(JSON, default=dict)
    category_benefits: Mapped[dict] = mapped_column(JSON, default=dict)
    welcome_benefits: Mapped[str] = mapped_column(String(255), default="")
    fuel_surcharge_waiver: Mapped[str] = mapped_column(String(255), default="")
    lounge_access: Mapped[str] = mapped_column(String(255), default="")
    foreign_markup_percent: Mapped[float] = mapped_column(Float, default=3.5)
    last_reviewed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
