<p align="center">
  <img src="https://img.shields.io/badge/Onyx-AI-00D4FF?style=for-the-badge&logo=openai&logoColor=white" alt="Onyx AI"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

<h1 align="center">
  🖤 Onyx AI
</h1>

<p align="center">
  <strong>Think. Build. Evolve.</strong>
</p>

<p align="center">
  <em>A stunning, multi-model AI chat platform with persistent conversations, image analysis, voice input, and a premium glassmorphic UI — all running self-hosted with a single Docker command.</em>
</p>

---

## 📑 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🗂️ Project Structure](#️-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (Docker)](#-quick-start-docker)
  - [Manual Setup (Development)](#-manual-setup-development)
- [🔐 Authentication](#-authentication)
- [🤖 AI Models](#-ai-models)
- [📡 API Reference](#-api-reference)
- [🖥️ Frontend Pages](#️-frontend-pages)
- [🐳 Docker Details](#-docker-details)
- [⚙️ Configuration](#️-configuration)
- [🛣️ Roadmap](#️-roadmap)
- [📄 License](#-license)

---

## ✨ Overview

**Onyx AI** is a self-hosted, multi-model AI chat application built by **Pardha**. It brings together three powerful AI providers — **Groq (Nexus)**, **Google Gemini**, and **Mistral AI** — into a single, beautifully-crafted interface. Each model has its own personality, strengths, and capabilities.

The platform features a dark-mode glassmorphic UI with smooth Framer Motion animations, JWT-based authentication, PostgreSQL-backed chat persistence, image analysis, voice input, a prompt library, and much more.

> 🧠 **Nexus** is brutally honest. **Gemini** is friendly and helpful. **Mistral** is calm and precise.
> Pick the personality that matches your mood.

---

## 🎯 Key Features

### 💬 Multi-Model Chat
| Feature | Description |
|---------|-------------|
| 🔄 **Model Switching** | Switch between Nexus, Gemini 2.5 Flash, and Mistral Small in real-time |
| 💾 **Persistent History** | All conversations are auto-saved to PostgreSQL with debounced writes |
| 🔁 **Regenerate Responses** | Re-roll any AI response with a single click |
| 📊 **Token Tracking** | Live token usage counter with per-model limits |

### 🖼️ Multimodal Capabilities
| Feature | Description |
|---------|-------------|
| 📸 **Image Analysis** | Paste or upload images for Gemini & Mistral to analyze |
| 📋 **Clipboard Paste** | `Ctrl+V` images directly into the chat input |
| 📎 **File Attachments** | Attach multiple files with inline previews |

### 🎙️ Voice & Code
| Feature | Description |
|---------|-------------|
| 🎤 **Voice Input** | Speech-to-text using the Web Speech API |
| 💻 **Code Mode** | Toggle monospace mode for sending code snippets with triple-backtick wrapping |

### 🎨 Premium UI/UX
| Feature | Description |
|---------|-------------|
| 🌑 **Dark/Light Themes** | Toggle themes with a single click |
| ✨ **Glassmorphism** | Frosted glass cards, subtle blur, and gradient overlays |
| 🤖 **Animated Bot Mascot** | The Onyx bot follows your typing cursor with spring physics |
| 🎭 **Framer Motion** | Smooth page transitions, message animations, and micro-interactions |

### 🔒 Security & User Management
| Feature | Description |
|---------|-------------|
| 🔑 **JWT Authentication** | Token-based auth with 24-hour expiry |
| 👤 **Profile Management** | Update display name, email, and password |
| 🛡️ **Password Hashing** | SHA-256 with per-user random salts |

### 📚 Additional Pages
| Page | Description |
|------|-------------|
| 🧭 **Explore** | Browse featured AI models and capabilities by category |
| ⚡ **Prompt Library** | Save, organize, and one-click deploy reusable prompts |
| 📁 **Media & Files** | Drag-and-drop file manager with upload/delete support |
| ⚙️ **Settings** | Profile, appearance, AI preferences, and session management |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOCKER COMPOSE                           │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   Frontend    │    │   Backend    │    │   PostgreSQL     │  │
│  │              │    │              │    │                  │  │
│  │  React 19    │───▶│  FastAPI     │───▶│  postgres:16     │  │
│  │  Vite 8      │    │  Uvicorn    │    │  -alpine         │  │
│  │  TailwindCSS │    │  SQLAlchemy │    │                  │  │
│  │              │    │              │    │  Tables:         │  │
│  │  Port: 80    │    │  Port: 8000 │    │  • users         │  │
│  │  (Nginx)     │    │              │    │  • chat_sessions │  │
│  └──────┬───────┘    └──────┬───────┘    │  • chat_messages │  │
│         │                   │            │                  │  │
│         │   Nginx reverse   │            │  Port: 5432      │  │
│         │   proxy /api/ ──▶│            │                  │  │
│         │                   │            └──────────────────┘  │
│         │                   │                                   │
│         │                   ▼                                   │
│         │            ┌──────────────┐                           │
│         │            │   AI Services │                          │
│         │            │              │                           │
│         │            │  • Groq API  │  (Nexus personality)     │
│         │            │  • Gemini API│  (Friendly helper)       │
│         │            │  • Mistral   │  (Calm & precise)        │
│         │            └──────────────┘                           │
│         │                                                       │
└─────────┴───────────────────────────────────────────────────────┘
```

### 🔄 Request Flow

```
User ──▶ Nginx (port 80) ──▶ /api/* ──▶ FastAPI (port 8000)
                │                              │
                ▼                              ▼
        Static React App              AI Service Layer
                                       │    │    │
                                       ▼    ▼    ▼
                                     Groq Gemini Mistral
```

---

## 🗂️ Project Structure

```
onyx/
│
├── 📄 docker-compose.yml        # 🐳 Orchestrates all 3 services
├── 📄 requirements.txt          # 🐍 Python dependencies
│
├── 🤖 Ai's/                     # AI provider service layer
│   ├── groq_service.py          #   └─ Nexus (Groq/LLaMA 3.1 8B)
│   ├── gemini_service.py        #   └─ Google Gemini 2.5 Flash
│   └── mistral_service.py       #   └─ Mistral Small Latest
│
├── ⚙️ backend/                   # FastAPI application
│   ├── Dockerfile               #   └─ Python 3.11-slim container
│   ├── main.py                  #   └─ Routes, middleware, CORS
│   ├── auth.py                  #   └─ JWT + password hashing
│   └── database.py              #   └─ SQLAlchemy models + seeding
│
├── 🎨 frontend/                  # React + Vite application
│   ├── Dockerfile               #   └─ Multi-stage build (Node → Nginx)
│   ├── nginx.conf               #   └─ Reverse proxy config
│   ├── package.json             #   └─ Dependencies & scripts
│   ├── index.html               #   └─ Entry HTML
│   ├── vite.config.ts           #   └─ Vite configuration
│   │
│   └── src/
│       ├── main.tsx             #   └─ React DOM entry
│       ├── App.tsx              #   └─ Root component + routing
│       ├── App.css              #   └─ Global styles
│       ├── index.css            #   └─ Tailwind base
│       │
│       ├── context/             #   └─ React Context providers
│       │   ├── AuthContext.tsx   #       └─ Auth state + API calls
│       │   ├── ChatContext.tsx   #       └─ Chat state + AI calls
│       │   └── ThemeContext.tsx  #       └─ Dark/Light theme toggle
│       │
│       ├── components/
│       │   ├── chat/            #   └─ Chat interface components
│       │   │   ├── ChatArea.tsx      #   └─ Message list container
│       │   │   ├── ChatInput.tsx     #   └─ Input bar + bot animation
│       │   │   ├── EmptyState.tsx    #   └─ Welcome screen
│       │   │   └── MessageBubble.tsx #   └─ Message rendering
│       │   │
│       │   ├── layout/          #   └─ App layout components
│       │   │   ├── MainLayout.tsx    #   └─ Page shell
│       │   │   ├── Sidebar.tsx       #   └─ Chat history sidebar
│       │   │   ├── TopNav.tsx        #   └─ Model selector + nav
│       │   │   └── RightPanel.tsx    #   └─ Info/details panel
│       │   │
│       │   ├── pages/           #   └─ Full page views
│       │   │   ├── LoginPage.tsx     #   └─ Auth screen
│       │   │   ├── ExplorePage.tsx   #   └─ Model discovery
│       │   │   ├── PromptsPage.tsx   #   └─ Prompt library
│       │   │   ├── MediaPage.tsx     #   └─ File manager
│       │   │   └── SettingsPage.tsx  #   └─ User settings
│       │   │
│       │   └── ui/              #   └─ Shared UI primitives
│       │       └── OnyxBotLogo.tsx   #   └─ Animated bot SVG
│       │
│       └── lib/                 #   └─ Utility functions
│
└── 🐍 myenv/                    # Python virtual environment (local dev)
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| 🐳 **Docker** | 20.10+ | Container runtime |
| 📦 **Docker Compose** | v2+ | Service orchestration |
| 🌐 **Web Browser** | Modern | Chrome, Edge, Firefox |

> 💡 **That's it!** Docker handles everything — no need to install Node.js, Python, or PostgreSQL on your machine.

### 🐳 Quick Start (Docker)

```bash
# 1️⃣  Clone the repository
git clone https://github.com/your-username/onyx.git
cd onyx

# 2️⃣  Build and start all services
docker compose up -d --build

# 3️⃣  Open in your browser
#     🌐 http://localhost

# 4️⃣  Login with default credentials
#     👤 Username: pardha
#     🔑 Password: password
```

> ⏱️ **First build takes 2–3 minutes** (downloading images + installing dependencies).
> Subsequent starts are nearly instant.

#### 🔧 Useful Docker Commands

```bash
# View logs for all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend

# Stop all services
docker compose down

# Stop and remove all data (⚠️ deletes database!)
docker compose down -v

# Rebuild a specific service
docker compose up -d --build backend
```

### 🛠️ Manual Setup (Development)

<details>
<summary>📖 Click to expand manual setup instructions</summary>

#### Backend

```bash
# 1. Create a Python virtual environment
python -m venv myenv

# 2. Activate it
# Windows:
myenv\Scripts\activate
# macOS/Linux:
source myenv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start PostgreSQL (or use Docker just for the DB)
docker compose up -d postgres

# 5. Set the database URL (if not using default)
set DATABASE_URL=postgresql://onyx:onyxpass@localhost:5432/onyxdb

# 6. Run the backend server
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Frontend

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Start the Vite dev server
npm run dev
```

> ⚠️ **Note:** In development mode, the frontend runs on `http://localhost:5173` and the backend on `http://localhost:8000`. The Vite dev server proxies `/api` requests automatically via `vite.config.ts`.

</details>

---

## 🔐 Authentication

Onyx uses **JWT (JSON Web Tokens)** for authentication. On first startup, the database is seeded with a default user.

### 🔑 Default Credentials

```
╔══════════════════════════════════════════╗
║  👤 Username:  pardha                    ║
║  🔑 Password:  password                 ║
╚══════════════════════════════════════════╝
```

### 🔄 Auth Flow

```
Login Request                    Server Response
─────────────                    ─────────────── 
POST /api/login         ──▶      { token: "eyJ...", user: {...} }
  { username, password }                │
                                        ▼
                              Token stored in React state
                                        │
                                        ▼
                           All subsequent requests include:
                           Authorization: Bearer <token>
```

### 🛡️ Security Details

| Component | Implementation |
|-----------|---------------|
| **Hashing** | SHA-256 with 32-byte random salt per user |
| **Token Format** | JWT (HS256 algorithm) |
| **Token Expiry** | 24 hours |
| **Secret Key** | Configurable via `SECRET_KEY` in `auth.py` |
| **Transport** | HTTP Bearer token in `Authorization` header |

> ⚠️ **Production Warning:** Change the `SECRET_KEY` in `backend/auth.py` before deploying to production. The default key is for development only.

---

## 🤖 AI Models

Onyx integrates **three distinct AI providers**, each with a unique personality:

### 🟢 Nexus (Groq)
| Property | Value |
|----------|-------|
| **Provider** | Groq Cloud |
| **Model** | `llama-3.1-8b-instant` |
| **Personality** | Cold, brutally honest, abrasive 🥶 |
| **Token Limit** | 8,192 |
| **Image Support** | ❌ No |
| **Speed** | ⚡ Ultra-fast (Groq hardware) |

> *"Never break character, never apologize for your bluntness, and never soften your words to spare someone's ego."*

### 🔵 Gemini 2.5 Flash (Google)
| Property | Value |
|----------|-------|
| **Provider** | Google AI |
| **Model** | `gemini-2.5-flash` |
| **Personality** | Friendly, helpful, optimistic 😊 |
| **Token Limit** | 1,048,576 (1M!) |
| **Image Support** | ✅ Yes |
| **Speed** | 🚀 Fast |

### 🟠 Mistral Small (Mistral AI)
| Property | Value |
|----------|-------|
| **Provider** | Mistral AI |
| **Model** | `mistral-small-latest` |
| **Personality** | Calm, precise, slightly witty 🎯 |
| **Token Limit** | 32,000 |
| **Image Support** | ✅ Yes |
| **Speed** | 🏎️ Fast |

### 🔄 Switching Models

Models can be switched from:
1. **Top Navigation Bar** — Click the model name dropdown
2. **Settings Page** — Under "AI Preferences → Default Model"

---

## 📡 API Reference

All endpoints are prefixed with `/api` and require JWT authentication (except login).

### 🔓 Authentication Endpoints

#### `POST /api/login`
> Login and receive a JWT token.

```json
// Request
{
  "username": "pardha",
  "password": "password"
}

// Response (200 OK)
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "username": "pardha",
    "display_name": "Pardha",
    "email": "pardha@onyx.ai"
  }
}
```

#### `GET /api/profile`
> Get the current user's profile. Requires `Bearer` token.

#### `PUT /api/profile`
> Update display name, email, or password.

```json
// Request
{
  "display_name": "New Name",
  "email": "new@email.com",
  "current_password": "old_pass",   // required only for password change
  "new_password": "new_pass"        // optional
}
```

---

### 💬 Chat Endpoints

#### `POST /api/chat`
> Send a message to an AI model and get a response.

```json
// Request
{
  "messages": [
    { "role": "user", "content": "What is the meaning of life?" }
  ],
  "model": "nexus",
  "images": [                        // optional, for Gemini & Mistral
    {
      "base64": "/9j/4AAQ...",
      "mime_type": "image/jpeg"
    }
  ]
}

// Response (200 OK)
{
  "response": "Oh, you want me to solve philosophy now? 🙄 Fine..."
}
```

#### `GET /api/chats`
> List all chat sessions for the current user (sorted by most recent).

```json
// Response (200 OK)
[
  {
    "id": "1718112000000",
    "title": "What is the meaning of life?",
    "model": "nexus",
    "updatedAt": 1718112000000,
    "messageCount": 4
  }
]
```

#### `GET /api/chats/{chat_id}`
> Load a specific chat session with all messages.

#### `POST /api/chats`
> Create or update a chat session (auto-called by the frontend with debouncing).

```json
// Request
{
  "chat_id": "1718112000000",
  "title": "What is the meaning of life?",
  "model": "nexus",
  "messages": [
    { "id": "1", "role": "user", "content": "Hello!", "time": "10:30 AM" },
    { "id": "2", "role": "ai", "content": "What do you want? 🙄", "time": "10:30 AM" }
  ]
}
```

#### `DELETE /api/chats/{chat_id}`
> Delete a chat session and all its messages.

---

## 🖥️ Frontend Pages

### 🏠 Home — Chat Interface
The main chat experience with:
- Real-time message streaming
- Animated Onyx bot that follows your cursor as you type
- File attachment previews with image thumbnails
- Code mode toggle for sending code snippets
- Voice input with visual feedback
- Auto-scrolling message history

### 🔐 Login Page
A premium login experience featuring:
- Animated gradient background orbs
- Glassmorphic login card
- Shake animation on invalid credentials
- Loading spinner during authentication
- Animated Onyx logo with glow effect

### 🧭 Explore Page
Browse and discover AI models and capabilities:
- Category filters (Coding, Writing, Image Gen, Productivity, Audio)
- Searchable model grid with gradient accent cards
- Tag-based filtering system

### ⚡ Prompts Page
Save and manage reusable prompts:
- Pre-loaded templates (Code Reviewer, Technical Writer, React Expert, UX Consultant)
- One-click "Use Prompt" to instantly send to chat
- Create custom prompts with title, description, and category
- Usage counters per prompt

### 📁 Media & Files Page
A full file management experience:
- Drag-and-drop upload zone with visual feedback
- Tabular file listing with type icons
- Context menu for file actions (delete)
- Automatic file type detection

### ⚙️ Settings Page
Complete user and app configuration:
- **Profile**: Edit display name and email
- **Password**: Change password with current-password verification
- **Appearance**: Toggle dark/light theme
- **AI Preferences**: Set default model, view/reset token usage
- **Session**: Sign out (danger zone)

---

## 🐳 Docker Details

### Services

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| 🗄️ `postgres` | `postgres:16-alpine` | `5432` | PostgreSQL database |
| ⚙️ `backend` | Custom (Python 3.11) | `8000` | FastAPI + AI services |
| 🎨 `frontend` | Custom (Nginx) | `80` | React app + reverse proxy |

### Volumes

| Volume | Mount | Purpose |
|--------|-------|---------|
| `pgdata` | `/var/lib/postgresql/data` | Persist database across restarts |

### Health Checks

The `postgres` service includes a health check that runs `pg_isready` every 5 seconds. The `backend` service waits for PostgreSQL to be healthy before starting (`depends_on` with `condition: service_healthy`).

### Build Pipeline

```
Frontend Build (Multi-stage):
  Stage 1: node:20-alpine → npm install → npm run build → /app/dist
  Stage 2: nginx:alpine ← copy dist + nginx.conf → serve on port 80

Backend Build:
  python:3.11-slim → pip install requirements → copy backend/ + Ai's/ → uvicorn
```

---

## ⚙️ Configuration

### 🔑 Environment Variables

| Variable | Default | Service | Description |
|----------|---------|---------|-------------|
| `DATABASE_URL` | `postgresql://onyx:onyxpass@postgres:5432/onyxdb` | Backend | PostgreSQL connection string |
| `POSTGRES_USER` | `onyx` | PostgreSQL | Database user |
| `POSTGRES_PASSWORD` | `onyxpass` | PostgreSQL | Database password |
| `POSTGRES_DB` | `onyxdb` | PostgreSQL | Database name |
| `PYTHONUNBUFFERED` | `1` | Backend | Ensure Python logs are visible in Docker |

### 🔧 API Keys

API keys are currently hardcoded in the AI service files (for development convenience). For production, move them to environment variables:

| Key | File | Environment Variable |
|-----|------|---------------------|
| Groq API Key | `Ai's/groq_service.py` | `GROQ_API_KEY` |
| Gemini API Key | `Ai's/gemini_service.py` | `GEMINI_API_KEY` |
| Mistral API Key | `Ai's/mistral_service.py` | `MISTRAL_API_KEY` |

> 🔴 **Important:** Before pushing to any public repository, remove hardcoded API keys and use environment variables instead.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| ⚛️ React | 19.2 | UI framework |
| 📘 TypeScript | 6.0 | Type safety |
| ⚡ Vite | 8.0 | Build tool & dev server |
| 🎨 TailwindCSS | 4.3 | Utility-first styling |
| 🎭 Framer Motion | 12.40 | Animations |
| 🔷 Lucide React | 1.17 | Icon library |
| 🌐 Nginx | Alpine | Production serving & reverse proxy |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| 🐍 Python | 3.11 | Runtime |
| 🚀 FastAPI | Latest | Web framework |
| 🦄 Uvicorn | Latest | ASGI server |
| 🗃️ SQLAlchemy | Latest | ORM |
| 🐘 psycopg2 | Latest | PostgreSQL driver |
| 🔐 python-jose | Latest | JWT encoding/decoding |
| 📝 Pydantic | Latest | Data validation |

### AI Providers
| Provider | SDK | Model |
|----------|-----|-------|
| 🟢 Groq | `groq` | LLaMA 3.1 8B Instant |
| 🔵 Google | `google-genai` | Gemini 2.5 Flash |
| 🟠 Mistral AI | `mistralai` | Mistral Small Latest |

---

## 🛣️ Roadmap

- [ ] 🔊 Text-to-Speech output
- [ ] 📱 Mobile responsive layout
- [ ] 🧩 Plugin/extension system
- [ ] 📤 Export chat as PDF/Markdown
- [ ] 🔍 Full-text search across chat history
- [ ] 👥 Multi-user registration
- [ ] 🌊 Streaming responses (SSE)
- [ ] 🔑 Environment variable-based API key management
- [ ] 📊 Usage analytics dashboard

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '✨ Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and built by **Pardha**. All rights reserved.

---

<p align="center">
  <strong>Built with 🖤 by Pardha</strong>
  <br/>
  <em>Onyx AI — Think. Build. Evolve.</em>
</p>
