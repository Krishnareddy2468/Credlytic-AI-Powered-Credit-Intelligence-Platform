from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.profile import FinancialProfile
from app.schemas.profile import FinancialProfileResponse, FinancialProfileUpsert
from app.services.profile_metrics import profile_metrics

router = APIRouter()


def _profile_response(profile: FinancialProfile) -> FinancialProfileResponse:
    data = {
        **profile.__dict__,
        **profile_metrics(profile),
    }
    return FinancialProfileResponse.model_validate(data)


@router.get("/{user_id}", response_model=FinancialProfileResponse)
async def get_profile(user_id: str, db: AsyncSession = Depends(get_db)) -> FinancialProfileResponse:
    profile = await db.scalar(select(FinancialProfile).where(FinancialProfile.user_id == user_id))
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")
    return _profile_response(profile)


@router.put("/{user_id}", response_model=FinancialProfileResponse)
async def upsert_profile(
    user_id: str, payload: FinancialProfileUpsert, db: AsyncSession = Depends(get_db)
) -> FinancialProfileResponse:
    profile = await db.scalar(select(FinancialProfile).where(FinancialProfile.user_id == user_id))
    values = payload.model_dump()

    if profile:
        for key, value in values.items():
            setattr(profile, key, value)
    else:
        profile = FinancialProfile(user_id=user_id, **values)
        db.add(profile)

    await db.commit()
    await db.refresh(profile)
    return _profile_response(profile)
