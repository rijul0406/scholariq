"""Study session CRUD endpoints — all scoped to the logged-in user."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models import StudySession, User
from app.sessions import schemas

router = APIRouter(prefix="/sessions", tags=["sessions"])


def _get_owned_session(session_id: int, user: User, db: Session) -> StudySession:
    """Fetch a session that belongs to `user`, or raise 404.

    Using 404 (not 403) for someone else's session avoids revealing that the
    id exists at all.
    """
    session = db.get(StudySession, session_id)
    if session is None or session.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Session not found"
        )
    return session


@router.get("", response_model=list[schemas.SessionRead])
def list_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[StudySession]:
    """List the current user's study sessions, newest first."""
    stmt = (
        select(StudySession)
        .where(StudySession.user_id == current_user.id)
        .order_by(StudySession.created_at.desc())
    )
    return list(db.scalars(stmt))


@router.post("", response_model=schemas.SessionRead, status_code=status.HTTP_201_CREATED)
def create_session(
    payload: schemas.SessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StudySession:
    """Create a study session owned by the current user."""
    session = StudySession(user_id=current_user.id, **payload.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.put("/{session_id}", response_model=schemas.SessionRead)
def update_session(
    session_id: int,
    payload: schemas.SessionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StudySession:
    """Update one of the current user's sessions (partial update allowed)."""
    session = _get_owned_session(session_id, current_user, db)
    # exclude_unset => only overwrite fields the client actually sent.
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(session, field, value)
    db.commit()
    db.refresh(session)
    return session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """Delete one of the current user's sessions."""
    session = _get_owned_session(session_id, current_user, db)
    db.delete(session)
    db.commit()
