import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import ChatMessage, ChatSession, DocumentRecord, get_db
from app.models.schemas import (
    ChatMessageResponse,
    ChatRequest,
    ChatResponse,
    ChatSessionDetailResponse,
    ChatSessionResponse,
    SourceCitation,
)
from app.services.rag_service import chat

router = APIRouter(tags=["chat"])


def _message_to_response(message: ChatMessage) -> ChatMessageResponse:
    return ChatMessageResponse(
        id=message.id,
        role=message.role,
        content=message.content,
        sources=[SourceCitation(**source) for source in message.sources],
        created_at=message.created_at,
    )


def _session_to_response(session: ChatSession, db: Session) -> ChatSessionResponse:
    message_count = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).count()
    return ChatSessionResponse(
        id=session.id,
        title=session.title,
        created_at=session.created_at,
        updated_at=session.updated_at,
        message_count=message_count,
    )


@router.get("/sessions", response_model=list[ChatSessionResponse])
def list_sessions(db: Session = Depends(get_db)) -> list[ChatSessionResponse]:
    sessions = db.query(ChatSession).order_by(ChatSession.updated_at.desc()).all()
    return [_session_to_response(session, db) for session in sessions]


@router.post("/sessions", response_model=ChatSessionResponse)
def create_session(db: Session = Depends(get_db)) -> ChatSessionResponse:
    session = ChatSession(id=str(uuid.uuid4()), title="New Chat")
    db.add(session)
    db.commit()
    db.refresh(session)
    return _session_to_response(session, db)


@router.get("/sessions/{session_id}", response_model=ChatSessionDetailResponse)
def get_session(session_id: str, db: Session = Depends(get_db)) -> ChatSessionDetailResponse:
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    return ChatSessionDetailResponse(
        id=session.id,
        title=session.title,
        created_at=session.created_at,
        updated_at=session.updated_at,
        message_count=len(messages),
        messages=[_message_to_response(message) for message in messages],
    )


@router.delete("/sessions/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)) -> dict:
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    db.delete(session)
    db.commit()
    return {"message": "Chat session deleted successfully."}


@router.post("/chat", response_model=ChatResponse)
def send_message(payload: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    ready_count = db.query(DocumentRecord).filter(DocumentRecord.status == "ready").count()
    if ready_count == 0:
        raise HTTPException(
            status_code=400,
            detail="Upload and process at least one PDF before chatting.",
        )

    if payload.document_ids:
        valid_ids = {
            doc.id
            for doc in db.query(DocumentRecord)
            .filter(DocumentRecord.id.in_(payload.document_ids))
            .filter(DocumentRecord.status == "ready")
            .all()
        }
        if not valid_ids:
            raise HTTPException(status_code=400, detail="No valid ready documents selected.")

    try:
        session, user_message, assistant_message = chat(
            db=db,
            message=payload.message.strip(),
            session_id=payload.session_id,
            document_ids=payload.document_ids,
        )
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Chat failed: {exc}") from exc

    return ChatResponse(
        session_id=session.id,
        message=_message_to_response(user_message),
        answer=_message_to_response(assistant_message),
    )
