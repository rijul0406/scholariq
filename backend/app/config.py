"""Application settings, loaded once from the environment / .env file.

Why a class instead of scattered os.getenv() calls?
- One source of truth for config.
- pydantic-settings VALIDATES it: if DATABASE_URL is missing, the app fails
  loudly at startup instead of mysteriously later.
- Everything is typed, so editors autocomplete `settings.database_url`.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Field names are matched to env vars case-insensitively, so DATABASE_URL
    # in .env fills this in. No default => it's REQUIRED.
    database_url: str

    # Signs JWT auth tokens. Has a dev default for now.
    jwt_secret: str = "dev-only-change-me-later"

    # Which algorithm signs the JWT. HS256 = symmetric (same secret signs+verifies).
    jwt_algorithm: str = "HS256"

    # How long a login token stays valid before the user must log in again.
    access_token_expire_minutes: int = 60

    # Which frontend origins the browser may call this API from (CORS).
    # Comma-separated so we can set it via one env var in production, e.g.
    # "https://scholariq.vercel.app". Defaults to local dev.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        """Split the comma-separated origins into a clean list."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    # Tell pydantic-settings to read backend/.env.
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


# A single shared instance the rest of the app imports.
settings = Settings()
