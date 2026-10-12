from datetime import datetime, timedelta, timezone
from uuid import uuid4

import bcrypt
from jose import jwt
from passlib.context import CryptContext

from app.core.config import get_settings

# Passlib 1.7's bcrypt adapter is incompatible with modern bcrypt releases.
# PBKDF2-SHA256 remains a strong, portable password KDF for new accounts;
# direct bcrypt verification preserves login compatibility for legacy hashes.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    if password_hash.startswith(("$2a$", "$2b$", "$2y$")):
        try:
            return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
        except (TypeError, ValueError):
            return False
    return pwd_context.verify(password, password_hash)


def create_access_token(subject: str) -> str:
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {"sub": subject, "type": "access", "exp": expires_at, "jti": str(uuid4())}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")


def create_refresh_token(subject: str) -> str:
    settings = get_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    payload = {"sub": subject, "type": "refresh", "exp": expires_at, "jti": str(uuid4())}
    return jwt.encode(payload, settings.secret_key, algorithm="HS256")
