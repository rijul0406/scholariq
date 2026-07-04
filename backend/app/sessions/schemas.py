"""Request/response schemas for study sessions."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SessionCreate(BaseModel):
    """Body for POST /sessions."""

    subject: str = Field(min_length=1, max_length=255)
    duration_minutes: int = Field(gt=0, le=1440)  # 1 min .. 24 h
    notes: str | None = None


class SessionUpdate(BaseModel):
    """Body for PUT /sessions/{id}. All fields optional => partial updates."""

    subject: str | None = Field(default=None, min_length=1, max_length=255)
    duration_minutes: int | None = Field(default=None, gt=0, le=1440)
    notes: str | None = None


class SessionRead(BaseModel):
    """What we send back for a study session."""

    id: int
    user_id: int
    subject: str
    duration_minutes: int
    notes: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
