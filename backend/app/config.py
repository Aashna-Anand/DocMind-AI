from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    openai_api_key: str = ""
    google_api_key: str = ""
    cors_origins: str = "http://localhost:5174"
    database_url: str = f"sqlite:///{BASE_DIR / 'data' / 'app.db'}"
    upload_dir: Path = BASE_DIR / "uploads"
    chroma_dir: Path = BASE_DIR / "chroma_data"

    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"

    gemini_embedding_model: str = "models/text-embedding-004"

    max_upload_size_mb: int = 10
    chunk_size: int = 1000
    chunk_overlap: int = 200
    retrieval_k: int = 5

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


settings = Settings()
