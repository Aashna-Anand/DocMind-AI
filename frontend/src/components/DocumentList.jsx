const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  ready: 'Ready',
  failed: 'Failed',
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentList({ documents, selectedIds, onToggle, onDelete, deletingId }) {
  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <p>No documents yet</p>
        <span>Upload a PDF to get started</span>
      </div>
    );
  }

  return (
    <ul className="document-list">
      {documents.map((doc) => {
        const isSelected = selectedIds.includes(doc.id);
        const isReady = doc.status === 'ready';

        return (
          <li key={doc.id} className={`document-item ${isSelected ? 'document-item--selected' : ''}`}>
            <button
              type="button"
              className="document-item__main"
              onClick={() => isReady && onToggle(doc.id)}
              disabled={!isReady}
              title={isReady ? 'Include in chat context' : 'Document not ready'}
            >
              <span className="document-item__icon">📑</span>
              <span className="document-item__info">
                <span className="document-item__name">{doc.filename}</span>
                <span className="document-item__meta">
                  {formatSize(doc.file_size)} · {STATUS_LABELS[doc.status] || doc.status}
                  {doc.chunk_count > 0 && ` · ${doc.chunk_count} chunks`}
                </span>
                {doc.status === 'failed' && doc.error_message && (
                  <span className="document-item__error">{doc.error_message}</span>
                )}
              </span>
              {isReady && (
                <span className={`document-item__check ${isSelected ? 'document-item__check--on' : ''}`}>
                  {isSelected ? '✓' : ''}
                </span>
              )}
            </button>
            <button
              type="button"
              className="document-item__delete"
              onClick={() => onDelete(doc.id)}
              disabled={deletingId === doc.id}
              aria-label={`Delete ${doc.filename}`}
            >
              {deletingId === doc.id ? '…' : '×'}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
