"""Goal CRUD endpoints — all scoped to the logged-in user.

This mirrors app/sessions/router.py almost exactly; the pattern is the same for
any user-owned resource.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.goals import schemas
from app.models import Goal, User

router = APIRouter(prefix="/goals", tags=["goals"])


def _get_owned_goal(goal_id: int, user: User, db: Session) -> Goal:
    """Fetch a goal owned by `user`, or 404."""
    goal = db.get(Goal, goal_id)
    if goal is None or goal.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found"
        )
    return goal


@router.get("", response_model=list[schemas.GoalRead])
def list_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Goal]:
    stmt = (
        select(Goal)
        .where(Goal.user_id == current_user.id)
        .order_by(Goal.created_at.desc())
    )
    return list(db.scalars(stmt))


@router.post("", response_model=schemas.GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(
    payload: schemas.GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Goal:
    goal = Goal(user_id=current_user.id, **payload.model_dump())
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return goal


@router.put("/{goal_id}", response_model=schemas.GoalRead)
def update_goal(
    goal_id: int,
    payload: schemas.GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Goal:
    goal = _get_owned_goal(goal_id, current_user, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)
    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    goal = _get_owned_goal(goal_id, current_user, db)
    db.delete(goal)
    db.commit()
