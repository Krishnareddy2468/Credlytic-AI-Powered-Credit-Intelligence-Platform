from time import perf_counter

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.card import CreditCard
from app.models.profile import FinancialProfile
from app.schemas.eligibility import EligibilityCheckRequest, EligibilityCheckResponse
from app.schemas.profile import FinancialProfileBase
from app.services.eligibility import ModelUnavailableError, score_cards

router = APIRouter()


async def _resolve_profile(
    payload: EligibilityCheckRequest, db: AsyncSession
) -> FinancialProfileBase:
    if payload.profile is not None:
        return payload.profile

    stored = await db.scalar(
        select(FinancialProfile).where(FinancialProfile.user_id == payload.user_id)
    )
    if stored is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No financial profile found for this user.",
        )
    return FinancialProfileBase.model_validate(stored, from_attributes=True)


@router.post("/check", response_model=EligibilityCheckResponse)
async def check_eligibility(
    payload: EligibilityCheckRequest, db: AsyncSession = Depends(get_db)
) -> EligibilityCheckResponse:
    started = perf_counter()
    profile = await _resolve_profile(payload, db)

    cards = list(await db.scalars(select(CreditCard).order_by(CreditCard.bank, CreditCard.name)))
    if not cards:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Card catalogue is empty.",
        )

    try:
        base_probability, results, version = score_cards(profile, cards, payload.top_n)
    except ModelUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)
        ) from exc

    return EligibilityCheckResponse(
        model_version=version,
        base_probability=round(base_probability, 4),
        evaluated_cards=len(cards),
        latency_ms=round((perf_counter() - started) * 1000, 2),
        results=results,
    )
