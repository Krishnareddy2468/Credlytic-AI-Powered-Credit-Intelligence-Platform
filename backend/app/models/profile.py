from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    age: Mapped[int] = mapped_column(Integer)
    gender: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    city: Mapped[str] = mapped_column(String(120))
    employment_type: Mapped[str] = mapped_column(String(32))
    employer_name: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)
    monthly_gross_income: Mapped[float] = mapped_column(Float)
    additional_income: Mapped[float] = mapped_column(Float, default=0)
    existing_loan_count: Mapped[int] = mapped_column(Integer, default=0)
    total_emi_amount: Mapped[float] = mapped_column(Float, default=0)
    credit_card_count: Mapped[int] = mapped_column(Integer, default=0)
    outstanding_balances: Mapped[float] = mapped_column(Float, default=0)
    credit_score: Mapped[int] = mapped_column(Integer)
    credit_history_months: Mapped[int] = mapped_column(Integer, default=0)
    payment_history_percent: Mapped[float] = mapped_column(Float, default=100)
    spending: Mapped[dict] = mapped_column(JSON, default=dict)
    primary_goal: Mapped[str] = mapped_column(String(64), default="cashback")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user: Mapped["User"] = relationship(back_populates="profile")
