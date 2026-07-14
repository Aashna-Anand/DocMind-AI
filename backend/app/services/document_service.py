from __future__ import annotations

import uuid
from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from sqlalchemy.orm import Session

from app.config import settings
from app.database import DocumentRecord
from app.services.vector_store import delete_document_vectors, get_vector_store


def extract_text_from_pdf(file_path: Path) -> list[tuple[str, int]]:
    reader = PdfReader(str(file_path))
    pages: list[tuple[str, int]] = []

    for index, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        cleaned = text.strip()
        if cleaned:
            pages.append((cleaned, index + 1))

    return pages


def process_document(db: Session, document: DocumentRecord) -> None:
    document.status = "processing"
    document.error_message = None
    db.commit()

    file_path = settings.upload_dir / f"{document.id}.pdf"

    try:
        pages = extract_text_from_pdf(file_path)
        if not pages:
            raise ValueError(
                "No readable text found in this PDF. It may be scanned or image-only."
            )

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            length_function=len,
        )

        texts: list[str] = []
        metadatas: list[dict] = []

        for page_text, page_number in pages:
            chunks = splitter.split_text(page_text)
            for chunk_index, chunk in enumerate(chunks):
                texts.append(chunk)
                metadatas.append(
                    {
                        "document_id": document.id,
                        "filename": document.filename,
                        "page": page_number,
                        "chunk_index": chunk_index,
                    }
                )

        if not texts:
            raise ValueError("Document processing produced no text chunks.")

        delete_document_vectors(document.id)
        store = get_vector_store()
        ids = [f"{document.id}_{index}" for index in range(len(texts))]
        store.add_texts(texts=texts, metadatas=metadatas, ids=ids)

        document.status = "ready"
        document.chunk_count = len(texts)
        document.error_message = None
        db.commit()
    except Exception as exc:
        document.status = "failed"
        document.error_message = str(exc)
        document.chunk_count = 0
        db.commit()
        raise


def save_uploaded_file(content: bytes, document_id: str) -> Path:
    destination = settings.upload_dir / f"{document_id}.pdf"
    destination.write_bytes(content)
    return destination


def remove_document_files(document_id: str) -> None:
    file_path = settings.upload_dir / f"{document_id}.pdf"
    if file_path.exists():
        file_path.unlink()
    delete_document_vectors(document_id)


def create_document_record(db: Session, filename: str, file_size: int) -> DocumentRecord:
    document = DocumentRecord(
        id=str(uuid.uuid4()),
        filename=filename,
        file_size=file_size,
        status="pending",
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document
