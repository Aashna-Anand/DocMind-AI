from __future__ import annotations

import uuid
from datetime import datetime, timezone

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from sqlalchemy.orm import Session

from app.config import settings
from app.database import ChatMessage, ChatSession
from app.models.schemas import SourceCitation
from app.services.vector_store import get_vector_store


SYSTEM_PROMPT = """
You are a helpful AI assistant.

Answer ONLY from the provided document context.

If the answer is not in the context, reply:

I couldn't find that information in the uploaded documents.

Context:

{context}
"""


def _build_context(query: str, document_ids: list[str] | None):
    store = get_vector_store()

    docs = store.similarity_search(
        query,
        k=settings.retrieval_k,
    )

    if not docs:
        return "", []

    context = ""
    sources = []

    for doc in docs:
        meta = doc.metadata

        context += f"""
Document: {meta.get("filename")}
Page: {meta.get("page")}

{doc.page_content}

--------------------
"""

        sources.append(
            SourceCitation(
                document_id=meta.get("document_id"),
                filename=meta.get("filename"),
                page=meta.get("page"),
                snippet=doc.page_content[:300],
            )
        )

    return context, sources

def _generate_answer(question: str, context: str):

    if not context:
        return "I couldn't find that information in the uploaded documents."

    llm = ChatOpenAI(
        model="openrouter/free",
        temperature=0,
        api_key=settings.openai_api_key,
        base_url="https://openrouter.ai/api/v1",
    )

    response = llm.invoke(
        [
            HumanMessage(
                content=SYSTEM_PROMPT.format(context=context)
                + "\n\nQuestion:\n"
                + question
            )
        ]
    )

    return response.content


def _get_or_create_session(db: Session, session_id):

    if session_id:
        session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if session:
            return session

    session = ChatSession(
        id=str(uuid.uuid4()),
        title="New Chat",
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def chat(db, message, session_id=None, document_ids=None):

    session = _get_or_create_session(db, session_id)

    user = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session.id,
        role="user",
        content=message,
        sources=[],
    )

    db.add(user)

    context, sources = _build_context(message, document_ids)

    answer = _generate_answer(message, context)

    assistant = ChatMessage(
        id=str(uuid.uuid4()),
        session_id=session.id,
        role="assistant",
        content=answer,
        sources=[s.model_dump() for s in sources],
    )

    db.add(assistant)

    session.updated_at = datetime.now(timezone.utc)

    db.commit()

    return session, user, assistant