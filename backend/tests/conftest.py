"""Shared pytest setup.

conftest.py is special: pytest loads it automatically and makes its fixtures
available to every test file in this folder — no imports needed.

The big ideas here:
1. Tests run against a SEPARATE database (scholariq_test), never your real data.
2. Each test starts with fresh, empty tables (create before, drop after).
3. We override the app's get_db so requests use the test session.
"""

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app

# The test DB. Overridable via env var so CI can point elsewhere.
TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+psycopg://rijul@localhost:5432/scholariq_test",
)

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def _override_get_db():
    """Same shape as the real get_db, but bound to the test engine."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Tell FastAPI: wherever a route asks for get_db, use the test version instead.
app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(autouse=True)
def _fresh_database():
    """Run for EVERY test: create empty tables, then drop them afterward.

    This guarantees tests are isolated — one test can't see another's rows.
    """
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client() -> TestClient:
    """A fake HTTP client that calls the app directly (no server needed)."""
    return TestClient(app)


@pytest.fixture
def make_auth(client: TestClient):
    """Factory: register + log in a user, return their auth headers.

    Returned as a function so a test can create MORE than one user
    (needed for ownership tests where user B pokes at user A's data).
    """

    def _make(email: str = "user@test.dev", password: str = "password123") -> dict:
        client.post("/auth/register", json={"email": email, "password": password})
        res = client.post(
            "/auth/login", data={"username": email, "password": password}
        )
        token = res.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    return _make


@pytest.fixture
def auth_headers(make_auth) -> dict:
    """Convenience: headers for a single default logged-in user."""
    return make_auth()
