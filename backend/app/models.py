"""ORM models — each class maps to one database table.

SQLAlchemy 2.0 style: `Mapped[type]` declares the Python type, and
`mapped_column(...)` configures the DB column (constraints, defaults, etc.).
"""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    # Primary key: unique row id, auto-incremented by Postgres.
    id: Mapped[int] = mapped_column(primary_key=True)

    # Login identity. unique=True => no two users share an email.
    # index=True => fast lookups by email (we query by it on every login).
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)

    # We store a HASH of the password, never the password itself (step 5).
    hashed_password: Mapped[str] = mapped_column(String(255))

    # Set by the database when the row is inserted (server_default=now()).
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # One user has many study sessions. This gives us user.sessions in Python.
    # cascade="all, delete-orphan" => deleting a user deletes their sessions.
    sessions: Mapped[list["StudySession"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"


class StudySession(Base):
    __tablename__ = "study_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)

    # Which user owns this session. ForeignKey ties it to users.id; index makes
    # "all sessions for this user" queries fast.
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )

    # What was studied and for how long.
    subject: Mapped[str] = mapped_column(String(255))
    duration_minutes: Mapped[int] = mapped_column()

    # Optional free-text notes. Mapped[str | None] => nullable column.
    notes: Mapped[str | None] = mapped_column(Text, default=None)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # The other side of the relationship: session.user gives the owner.
    user: Mapped["User"] = relationship(back_populates="sessions")

    def __repr__(self) -> str:
        return f"<StudySession id={self.id} subject={self.subject!r} user_id={self.user_id}>"
