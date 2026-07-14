import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';

export default function ChatWindow({ messages, isLoading, hasDocuments }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!hasDocuments) {
    return (
      <div className="chat-empty">
        <div className="chat-empty__icon">💬</div>
        <h3>Start a conversation</h3>
        <p>Upload at least one PDF document, then ask questions about its content.</p>
      </div>
    );
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="chat-empty">
        <div className="chat-empty__icon">✨</div>
        <h3>Ask anything about your documents</h3>
        <p>Try: "Summarize the main points" or "What does page 3 discuss?"</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="chat-message chat-message--assistant chat-message--loading">
          <div className="chat-message__avatar">AI</div>
          <div className="chat-message__bubble">
            <LoadingSpinner size="sm" label="Thinking..." />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
