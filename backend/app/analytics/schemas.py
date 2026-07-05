"""Response schemas for the analytics summary."""

from pydantic import BaseModel


class SubjectStat(BaseModel):
    """Aggregated study time for one subject."""

    subject: str
    total_minutes: int
    session_count: int


class AnalyticsSummary(BaseModel):
    """A roll-up of the current user's study activity."""

    total_minutes: int
    session_count: int
    goals_total: int
    goals_completed: int
    by_subject: list[SubjectStat]
