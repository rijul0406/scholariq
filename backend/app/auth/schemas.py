"""Pydantic schemas: the request/response shapes for the auth API.

Why separate from the SQLAlchemy User model?
- The DB model has hashed_password; we must NEVER send that to a client.
- Schemas validate input (e.g. EmailStr rejects "notanemail", min_length on
  password) before any code runs.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """Body for POST /auth/register and /auth/login."""

    email: EmailStr  # validated as a real email address
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    """What we send back about a user — note: NO password field."""

    id: int
    email: EmailStr
    created_at: datetime

    # Lets Pydantic read data straight off a SQLAlchemy model instance.
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """What POST /auth/login returns."""

    access_token: str
    token_type: str = "bearer"
