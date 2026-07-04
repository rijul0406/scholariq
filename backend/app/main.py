"""ScholarIQ API — entry point.

Run from the backend/ folder with:  uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.router import router as auth_router
from app.sessions.router import router as sessions_router
from app.database import Base, engine

# Importing models registers them on Base.metadata so create_all knows about
# them. (Without this import, SQLAlchemy wouldn't know the users table exists.)
from app import models  # noqa: F401

# Create any tables that don't exist yet. Fine for early development; we'll
# switch to Alembic migrations later for versioned schema changes.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ScholarIQ API", version="0.1.0")

# Allow the React dev server (Vite runs on :5173) to call this API from the
# browser. Without this, the browser blocks the cross-origin request.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount feature routers.
app.include_router(auth_router)
app.include_router(sessions_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    """Liveness probe: if this returns, the server is up."""
    return {"status": "ok"}
