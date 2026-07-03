"""ORM models — each class maps to one database table.

SQLAlchemy 2.0 style: `Mapped[type]` declares the Python type, and
`mapped_column(...)` configures the DB column (constraints, defaults, etc.).
"""

from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

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

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"
