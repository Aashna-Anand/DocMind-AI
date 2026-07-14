import ReactMarkdown from 'react-markdown';

function SourceBadge({ source }) {
  return (
    <div className="source-badge">
      <span className="source-badge__file">{source.filename}</span>
      {source.page && <span className="source-badge__page">p.{source.page}</span>}
      {source.snippet && <p className="source-badge__snippet">"{source.snippet}"</p>}
    </div>
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      <div className="chat-message__avatar">{isUser ? 'You' : 'AI'}</div>
      <div className="chat-message__bubble">
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

        {!isUser && message.sources?.length > 0 && (
          <div className="chat-message__sources">
            <p className="chat-message__sources-title">Sources</p>
            {message.sources.map((source, index) => (
              <SourceBadge key={`${source.document_id}-${source.page}-${index}`} source={source} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
