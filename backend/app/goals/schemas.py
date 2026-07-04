"""Request/response schemas for goals."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class GoalCreate(BaseModel):
    """Body for POST /goals."""

    title: str = Field(min_length=1, max_length=255)
    target_minutes: int = Field(gt=0, le=100000)


class GoalUpdate(BaseModel):
    """Body for PUT /goals/{id}. All optional => partial updates.

    Includes is_completed so the frontend can toggle a goal done/undone.
    """

    title: str | None = Field(default=None, min_length=1, max_length=255)
    target_minutes: int | None = Field(default=None, gt=0, le=100000)
    is_completed: bool | None = None


class GoalRead(BaseModel):
    """What we send back for a goal."""

    id: int
    user_id: int
    title: str
    target_minutes: int
    is_completed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
