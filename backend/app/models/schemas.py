from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    message: str


class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_size: int
    status: Literal["pending", "processing", "ready", "failed"]
    error_message: Optional[str] = None
    chunk_count: int = 0
    created_at: datetime


class SourceCitation(BaseModel):
    document_id: str
    filename: str
    page: Optional[int] = None
    snippet: str


class ChatMessageResponse(BaseModel):
    id: str
    role: Literal["user", "assistant"]
    content: str
    sources: List[SourceCitation] = Field(default_factory=list)
    created_at: datetime


class ChatSessionResponse(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0


class ChatSessionDetailResponse(ChatSessionResponse):
    messages: List[ChatMessageResponse] = Field(default_factory=list)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: Optional[str] = None
    document_ids: Optional[List[str]] = None


class ChatResponse(BaseModel):
    session_id: str
    message: ChatMessageResponse
    answer: ChatMessageResponse
