<p align="center">
  <img src="https://img.shields.io/badge/Onyx-AI-00D4FF?style=for-the-badge&logo=openai&logoColor=white" alt="Onyx AI"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Hugging_Face-FLUX.1-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="Hugging Face"/>
</p>

<h1 align="center">
  🖤 Onyx AI
</h1>

<p align="center">
  <strong>Think. Build. Evolve.</strong>
</p>

<p align="center">
  <em>A stunning, multi-model AI chat platform with persistent conversations, image analysis, AI image generation, voice input, and a premium glassmorphic UI — built with React 19 + FastAPI.</em>
</p>

---

## 📑 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🗂️ Project Structure](#️-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#️-backend-setup)
  - [Frontend Setup](#-frontend-setup)
- [🔐 Authentication](#-authentication)
- [🤖 AI Models](#-ai-models)
- [🎨 Image Generation](#-image-generation)
- [📡 API Reference](#-api-reference)
- [🖥️ Frontend Pages](#️-frontend-pages)
- [⚙️ Configuration](#️-configuration)
- [🛠️ Tech Stack](#️-tech-stack)
- [🛣️ Roadmap](#️-roadmap)
- [📄 License](#-license)

---

## ✨ Overview

**Onyx AI** is a multi-model AI chat application built by **Pardha**. It brings together four powerful AI capabilities — **Groq (Nexus)**, **Google Gemini**, **Mistral AI**, and **Hugging Face (FLUX.1 image generation)** — into a single, beautifully-crafted interface. Each chat model has its own personality, strengths, and capabilities.

The platform features a dark-mode glassmorphic UI with an animated starfield background, smooth Framer Motion animations, JWT-based authentication, PostgreSQL-backed chat persistence, image analysis, AI image generation, voice input, a prompt library, and much more.

> 🧠 **Nexus** is brutally honest. **Gemini** is friendly and helpful. **Mistral** is calm and precise.
> Pick the personality that matches your mood — or generate stunning images with **FLUX.1**.

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

### 🎨 AI Image Generation
| Feature | Description |
|---------|-------------|
| 🪄 **FLUX.1-schnell** | Generate images from text prompts using Hugging Face's FLUX.1 model |
| 💡 **Prompt Suggestions** | Pre-loaded creative prompt suggestions to get started |
| 📥 **Download & Copy** | Download generated images or copy prompts with one click |
| 🖼️ **Image Gallery** | All generated images displayed in a responsive gallery grid |

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
| 🌌 **Starfield Background** | Animated canvas-based starfield with nebulae and twinkling stars |
| 🤖 **Animated Bot Mascot** | The Onyx bot follows your typing cursor with spring physics |
| 🎭 **Framer Motion** | Smooth page transitions, message animations, and micro-interactions |

### 🔒 Security & User Management
| Feature | Description |
|---------|-------------|
| 🔑 **JWT Authentication** | Token-based auth with 24-hour expiry |
| 👤 **Profile Management** | Update display name, email, and password |
| 🛡️ **Password Hashing** | SHA-256 with per-user random salts |
| 💾 **Persistent Sessions** | Token stored in `localStorage` with auto-validation on mount |

### 📚 Additional Pages
| Page | Description |
|------|-------------|
| 🧭 **Explore** | Browse featured AI models and capabilities by category |
| ⚡ **Prompt Library** | Save, organize, and one-click deploy reusable prompts |
| 🪄 **Image Gen** | Generate AI images with FLUX.1-schnell via Hugging Face |
| 📁 **Media & Files** | Drag-and-drop file manager with upload, preview, and download support |
| ⚙️ **Settings** | Profile, appearance, AI preferences, and session management |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                         APPLICATION                               │
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────────────┐  │
│  │    Frontend       │              │       Backend            │  │
│  │                   │              │                          │  │
│  │  React 19         │    /api/*    │  FastAPI                 │  │
│  │  Vite 8           │────────────▶│  Uvicorn                 │  │
│  │  TailwindCSS 4    │              │  SQLAlchemy              │  │
│  │                   │              │                          │  │
│  │  Dev: :5173       │              │  Port: 8000              │  │
│  │  (Vite proxy)     │              │                          │  │
│  └──────────────────┘              └──────────┬───────────────┘  │
│                                                │                  │
│                                    ┌───────────┼───────────┐     │
│                                    ▼           ▼           ▼     │
│                              ┌─────────┐ ┌─────────┐ ┌────────┐ │
│                              │PostgreSQL│ │AI Services│ │HF API │ │
│                              │  (Neon)  │ │          │ │(FLUX.1)│ │
│                              │         │ │• Groq    │ │        │ │
│                              │ Tables: │ │• Gemini  │ │ Image  │ │
│                              │ • users │ │• Mistral │ │  Gen   │ │
│                              │ • chats │ │          │ │        │ │
│                              │ • msgs  │ └─────────┘ └────────┘ │
│                              └─────────┘                         │
└───────────────────────────────────────────────────────────────────┘
```

### 🔄 Request Flow

```
User ──▶ React App ──▶ /api/* ──▶ FastAPI (port 8000)
              │                         │
              │  (Vite proxy in dev)     ├──▶ AI Service Layer
              │                         │     │    │    │
              ▼                         │     ▼    ▼    ▼
      Rendered UI                       │   Groq Gemini Mistral
                                        │
                                        ├──▶ Hugging Face (Image Gen)
                                        │
                                        └──▶ PostgreSQL (Persistence)
```

---

## 🗂️ Project Structure

```
onyx/
│
├── 📄 README.md                     # Project documentation
│
├── ⚙️ backend/                       # FastAPI application
│   ├── .env                         #   └─ Environment variables (secrets)
│   ├── .env.example                 #   └─ Environment variable template
│   ├── .dockerignore                #   └─ Docker build exclusions
│   ├── .gitignore                   #   └─ Git ignore rules
│   ├── Dockerfile                   #   └─ Python 3.11-slim container
│   ├── requirements.txt             #   └─ Python dependencies
│   ├── main.py                      #   └─ Routes, middleware, CORS, endpoints
│   ├── auth.py                      #   └─ JWT + password hashing
│   ├── database.py                  #   └─ SQLAlchemy models + seeding
│   │
│   └── ai/                          #   └─ AI provider service layer
│       ├── __init__.py              #       └─ Module init
│       ├── groq_service.py          #       └─ Nexus (Groq/LLaMA 3.1 8B)
│       ├── gemini_service.py        #       └─ Google Gemini 2.5 Flash
│       ├── mistral_service.py       #       └─ Mistral Small Latest
│       └── hugging_face.py          #       └─ FLUX.1-schnell Image Gen
│
├── 🎨 frontend/                      # React + Vite application
│   ├── .env.example                 #   └─ Frontend env template
│   ├── .gitignore                   #   └─ Git ignore rules
│   ├── index.html                   #   └─ Entry HTML
│   ├── package.json                 #   └─ Dependencies & scripts
│   ├── vite.config.ts               #   └─ Vite config + API proxy
│   ├── tsconfig.json                #   └─ TypeScript config
│   ├── tsconfig.app.json            #   └─ App TypeScript config
│   ├── tsconfig.node.json           #   └─ Node TypeScript config
│   ├── eslint.config.js             #   └─ ESLint configuration
│   │
│   ├── assets/                      #   └─ Static assets (hero.png, SVGs)
│   ├── public/                      #   └─ Public assets (favicon, icons)
│   │
│   └── src/
│       ├── main.tsx                 #   └─ React DOM entry
│       ├── App.tsx                  #   └─ Root component + routing
│       ├── App.css                  #   └─ Global styles
│       ├── index.css                #   └─ Tailwind base + CSS variables
│       │
│       ├── context/                 #   └─ React Context providers
│       │   ├── AuthContext.tsx       #       └─ Auth state + API calls
│       │   ├── ChatContext.tsx       #       └─ Chat state + AI calls
│       │   └── ThemeContext.tsx      #       └─ Dark/Light theme toggle
│       │
│       ├── components/
│       │   ├── chat/                #   └─ Chat interface components
│       │   │   ├── ChatArea.tsx      #       └─ Message list container
│       │   │   ├── ChatInput.tsx     #       └─ Input bar + bot animation
│       │   │   ├── EmptyState.tsx    #       └─ Welcome screen
│       │   │   └── MessageBubble.tsx #       └─ Message rendering
│       │   │
│       │   ├── layout/              #   └─ App layout components
│       │   │   ├── MainLayout.tsx    #       └─ Page shell
│       │   │   ├── Sidebar.tsx       #       └─ Chat history sidebar
│       │   │   ├── TopNav.tsx        #       └─ Model selector + nav
│       │   │   └── RightPanel.tsx    #       └─ Info/details panel
│       │   │
│       │   ├── pages/               #   └─ Full page views
│       │   │   ├── LoginPage.tsx     #       └─ Auth screen
│       │   │   ├── ExplorePage.tsx   #       └─ Model discovery
│       │   │   ├── PromptsPage.tsx   #       └─ Prompt library
│       │   │   ├── ImageGenPage.tsx  #       └─ AI image generation
│       │   │   ├── MediaPage.tsx     #       └─ File manager
│       │   │   └── SettingsPage.tsx  #       └─ User settings
│       │   │
│       │   └── ui/                  #   └─ Shared UI primitives
│       │       ├── OnyxBotLogo.tsx   #       └─ Animated bot SVG
│       │       └── StarfieldBackground.tsx # └─ Animated starfield canvas
│       │
│       └── lib/                     #   └─ Utility functions
│           ├── api.ts               #       └─ Centralized API URL config
│           └── utils.ts             #       └─ Utility helpers (cn, etc.)
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| 🐍 **Python** | 3.11+ | Backend runtime |
| 📦 **Node.js** | 20+ | Frontend build & dev server |
| 🗄️ **PostgreSQL** | 16+ | Database (local or [Neon.tech](https://neon.tech)) |

> 💡 **Tip:** You can use [Neon.tech](https://neon.tech) for a free cloud PostgreSQL database — no local install needed.

### ⚙️ Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create a Python virtual environment
python -m venv myenv

# 3. Activate it
# Windows:
myenv\Scripts\activate
# macOS/Linux:
source myenv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Configure environment variables
#    Copy .env.example to .env and fill in your API keys
cp .env.example .env

# 6. Run the backend server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 🎨 Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. (Optional) Configure environment variables
#    Copy .env.example to .env for production API URL
cp .env.example .env

# 4. Start the Vite dev server
npm run dev
```

> ⚠️ **Note:** In development mode, the frontend runs on `http://localhost:5173` and the backend on `http://localhost:8000`. The Vite dev server proxies `/api` requests automatically via `vite.config.ts`.

### 🔑 Environment Variables

#### Backend (`backend/.env`)

```env
# Database — PostgreSQL connection string (local or Neon.tech)
DATABASE_URL=postgresql://onyx:onyxpass@localhost:5432/onyxdb

# LLM API Keys
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
HF_TOKEN=your_huggingface_token

# Auth — JWT signing secret (use a long random string in production)
JWT_SECRET_KEY=your_secret_key

# CORS — Frontend URL (leave empty or * for development)
FRONTEND_URL=
```

#### Frontend (`frontend/.env`)

```env
# Backend API URL — leave empty for local dev (Vite proxy handles it)
# Set to deployed backend URL in production
VITE_API_URL=
```

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
                              Token stored in localStorage
                                        │
                                        ▼
                           All subsequent requests include:
                           Authorization: Bearer <token>
                                        │
                                        ▼
                           Token verified on mount via
                           GET /api/profile
```

### 🛡️ Security Details

| Component | Implementation |
|-----------|---------------|
| **Hashing** | SHA-256 with 32-byte random salt per user |
| **Token Format** | JWT (HS256 algorithm) |
| **Token Expiry** | 24 hours |
| **Secret Key** | Configurable via `JWT_SECRET_KEY` env variable |
| **Storage** | `localStorage` with key `onyx_auth_token` |
| **Transport** | HTTP Bearer token in `Authorization` header |
| **Validation** | Auto-validates stored token on app mount |

> ⚠️ **Production Warning:** Set a strong `JWT_SECRET_KEY` in your `backend/.env` before deploying. The default key is for development only.

---

## 🤖 AI Models

Onyx integrates **three distinct AI chat providers**, each with a unique personality:

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

## 🎨 Image Generation

Onyx includes a built-in **AI image generation** page powered by **Hugging Face's FLUX.1-schnell** model.

| Property | Value |
|----------|-------|
| **Provider** | Hugging Face Serverless Inference API |
| **Model** | `black-forest-labs/FLUX.1-schnell` |
| **Output** | PNG images (base64 encoded) |
| **API Key** | `HF_TOKEN` environment variable |

### Features

- **Text-to-image** generation from natural language prompts
- **Prompt suggestions** — 6 curated creative prompts to get started
- **Image gallery** — all generated images displayed in a responsive 2-column grid
- **Download** — save any generated image as PNG
- **Copy prompt** — copy the prompt text to clipboard for reuse
- **Error handling** — friendly messages for rate limits, model loading, permission errors

> 💡 **Tip:** Hugging Face free tier has rate limits. If you hit a `429` error, wait a minute and try again.

---

## 📡 API Reference

All endpoints are prefixed with `/api` and require JWT authentication (except login and health check).

### 🏥 Health Check

#### `GET /`
> Health check endpoint. Returns `{"status": "ok", "service": "Onyx AI Backend"}`.

---

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
  "response": "Oh, you want me to solve philosophy now? 🙄 Fine...",
  "is_error": false
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

### 🎨 Image Generation Endpoint

#### `POST /api/generate-image`
> Generate an image using FLUX.1-schnell via Hugging Face.

```json
// Request
{
  "prompt": "A mystical forest with glowing mushrooms at twilight"
}

// Response (200 OK)
{
  "success": true,
  "image_base64": "iVBORw0KGgo...",
  "prompt": "A mystical forest with glowing mushrooms at twilight",
  "mime_type": "image/png"
}

// Response (Error)
{
  "success": false,
  "error": "⏳ **Rate Limit Reached**\n\nHugging Face free tier has a rate limit. Please wait a minute and try again."
}
```

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
- Animated starfield background with nebulae
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

### 🪄 Image Gen Page
AI-powered image generation:
- Text prompt input with keyboard shortcuts (`Enter` to generate, `Shift+Enter` for new line)
- Pre-loaded creative prompt suggestions
- Loading animation with rotating border effect
- Generated image gallery with hover overlay actions (download, copy prompt)
- Friendly error handling with contextual messages

### 📁 Media & Files Page
A full file management experience:
- Drag-and-drop upload zone with visual feedback
- Tabular file listing with type icons and thumbnails
- In-app preview modal for images, videos, and PDFs
- Context menu for file actions (open, download, delete)
- Automatic file type detection

### ⚙️ Settings Page
Complete user and app configuration:
- **Profile**: Edit display name and email
- **Password**: Change password with current-password verification
- **Appearance**: Toggle dark/light theme
- **AI Preferences**: Set default model, view/reset token usage
- **Session**: Sign out (danger zone)

---

## ⚙️ Configuration

### 🔑 Environment Variables

#### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://onyx:onyxpass@localhost:5432/onyxdb` | PostgreSQL connection string |
| `GROQ_API_KEY` | — | Groq API key for Nexus |
| `GEMINI_API_KEY` | — | Google AI API key for Gemini |
| `MISTRAL_API_KEY` | — | Mistral AI API key |
| `HF_TOKEN` | — | Hugging Face token for image generation |
| `JWT_SECRET_KEY` | `onyx-secret-key-change-in-production` | JWT signing secret |
| `FRONTEND_URL` | — | Frontend URL for CORS (leave empty for dev) |

#### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `""` (empty) | Backend API URL. Empty = use Vite proxy for dev |

> 🔴 **Important:** Never commit `.env` files to version control. Use `.env.example` as a template.

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
| 🧩 clsx + tailwind-merge | Latest | Conditional class utilities |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| 🐍 Python | 3.11 | Runtime |
| 🚀 FastAPI | Latest | Web framework |
| 🦄 Uvicorn | Latest | ASGI server |
| 🗃️ SQLAlchemy | Latest | ORM |
| 🐘 psycopg2-binary | Latest | PostgreSQL driver |
| 🔐 python-jose | Latest | JWT encoding/decoding |
| 📝 Pydantic | Latest | Data validation |
| 🔑 passlib | Latest | Password hashing utilities |
| 🌱 python-dotenv | Latest | Environment variable loading |
| 🤗 huggingface_hub | Latest | Hugging Face API client |
| 🖼️ Pillow | Latest | Image processing |

### AI Providers
| Provider | SDK | Model | Capability |
|----------|-----|-------|------------|
| 🟢 Groq | `groq` | LLaMA 3.1 8B Instant | Chat |
| 🔵 Google | `google-genai` | Gemini 2.5 Flash | Chat + Vision |
| 🟠 Mistral AI | `mistralai` | Mistral Small Latest | Chat + Vision |
| 🟡 Hugging Face | `huggingface_hub` | FLUX.1-schnell | Image Generation |

---

## 🛣️ Roadmap

- [ ] 🔊 Text-to-Speech output
- [ ] 📱 Mobile responsive layout
- [ ] 🧩 Plugin/extension system
- [ ] 📤 Export chat as PDF/Markdown
- [ ] 🔍 Full-text search across chat history
- [ ] 👥 Multi-user registration
- [ ] 🌊 Streaming responses (SSE)
- [ ] 📊 Usage analytics dashboard
- [x] 🔑 Environment variable-based API key management
- [x] 🎨 AI image generation (FLUX.1)
- [x] 🌌 Animated starfield background

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
