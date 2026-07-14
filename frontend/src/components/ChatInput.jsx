import { useState } from 'react';

export default function ChatInput({ onSend, disabled, isLoading }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled || isLoading) return;
    onSend(trimmed);
    setMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? 'Upload a document first...' : 'Ask a question about your documents...'}
        disabled={disabled || isLoading}
        rows={1}
      />
      <button type="submit" disabled={disabled || isLoading || !message.trim()}>
        {isLoading ? '...' : 'Send'}
      </button>
    </form>
  );
}
