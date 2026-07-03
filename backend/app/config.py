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

    # Signs JWT auth tokens (used in step 5). Has a dev default for now.
    jwt_secret: str = "dev-only-change-me-later"

    # Tell pydantic-settings to read backend/.env.
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


# A single shared instance the rest of the app imports.
settings = Settings()
