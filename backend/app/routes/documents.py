from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import DocumentRecord, get_db
from app.models.schemas import DocumentResponse
from app.services.document_service import (
    create_document_record,
    process_document,
    remove_document_files,
    save_uploaded_file,
)
from app.config import settings

router = APIRouter(prefix="/documents", tags=["documents"])


def _to_response(document: DocumentRecord) -> DocumentResponse:
    return DocumentResponse(
        id=document.id,
        filename=document.filename,
        file_size=document.file_size,
        status=document.status,
        error_message=document.error_message,
        chunk_count=document.chunk_count,
        created_at=document.created_at,
    )


@router.get("", response_model=list[DocumentResponse])
def list_documents(db: Session = Depends(get_db)) -> list[DocumentResponse]:
    documents = db.query(DocumentRecord).order_by(DocumentRecord.created_at.desc()).all()
    return [_to_response(doc) for doc in documents]


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> DocumentResponse:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    content_type = file.content_type or ""
    if content_type and content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Invalid file type. Upload a PDF.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    if len(content) > settings.max_upload_size_bytes:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds the {settings.max_upload_size_mb}MB limit.",
        )

    document = create_document_record(db, file.filename, len(content))
    save_uploaded_file(content, document.id)

    try:
        process_document(db, document)
    except Exception:
        db.refresh(document)

    return _to_response(document)


@router.delete("/{document_id}")
def delete_document(document_id: str, db: Session = Depends(get_db)) -> dict:
    document = db.query(DocumentRecord).filter(DocumentRecord.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found.")

    remove_document_files(document_id)
    db.delete(document)
    db.commit()
    return {"message": "Document deleted successfully."}
