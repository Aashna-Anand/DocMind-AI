import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';

export default function Sidebar({
  documents,
  sessions,
  activeSessionId,
  selectedDocIds,
  onUploaded,
  onToggleDocument,
  onDeleteDocument,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onError,
  deletingDocId,
  isOpen,
  onClose,
}) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <h2>Documents</h2>
          <button type="button" className="sidebar__close" onClick={onClose} aria-label="Close sidebar">
            ×
          </button>
        </div>

        <DocumentUpload onUploaded={onUploaded} onError={onError} />
        <DocumentList
          documents={documents}
          selectedIds={selectedDocIds}
          onToggle={onToggleDocument}
          onDelete={onDeleteDocument}
          deletingId={deletingDocId}
        />

        <div className="sidebar__section">
          <div className="sidebar__section-header">
            <h3>Chat History</h3>
            <button type="button" className="btn-ghost" onClick={onNewChat}>
              + New
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="empty-state empty-state--compact">
              <span>No chats yet</span>
            </div>
          ) : (
            <ul className="session-list">
              {sessions.map((session) => (
                <li key={session.id}>
                  <button
                    type="button"
                    className={`session-item ${activeSessionId === session.id ? 'session-item--active' : ''}`}
                    onClick={() => onSelectSession(session.id)}
                  >
                    <span className="session-item__title">{session.title}</span>
                    <span className="session-item__meta">{session.message_count} messages</span>
                  </button>
                  <button
                    type="button"
                    className="session-item__delete"
                    onClick={() => onDeleteSession(session.id)}
                    aria-label="Delete chat"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
