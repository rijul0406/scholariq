"""Analytics endpoint — aggregates the current user's data with SQL.

Key idea: we don't fetch every row and loop in Python. We ask the database to
COUNT / SUM / GROUP BY, which is what databases are built to do fast.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.analytics import schemas
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models import Goal, StudySession, User

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=schemas.AnalyticsSummary)
def get_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> schemas.AnalyticsSummary:
    """Roll up the user's sessions and goals into summary stats."""

    # --- Session totals: one row of (count, summed minutes) ---
    # coalesce(sum, 0) => return 0 instead of NULL when the user has no sessions.
    session_count, total_minutes = db.execute(
        select(
            func.count(StudySession.id),
            func.coalesce(func.sum(StudySession.duration_minutes), 0),
        ).where(StudySession.user_id == current_user.id)
    ).one()

    # --- Per-subject breakdown: GROUP BY subject, ordered by most-studied ---
    subject_rows = db.execute(
        select(
            StudySession.subject,
            func.sum(StudySession.duration_minutes).label("total_minutes"),
            func.count(StudySession.id).label("session_count"),
        )
        .where(StudySession.user_id == current_user.id)
        .group_by(StudySession.subject)
        .order_by(func.sum(StudySession.duration_minutes).desc())
    ).all()

    by_subject = [
        schemas.SubjectStat(
            subject=row.subject,
            total_minutes=int(row.total_minutes),
            session_count=int(row.session_count),
        )
        for row in subject_rows
    ]

    # --- Goal totals: count all, and count only completed (FILTER clause) ---
    goals_total, goals_completed = db.execute(
        select(
            func.count(Goal.id),
            func.count(Goal.id).filter(Goal.is_completed.is_(True)),
        ).where(Goal.user_id == current_user.id)
    ).one()

    return schemas.AnalyticsSummary(
        total_minutes=int(total_minutes),
        session_count=int(session_count),
        goals_total=int(goals_total),
        goals_completed=int(goals_completed),
        by_subject=by_subject,
    )
