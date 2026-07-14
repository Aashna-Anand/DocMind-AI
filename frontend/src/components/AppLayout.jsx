import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import ErrorBanner from './ErrorBanner';
import LoadingSpinner from './LoadingSpinner';

export default function AppLayout() {
  const [documents, setDocuments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [selectedDocIds, setSelectedDocIds] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [deletingDocId, setDeletingDocId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  const readyDocuments = useMemo(
    () => documents.filter((doc) => doc.status === 'ready'),
    [documents],
  );

  const loadInitialData = useCallback(async () => {
    setIsBootstrapping(true);
    try {
      await api.health();
      setBackendStatus('connected');

      const [docs, sessionList] = await Promise.all([
        api.listDocuments(),
        api.listSessions(),
      ]);

      setDocuments(docs);
      setSessions(sessionList);
      setSelectedDocIds(docs.filter((doc) => doc.status === 'ready').map((doc) => doc.id));
    } catch (err) {
      setBackendStatus('disconnected');
      setError(err.message);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleUploaded = (document) => {
    setDocuments((prev) => [document, ...prev.filter((item) => item.id !== document.id)]);
    if (document.status === 'ready') {
      setSelectedDocIds((prev) => [...new Set([...prev, document.id])]);
    }
  };

  const handleToggleDocument = (id) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteDocument = async (id) => {
    setDeletingDocId(id);
    setError('');
    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      setSelectedDocIds((prev) => prev.filter((docId) => docId !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingDocId(null);
    }
  };

  const handleNewChat = async () => {
    setError('');
    try {
      const session = await api.createSession();
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setMessages([]);
      setSidebarOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectSession = async (sessionId) => {
    setError('');
    setActiveSessionId(sessionId);
    try {
      const session = await api.getSession(sessionId);
      setMessages(session.messages);
      setSidebarOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    setError('');
    try {
      await api.deleteSession(sessionId);
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendMessage = async (text) => {
    if (readyDocuments.length === 0) {
      setError('Upload and process at least one PDF before chatting.');
      return;
    }

    setIsLoading(true);
    setError('');

    const optimisticUserMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      sources: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);

    try {
      const response = await api.sendMessage({
        message: text,
        session_id: activeSessionId,
        document_ids: selectedDocIds.length > 0 ? selectedDocIds : null,
      });

      setActiveSessionId(response.session_id);
      setMessages((prev) => [
        ...prev.filter((message) => message.id !== optimisticUserMessage.id),
        response.message,
        response.answer,
      ]);

      const sessionList = await api.listSessions();
      setSessions(sessionList);
    } catch (err) {
      setMessages((prev) => prev.filter((message) => message.id !== optimisticUserMessage.id));
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isBootstrapping) {
    return (
      <div className="app-loading">
        <LoadingSpinner label="Connecting to backend..." />
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        documents={documents}
        sessions={sessions}
        activeSessionId={activeSessionId}
        selectedDocIds={selectedDocIds}
        onUploaded={handleUploaded}
        onToggleDocument={handleToggleDocument}
        onDeleteDocument={handleDeleteDocument}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onError={setError}
        deletingDocId={deletingDocId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        
      />

      <main className="app-main">
        <header className="app-header">
          <button type="button" className="btn-icon" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
            ☰
          </button>
          <div className="app-header__title">
            <Link to="/" className="app-header__brand">DocMind AI</Link>
            <span className={`status-dot status-dot--${backendStatus}`}>
              {backendStatus === 'connected' ? 'Connected' : 'Offline'}
            </span>
          </div>
          <button type="button" className="btn-ghost" onClick={handleNewChat}>New Chat</button>
        </header>

        <ErrorBanner message={error} onDismiss={() => setError('')} />

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          hasDocuments={readyDocuments.length > 0}
        />

        <div className="app-footer">
          {selectedDocIds.length > 0 && (
            <p className="context-indicator">
              Using {selectedDocIds.length} document{selectedDocIds.length > 1 ? 's' : ''} as context
            </p>
          )}
          <ChatInput
            onSend={handleSendMessage}
            disabled={readyDocuments.length === 0 || backendStatus !== 'connected'}
            isLoading={isLoading}
          />
        </div>
        <footer
      style={{
        textAlign: "center",
        padding: "15px",
        color: "#9ca3af",
        fontSize: "14px",
      }}
    >
      🚀 Built with React • FastAPI • Docker • AWS
      <br />
      Developed by <strong>Aashna Anand</strong>
    </footer>
  </main>
    </div>
  );
}
