from fastapi import APIRouter

from app.api.v1.endpoints import auth, cards, eligibility, health, profile

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(cards.router, prefix="/cards", tags=["cards"])
api_router.include_router(eligibility.router, prefix="/eligibility", tags=["eligibility"])
