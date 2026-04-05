import hashlib
import os
import secrets
from datetime import UTC, datetime, timedelta


def utc_now() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def generate_salt() -> str:
    return secrets.token_hex(16)


def hash_password(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        120000,
    ).hex()


def verify_password(password: str, salt: str, stored_hash: str) -> bool:
    return secrets.compare_digest(hash_password(password, salt), stored_hash)


def generate_session_token() -> str:
    return secrets.token_urlsafe(32)


def hash_session_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def session_expiry(hours: int | None = None) -> datetime:
    duration = hours or int(os.getenv("ADMIN_SESSION_HOURS", "12"))
    return utc_now() + timedelta(hours=duration)
