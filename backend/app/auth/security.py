"""Security primitives: password hashing (bcrypt) and JWT create/verify.

These are pure functions — no database, no FastAPI. That keeps them easy to
test and reuse. The router and dependencies layer call into these.
"""

from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from app.config import settings


# ----- Password hashing -----------------------------------------------------

def hash_password(plain_password: str) -> str:
    """Turn a plain password into a salted bcrypt hash (safe to store)."""
    # bcrypt works on bytes; gensalt() creates a fresh random salt each time.
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a login attempt against the stored hash (no un-hashing involved)."""
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


# ----- JWT tokens -----------------------------------------------------------

def create_access_token(subject: str) -> str:
    """Create a signed JWT whose 'sub' claim identifies the user (their id)."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    # 'sub' = subject (who the token is about), 'exp' = expiry timestamp.
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    """Verify a token's signature + expiry; return the user id, or None if invalid."""
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
        return payload.get("sub")
    except jwt.PyJWTError:
        # Covers bad signature, expired token, malformed token, etc.
        return None
