from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.card import CreditCard
from app.seed.cards import CARD_SEED_DATA


async def seed_cards(session: AsyncSession) -> int:
    existing = await session.scalar(select(CreditCard.id).limit(1))
    if existing:
        return 0

    session.add_all(CreditCard(**card) for card in CARD_SEED_DATA)
    await session.commit()
    return len(CARD_SEED_DATA)
