from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings
_embeddings = None


def get_embeddings():
    global _embeddings

    if _embeddings is None:
        _embeddings = GoogleGenerativeAIEmbeddings(
            model=settings.gemini_embedding_model,
            google_api_key=settings.google_api_key,
        )

    return _embeddings