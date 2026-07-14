from langchain_community.vectorstores import Chroma

from app.config import settings
from app.services.embeddings import get_embeddings

COLLECTION_NAME = "document_chunks"


def get_vector_store() -> Chroma:
    return Chroma(
        collection_name=COLLECTION_NAME,
        embedding_function=get_embeddings(),
        persist_directory=str(settings.chroma_dir),
    )


def delete_document_vectors(document_id: str) -> None:
    store = get_vector_store()
    collection = store._collection
    results = collection.get(where={"document_id": document_id})
    if results and results.get("ids"):
        collection.delete(ids=results["ids"])
