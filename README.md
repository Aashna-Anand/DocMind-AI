# 📄 DocMind AI – AI Document Analyzer

An AI-powered Document Analyzer that allows users to upload PDF documents and ask questions in natural language. The application uses Retrieval-Augmented Generation (RAG) to answer questions only from the uploaded documents.

---
## 🎯 Problem Statement

Organizations, students, and professionals often work with lengthy PDF documents such as research papers, resumes, reports, manuals, and policies. Finding specific information manually is time-consuming and inefficient.

DocMind AI addresses this challenge by enabling users to upload one or more PDF documents and interact with them using natural language. By leveraging Retrieval-Augmented Generation (RAG), the application retrieves only the most relevant information from the uploaded documents and generates accurate, context-aware responses.

## 🎯 Project Objective

The objective of this project is to build an AI-powered document analysis system that:

- Allows users to upload one or multiple PDF documents.
- Extracts and processes document text automatically.
- Generates semantic embeddings for efficient retrieval.
- Answers user questions based only on the uploaded documents.
- Provides source citations to improve transparency and trust.
- Demonstrates deployment of a full-stack AI application using Docker and AWS EC2.

## 👥 Target Users

DocMind AI is designed for users who frequently work with PDF documents and need quick access to information without manually searching through pages.

The primary target users include:

- Students
- Researchers
- Teachers and Educators
- HR Professionals
- Business Analysts
- Legal Professionals
- Corporate Employees

## 💡 Use Cases

DocMind AI can be used for:

- Resume analysis and candidate evaluation
- Research paper summarization
- Company policy and compliance document search
- Legal document analysis
- Technical documentation assistance
- Academic study material exploration
- Question-answering over multiple PDF documents

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

## 🏗️ Application Overview

DocMind AI is a full-stack AI-powered document analysis platform that enables users to upload PDF documents, extract their content, and interact with them using natural language. The application follows a Retrieval-Augmented Generation (RAG) architecture, combining semantic search with a Large Language Model (LLM) to generate accurate, context-aware responses.

## 🧠 Prompting Strategy and Frameworks Used

### Prompting Strategy

DocMind AI follows a **Retrieval-Augmented Generation (RAG)** approach to ensure responses are grounded in the uploaded documents rather than relying solely on the language model's general knowledge.

The workflow is:

1. User submits a question.
2. Relevant document chunks are retrieved from ChromaDB using semantic similarity search.
3. The retrieved context is combined with the user's question.
4. The prompt is sent to the LLM through OpenRouter.
5. The model generates an answer based only on the retrieved document context.
6. Source citations are returned along with the response.

## 🏛️ Application Architecture

```text
                    ┌────────────────────────────┐
                    │          User              │
                    └─────────────┬──────────────┘
                                  │
                                  ▼
                     React Frontend (Vite)
                                  │
                         REST API Requests
                                  │
                                  ▼
                     FastAPI Backend (Python)
                                  │
          ┌───────────────────────┼────────────────────────┐
          │                       │                        │
          ▼                       ▼                        ▼
     PDF Processing         ChromaDB Vector Store     SQLite Database
        (PyPDF)              (Embeddings Storage)     (Sessions & Metadata)
          │                       ▲
          ▼                       │
 Google Embedding Model ──────────┘
          │
          ▼
   Semantic Similarity Search
          │
          ▼
   OpenRouter LLM (Chat Model)
          │
          ▼
   AI Response with Citations
          │
          ▼
        React UI
```

## 🚀 Phase-by-Phase Development Summary

### Phase 1 – Requirement Analysis
- Identified the need for an AI-powered document analysis system.
- Selected the RAG architecture for document question answering.

### Phase 2 – Frontend Development
- Developed the user interface using React and Vite.
- Built document upload, chat interface, and session management.

### Phase 3 – Backend Development
- Developed REST APIs using FastAPI.
- Implemented document management and chat endpoints.

### Phase 4 – AI & RAG Integration
- Integrated LangChain for orchestration.
- Used Google Generative AI for embeddings.
- Stored embeddings in ChromaDB.
- Connected OpenRouter for LLM-based responses.

### Phase 5 – Deployment
- Dockerized the frontend and backend.
- Deployed the application on AWS EC2.
- Configured networking and application services.


## ⚠️ Challenges Encountered and Solutions

| Challenge | Solution |
|-----------|----------|
| Docker container configuration | Fixed Docker Compose configuration and dependency issues. |
| Frontend-backend communication | Configured CORS and API routing correctly. |
| AI model integration | Integrated OpenRouter for chat generation and Google AI for embeddings. |
| AWS deployment | Configured Docker containers and networking on EC2. |
| PDF processing | Implemented reliable text extraction and chunking using PyPDF and LangChain. |
| Debugging runtime issues | Resolved dependency, API key, and deployment-related errors through testing and iterative fixes. |

## 📚 Key Learnings and Reflection

This project provided hands-on experience in building and deploying an end-to-end AI application. Throughout the development process, I gained practical knowledge of:

- Retrieval-Augmented Generation (RAG)
- Prompt engineering
- LangChain integration
- Vector databases using ChromaDB
- FastAPI backend development
- React frontend development
- Docker containerization
- AWS EC2 deployment
- REST API design
- Debugging and deploying production applications

This project strengthened my understanding of integrating modern AI technologies into scalable full-stack applications and enhanced my practical problem-solving and deployment skills.

### Workflow

1. User uploads one or more PDF documents.
2. PDF text is extracted using PyPDF.
3. Text is split into smaller chunks.
4. Chunks are converted into vector embeddings.
5. Embeddings are stored in ChromaDB.
6. User asks a question.
7. Similar document chunks are retrieved.
8. Retrieved context is sent to the LLM through OpenRouter.
9. The LLM generates a context-aware response.
10. The answer and source citations are displayed in the user interface.

### AI Frameworks Used

- LangChain
- ChromaDB
- OpenRouter API
- FastAPI
- React

### Sample Prompts

- Summarize this document.
- Who is the candidate?
- What skills are mentioned in the resume?
- Explain the candidate's project experience.
- List all certifications.
- What technologies were used in the project?

### Technology Stack Overview

| Layer | Technologies |
|--------|--------------|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | FastAPI, Python, SQLAlchemy |
| AI Framework | LangChain |
| LLM | OpenRouter (ChatOpenAI) |
| Embeddings | Google Generative AI (`text-embedding-004`) |
| Vector Database | ChromaDB |
| PDF Processing | PyPDF |
| Database | SQLite |
| Deployment | Docker, Docker Compose, AWS EC2 |

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

## 🤖 LLM Model and APIs Used

### Large Language Model (LLM)
- **Provider:** OpenRouter
- **Model:** `openrouter/free`
- **Purpose:** Generates context-aware answers based on retrieved document content.

### Embedding Model
- **Provider:** Google Generative AI
- **Model:** `text-embedding-004`
- **Purpose:** Converts document text into vector embeddings for semantic search.

### Vector Database
- **ChromaDB**
- Stores vector embeddings and enables efficient similarity search.

### PDF Processing
- **PyPDF**
- Extracts text from uploaded PDF documents.

## 🎯 Expected User Experience

DocMind AI is designed to provide a simple, intuitive, and efficient experience for users working with PDF documents.

Users can:
- Upload one or multiple PDF documents with ease.
- Receive fast, context-aware answers in natural language.
- View source citations for every response to verify information.
- Manage multiple chat sessions while interacting with uploaded documents.

## ✅ Expected Outcomes

By using DocMind AI, users can:

- Reduce the time spent searching through lengthy documents.
- Improve productivity when working with technical, academic, or business documents.
- Obtain accurate answers grounded in the uploaded content.
- Build trust through transparent, citation-based responses.

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