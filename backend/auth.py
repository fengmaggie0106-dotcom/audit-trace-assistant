from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

import models
from database import SessionLocal
from security import hash_session_token, utc_now


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_admin(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> models.AdminUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")

    raw_token = authorization.replace("Bearer ", "", 1).strip()
    token_hash = hash_session_token(raw_token)
    session = (
        db.query(models.AdminSession)
        .filter(models.AdminSession.token_hash == token_hash)
        .first()
    )

    if not session or session.expires_at < utc_now():
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    admin = (
        db.query(models.AdminUser)
        .filter(models.AdminUser.id == session.admin_user_id, models.AdminUser.is_active.is_(True))
        .first()
    )
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not available")

    return admin
