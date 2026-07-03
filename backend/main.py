"""ScholarIQ API — entry point.

Right now this is the smallest possible working FastAPI app: one route that
reports the server is alive. We'll grow it (auth, sessions, etc.) in later steps.
"""

from fastapi import FastAPI

# `app` is the FastAPI application object. Uvicorn looks for this variable
# when it runs "main:app" (module `main`, variable `app`).
app = FastAPI(title="ScholarIQ API", version="0.1.0")


# @app.get("/health") registers the function below to handle HTTP GET requests
# to the "/health" URL. This decorator is how FastAPI maps a URL to code.
@app.get("/health")
def health_check() -> dict[str, str]:
    """A liveness probe: if this returns, the server is up.

    FastAPI turns the returned dict into a JSON response automatically.
    """
    return {"status": "ok"}
