import React, { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import type { MessageProps } from '../components/chat/MessageBubble';
import { useAuth } from './AuthContext';
import { API_URL } from '../lib/api';

type ModelType = 'nexus' | 'gemini-2.5-flash' | 'mistral-small-latest';

export interface SavedChat {
  id: string;
  title: string;
  model: string;
  updatedAt: number;
  messageCount?: number;
  messages?: MessageProps[];
}

interface ChatContextType {
  model: ModelType;
  modelName: string;
  setModel: (model: ModelType) => void;
  tokenCount: number;
  setTokenCount: (count: number | ((prev: number) => number)) => void;
  tokenLimit: number;
  resetTokenCount: () => void;
  modelHasError: boolean;
  errorModelName: string | null;
  messages: MessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<MessageProps[]>>;
  sendMessage: (text: string) => Promise<void>;
  regenerateLastResponse: () => Promise<void>;
  clearChat: () => void;
  chatTitle: string;
  chatHistory: SavedChat[];
  currentChatId: string | null;
  newChat: () => void;
  loadChat: (id: string) => void;
  deleteChat: (id: string) => void;
  isCodeMode: boolean;
  toggleCodeMode: () => void;
  isListening: boolean;
  startListening: (onResult: (text: string) => void) => void;
  stopListening: () => void;
  attachedFiles: File[];
  addFiles: (files: FileList | File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  triggerFilePicker: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [model, setModelRaw] = useState<ModelType>('nexus');
  const [tokenCount, setTokenCount] = useState<number>(0);

  const MODEL_TOKEN_LIMITS: Record<ModelType, number> = {
    'nexus': 8192,
    'gemini-2.5-flash': 1048576,
    'mistral-small-latest': 32000,
  };

  // Switch model — keep token count, don't clear other model's errors
  const setModel = useCallback((newModel: ModelType) => {
    setModelRaw(newModel);
  }, []);

  const tokenLimit = MODEL_TOKEN_LIMITS[model];
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [errorModelName, setErrorModelName] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);

  const MODEL_NAMES: Record<ModelType, string> = {
    'nexus': 'Nexus',
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'mistral-small-latest': 'Mistral Small',
  };
  const modelName = MODEL_NAMES[model];

  // Only show error if the CURRENT model is the one that errored
  const modelHasError = errorModelName === modelName;

  // Helper to set error with auto-dismiss after 5 seconds
  const triggerError = useCallback((name: string) => {
    setErrorModelName(name);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorModelName(null), 5000);
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatHistory, setChatHistory] = useState<SavedChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const chatTitle = messages.find(m => m.role === 'user' && typeof m.content === 'string')?.content as string || 'New Chat';

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }), [token]);

  // Load chat history from API on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/chats`, { headers: authHeaders() })
      .then(res => res.ok ? res.json() : [])
      .then(data => setChatHistory(data))
      .catch(() => {});
  }, [token]);

  // Auto-save current chat to DB (debounced)
  useEffect(() => {
    if (messages.length === 0 || !token) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      const id = currentChatId || Date.now().toString();
      if (!currentChatId) setCurrentChatId(id);

      const title = (messages.find(m => m.role === 'user' && typeof m.content === 'string')?.content as string || 'New Chat').slice(0, 60);

      // Save to API
      fetch(`${API_URL}/api/chats`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          chat_id: id,
          title,
          model,
          messages: messages.filter(m => typeof m.content === 'string').map(m => ({
            id: m.id,
            role: m.role,
            content: m.content as string,
            time: m.time,
          })),
        }),
      })
        .then(() => {
          // Refresh history list
          return fetch(`${API_URL}/api/chats`, { headers: authHeaders() });
        })
        .then(res => res.ok ? res.json() : [])
        .then(data => setChatHistory(data))
        .catch(() => {});
    }, 1500); // Debounce 1.5s

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [messages, token]);

  const resetTokenCount = useCallback(() => setTokenCount(0), []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setTokenCount(0);
    setAttachedFiles([]);
    setCurrentChatId(null);
  }, []);

  const newChat = useCallback(() => {
    setMessages([]);
    setTokenCount(0);
    setAttachedFiles([]);
    setCurrentChatId(null);
  }, []);

  const loadChat = useCallback(async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/chats/${id}`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages || []);
      setModel((data.model || 'nexus') as ModelType);
      setTokenCount(0);
      setCurrentChatId(data.id);
      setAttachedFiles([]);
    } catch {}
  }, [token, authHeaders]);

  const deleteChat = useCallback(async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${API_URL}/api/chats/${id}`, { method: 'DELETE', headers: authHeaders() });
      setChatHistory(prev => prev.filter(c => c.id !== id));
      if (currentChatId === id) {
        setMessages([]);
        setTokenCount(0);
        setCurrentChatId(null);
      }
    } catch {}
  }, [token, currentChatId, authHeaders]);

  const sendMessage = useCallback(async (text: string) => {
    const userContent = isCodeMode ? `\`\`\`\n${text}\n\`\`\`` : text;

    const imageDataList: { base64: string; mimeType: string; name: string }[] = [];
    for (const file of attachedFiles) {
      if (file.type.startsWith('image/')) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(file);
        });
        imageDataList.push({ base64, mimeType: file.type, name: file.name });
      }
    }
    // Build image data URLs for inline display
    const imagePreviewUrls = imageDataList.map(img => `data:${img.mimeType};base64,${img.base64}`);

    const newUserMsg: MessageProps = {
      id: Date.now().toString(),
      role: 'user',
      content: imageDataList.length > 0
        ? `${userContent}\n\n📎 ${imageDataList.map(f => f.name).join(', ')}`
        : userContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrls: imagePreviewUrls.length > 0 ? imagePreviewUrls : undefined,
    };

    setMessages(prev => [...prev, newUserMsg]);
    setTokenCount(prev => prev + Math.ceil(text.length / 4));
    setAttachedFiles([]);

    const history = messages
      .filter(msg => typeof msg.content === 'string')
      .map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : msg.role,
        content: msg.content as string
      }));
    history.push({ role: 'user', content: text });

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          messages: history,
          model,
          images: imageDataList.map(img => ({ base64: img.base64, mime_type: img.mimeType })),
        })
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      const data = await response.json();

      const newAiMsg: MessageProps = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newAiMsg]);

      // Only count tokens for real AI responses, not error messages
      if (data.is_error) {
        triggerError(MODEL_NAMES[model]);
      } else {
        setErrorModelName(null);
        setTokenCount(prev => prev + Math.ceil((data.response?.length || 0) / 4));
      }
    } catch (error) {
      console.error(error);
      triggerError(MODEL_NAMES[model]);
      const errorMsg: MessageProps = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: (
          "🌐 **Can't Reach Server**\n\n"
          + "Couldn't connect to the Onyx backend. Make sure Docker is running and the backend is healthy.\n\n"
          + "Run `docker compose up -d --build` to restart."
        ),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  }, [messages, model, isCodeMode, attachedFiles, authHeaders]);

  const regenerateLastResponse = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user' && typeof m.content === 'string');
    if (!lastUserMsg) return;
    setMessages(prev => {
      const lastAiIndex = prev.map((m, i) => ({ m, i })).filter(x => x.m.role === 'ai').pop()?.i;
      if (lastAiIndex !== undefined) return prev.filter((_, i) => i !== lastAiIndex);
      return prev;
    });
    await sendMessage(lastUserMsg.content as string);
  }, [messages, sendMessage]);

  const toggleCodeMode = useCallback(() => setIsCodeMode(prev => !prev), []);

  const startListening = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => { onResult(event.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => { recognitionRef.current?.stop(); setIsListening(false); }, []);
  const addFiles = useCallback((files: FileList | File[]) => setAttachedFiles(prev => [...prev, ...Array.from(files)]), []);
  const removeFile = useCallback((index: number) => setAttachedFiles(prev => prev.filter((_, i) => i !== index)), []);
  const clearFiles = useCallback(() => setAttachedFiles([]), []);
  const triggerFilePicker = useCallback(() => fileInputRef.current?.click(), []);

  return (
    <ChatContext.Provider value={{
      model, modelName, setModel,
      tokenCount, setTokenCount, tokenLimit, resetTokenCount,
      modelHasError, errorModelName,
      messages, setMessages, sendMessage, regenerateLastResponse, clearChat, chatTitle,
      chatHistory, currentChatId, newChat, loadChat, deleteChat,
      isCodeMode, toggleCodeMode,
      isListening, startListening, stopListening,
      attachedFiles, addFiles, removeFile, clearFiles, triggerFilePicker, fileInputRef,
    }}>
      <input type="file" ref={fileInputRef} className="hidden" multiple
        onChange={(e) => { if (e.target.files) { addFiles(e.target.files); e.target.value = ''; } }}
      />
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
}
