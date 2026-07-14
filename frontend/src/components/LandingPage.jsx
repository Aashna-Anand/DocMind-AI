import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing__nav">
        <div className="landing__logo">
          <span className="landing__logo-icon">◈</span>
          DocMind AI
        </div>
        <Link to="/app" className="btn-primary">Open App</Link>
      </nav>

      <header className="landing__hero">
        <div className="landing__badge">Powered by Google Gemini + RAG</div>
        <h1>
          Ask questions about your
          <span className="landing__gradient"> PDF documents</span>
        </h1>
        <p className="landing__subtitle">
          Upload multiple PDFs, chat with an AI that answers strictly from your documents,
          and get source citations for every response.
        </p>
        <div className="landing__actions">
          <Link to="/app" className="btn-primary btn-primary--large">Get Started</Link>
          <a href="#features" className="btn-secondary btn-secondary--large">See Features</a>
        </div>
      </header>

      <section id="features" className="landing__features">
        <article className="feature-card">
          <div className="feature-card__icon">📤</div>
          <h3>Drag & Drop Upload</h3>
          <p>Upload one or many PDFs instantly with a modern drag-and-drop interface.</p>
        </article>
        <article className="feature-card">
          <div className="feature-card__icon">🧠</div>
          <h3>RAG-Powered Chat</h3>
          <p>Answers are grounded in your documents using LangChain and ChromaDB retrieval.</p>
        </article>
        <article className="feature-card">
          <div className="feature-card__icon">📎</div>
          <h3>Source Citations</h3>
          <p>Every answer includes document name, page number, and relevant snippets.</p>
        </article>
        <article className="feature-card">
          <div className="feature-card__icon">💾</div>
          <h3>Chat History</h3>
          <p>Pick up past conversations anytime with persistent session storage.</p>
        </article>
      </section>

      <section className="landing__how">
        <h2>How it works</h2>
        <ol className="landing__steps">
          <li><strong>Upload</strong> your PDF documents</li>
          <li><strong>Extract & embed</strong> text into ChromaDB vectors</li>
          <li><strong>Ask questions</strong> and get cited, document-grounded answers</li>
        </ol>
      </section>

      <footer className="landing__footer">
        <p>AI Document Analyzer · Built with React, FastAPI, Gemini, LangChain & ChromaDB</p>
      </footer>
    </div>
  );
}
