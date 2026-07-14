# 📄 DocMind AI – AI Document Analyzer

An AI-powered Document Analyzer that allows users to upload PDF documents and ask questions in natural language. The application uses Retrieval-Augmented Generation (RAG) to answer questions only from the uploaded documents.

---

## 🚀 Features

- Upload one or multiple PDF documents
- Extract text from PDFs
- Automatic text chunking
- Generate vector embeddings
- Store embeddings in ChromaDB
- Semantic document retrieval
- AI-powered question answering
- Source citations
- Chat history
- Dockerized application

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- FastAPI
- Python
- LangChain

### AI & RAG
- OpenRouter (LLM)
- Google Embeddings
- ChromaDB
- PyPDF

### Database
- SQLite

### Deployment
- Docker
- Docker Compose

---

## 📂 Project Structure

```
AI-Analyzer/
│
├── backend/
│   ├── app/
│   ├── uploads/
│   ├── chroma_data/
│   ├── data/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <your-github-link>
cd AI-Analyzer
```

---

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

### Frontend

```bash
cd frontend

npm install
```

---

## Environment Variables

Create a `.env` file inside `backend`.

```env
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY

OPENAI_API_KEY=YOUR_OPENROUTER_API_KEY

OPENAI_MODEL=openrouter/free

GEMINI_EMBEDDING_MODEL=models/text-embedding-004
```

---

## Run with Docker

```bash
docker compose up --build
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:8000
```

---

## 🧠 How It Works

1. User uploads PDF
2. PDF text is extracted
3. Text is split into chunks
4. Chunks are converted into embeddings
5. Embeddings are stored in ChromaDB
6. User asks a question
7. Relevant chunks are retrieved
8. LLM generates answer using retrieved context
9. Sources are displayed

---

## 📸 Screenshots

Add screenshots here.

- Home Page
- Upload PDF
- Chat Interface
- AI Response

---

## Future Improvements

- Support DOCX
- OCR for scanned PDFs
- User authentication
- Cloud deployment
- Multiple chat sessions
- Export chat

---

## Author

**Aashna Anand**

B.Tech CSE-IIoT

GGSIPU

---

## License

MIT License