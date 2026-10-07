from __future__ import annotations

from functools import lru_cache
from typing import Union

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "Credlytic"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    backend_cors_origins: Union[list[AnyHttpUrl], str] = Field(
        default="http://localhost:3000"
    )
    database_url: str = "sqlite+aiosqlite:///./app.db"
    ml_artifacts_dir: str = ""
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str = "change-this-in-production"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins(self) -> list[str]:
        if isinstance(self.backend_cors_origins, str):
            return [origin.strip() for origin in self.backend_cors_origins.split(",")]
        return [str(origin) for origin in self.backend_cors_origins]


@lru_cache
def get_settings() -> Settings:
    return Settings()
