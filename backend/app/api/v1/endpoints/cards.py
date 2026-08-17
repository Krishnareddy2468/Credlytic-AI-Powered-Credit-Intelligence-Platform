from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.card import CreditCard
from app.schemas.card import CreditCardResponse

router = APIRouter()


@router.get("", response_model=list[CreditCardResponse])
async def list_cards(db: AsyncSession = Depends(get_db)) -> list[CreditCard]:
    result = await db.scalars(select(CreditCard).order_by(CreditCard.bank, CreditCard.name))
    return list(result)
