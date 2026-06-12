from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from ai import groq_service, gemini_service, mistral_service, hugging_face

from database import init_db, get_db, User, ChatSession, ChatMessage
from auth import hash_password, verify_password, create_token, get_current_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Initializing database...")
    init_db()
    print("✅ Database ready!")
    yield


app = FastAPI(lifespan=lifespan)

# CORS: read allowed origin from FRONTEND_URL env var, fallback to * for development
frontend_url = os.environ.get("FRONTEND_URL", "*")
allowed_origins = [frontend_url] if frontend_url != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Auth Models ──────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class ProfileUpdateRequest(BaseModel):
    display_name: Optional[str] = None
    email: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None


# ── Chat Models ──────────────────────────────────────────────

class ImageData(BaseModel):
    base64: str
    mime_type: str


class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    model: str = "nexus"
    images: Optional[List[ImageData]] = None


class MessageData(BaseModel):
    id: str
    role: str
    content: str
    time: str


class SaveChatRequest(BaseModel):
    chat_id: str
    title: str
    model: str
    messages: List[MessageData]


# ── Auth Routes ──────────────────────────────────────────────

@app.post("/api/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == request.username).first()
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_token({"sub": user.username})
    return {
        "token": token,
        "user": {
            "username": user.username,
            "display_name": user.display_name,
            "email": user.email or "",
        },
    }


@app.get("/api/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "display_name": current_user.display_name,
        "email": current_user.email or "",
    }


@app.put("/api/profile")
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if request.display_name is not None:
        current_user.display_name = request.display_name
    if request.email is not None:
        current_user.email = request.email
    if request.new_password:
        if not request.current_password:
            raise HTTPException(status_code=400, detail="Current password is required to set a new password")
        if not verify_password(request.current_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        current_user.hashed_password = hash_password(request.new_password)

    db.commit()
    db.refresh(current_user)
    return {
        "message": "Profile updated successfully",
        "user": {
            "username": current_user.username,
            "display_name": current_user.display_name,
            "email": current_user.email or "",
        },
    }


# ── Chat History Routes ─────────────────────────────────────

@app.get("/api/chats")
async def get_chats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all chat sessions for the current user, sorted by most recent."""
    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )
    return [
        {
            "id": s.chat_id,
            "title": s.title,
            "model": s.model,
            "updatedAt": int(s.updated_at.timestamp() * 1000),
            "messageCount": len(s.messages),
        }
        for s in sessions
    ]


@app.get("/api/chats/{chat_id}")
async def get_chat(chat_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Load a specific chat session with all messages."""
    session = (
        db.query(ChatSession)
        .filter(ChatSession.chat_id == chat_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Chat not found")

    return {
        "id": session.chat_id,
        "title": session.title,
        "model": session.model,
        "updatedAt": int(session.updated_at.timestamp() * 1000),
        "messages": [
            {"id": m.msg_id, "role": m.role, "content": m.content, "time": m.time}
            for m in session.messages
        ],
    }


@app.post("/api/chats")
async def save_chat(
    request: SaveChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create or update a chat session."""
    session = (
        db.query(ChatSession)
        .filter(ChatSession.chat_id == request.chat_id, ChatSession.user_id == current_user.id)
        .first()
    )

    if session:
        # Update existing
        session.title = request.title
        session.model = request.model
        session.updated_at = __import__("datetime").datetime.utcnow()
        # Replace messages
        db.query(ChatMessage).filter(ChatMessage.session_id == session.id).delete()
    else:
        # Create new
        session = ChatSession(
            chat_id=request.chat_id,
            user_id=current_user.id,
            title=request.title,
            model=request.model,
        )
        db.add(session)
        db.flush()

    # Add messages
    for msg in request.messages:
        db.add(ChatMessage(
            session_id=session.id,
            msg_id=msg.id,
            role=msg.role,
            content=msg.content,
            time=msg.time,
        ))

    db.commit()
    return {"message": "Chat saved", "chat_id": request.chat_id}


@app.delete("/api/chats/{chat_id}")
async def delete_chat(chat_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Delete a chat session."""
    session = (
        db.query(ChatSession)
        .filter(ChatSession.chat_id == chat_id, ChatSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Chat not found")

    db.delete(session)
    db.commit()
    return {"message": "Chat deleted"}


# ── Chat AI Route ────────────────────────────────────────────

@app.post("/api/chat")
async def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    print(f"DEBUG: User '{current_user.username}' - model: {request.model}, images: {len(request.images) if request.images else 0}")
    images = [{"base64": img.base64, "mime_type": img.mime_type} for img in request.images] if request.images else []
    try:
        is_error = False
        if request.model == "nexus":
            if images:
                is_error = True
                response_text = (
                    "📷 **Image Analysis Not Supported on Nexus**\n\n"
                    "Nexus (Groq) is a text-only model and can't process images.\n\n"
                    "**Switch to one of these models for image analysis:**\n"
                    "- 🔵 **Gemini 2.5 Flash** — excellent vision capabilities\n"
                    "- 🟠 **Mistral Small** — also supports image input\n\n"
                    "You can switch models from the dropdown in the top bar."
                )
            else:
                response_text = await groq_service.generate_response(request.messages)
        elif "gemini" in request.model:
            response_text = await gemini_service.generate_response(request.messages, request.model, images=images)
        elif "mistral" in request.model:
            response_text = await mistral_service.generate_response(request.messages, request.model, images=images)
        else:
            is_error = True
            response_text = (
                f"❓ **Unknown Model: `{request.model}`**\n\n"
                "This model isn't recognized. Please select one of:\n"
                "- 🟢 **Nexus** (Groq)\n"
                "- 🔵 **Gemini 2.5 Flash**\n"
                "- 🟠 **Mistral Small**\n\n"
                "Use the model selector in the top bar to switch."
            )

        # Detect if an AI service returned a friendly error message
        error_prefixes = ("⏳", "🔑", "🛡️", "❓", "🌐", "⚠️", "📷", "🔧")
        if not is_error and response_text and response_text.strip().startswith(error_prefixes):
            is_error = True

        return {"response": response_text, "is_error": is_error}
    except Exception as e:
        # Never crash — always return a friendly message in the chat
        print(f"\nUnexpected Chat Error: {e}\n")
        return {"response": (
            "⚠️ **Unexpected Error**\n\n"
            "Something went wrong while processing your message. "
            "Please try again in a moment.\n\n"
            f"```\n{str(e)[:200]}\n```\n\n"
            "If this keeps happening, try switching to a different model from the top bar."
        ), "is_error": True}

# ─── Image Generation ─────────────────────────────────────────────

class ImageGenRequest(BaseModel):
    prompt: str

@app.post("/api/generate-image")
async def generate_image(request: ImageGenRequest, current_user: User = Depends(get_current_user)):
    print(f"DEBUG: User '{current_user.username}' - image gen: '{request.prompt[:60]}'")
    try:
        result = await hugging_face.generate_image(request.prompt)
        return result
    except Exception as e:
        print(f"\nImage Gen Error: {e}\n")
        return {
            "success": False,
            "error": f"⚠️ **Unexpected Error**\n\n{str(e)[:200]}",
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
