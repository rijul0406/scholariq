"""Database plumbing: engine, session factory, Base, and the get_db dependency.

Mental model:
- ENGINE: one long-lived object that manages a pool of connections to Postgres.
  Created once when the app starts.
- SESSION: a short-lived workspace for one unit of work (usually one request).
  You add/query objects through it, then commit or roll back, then close.
- BASE: the parent class every model (table) inherits from. SQLAlchemy uses it
  to keep a registry of all tables.
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings

# The engine is the entry point to the database. It doesn't open a connection
# yet — it lazily manages a pool and hands out connections when needed.
engine = create_engine(settings.database_url, echo=False)

# A factory that produces new Session objects bound to our engine.
# autoflush/autocommit=False => we control exactly when data is sent/committed.
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    """Parent class for all ORM models. Tables register themselves on it."""


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency: give a request a fresh session, then always close it.

    The `yield` hands the session to the route; the `finally` runs after the
    response is sent, guaranteeing the connection returns to the pool.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
