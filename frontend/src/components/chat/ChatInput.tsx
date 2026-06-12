import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Mic, Code2, ArrowUp, X, MicOff } from 'lucide-react';
import OnyxBotLogo from '../ui/OnyxBotLogo';
import { useChat } from '../../context/ChatContext';

export default function ChatInput() {
  const {
    sendMessage, isCodeMode, toggleCodeMode,
    isListening, startListening, stopListening,
    attachedFiles, removeFile, triggerFilePicker, addFiles,
  } = useChat();

  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (text.length > 0 && isFocused) {
      setIsTyping(true);
      timeout = setTimeout(() => setIsTyping(false), 1000);
    } else {
      setIsTyping(false);
    }
    return () => clearTimeout(timeout);
  }, [text, isFocused]);

  const handleSend = () => {
    if (!text.trim()) return;
    setIsSending(true);
    
    setTimeout(() => {
      sendMessage(text);
      setText('');
      setIsSending(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setText(prev => prev + (prev ? ' ' : '') + transcript);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault(); // Prevent pasting image as text
      addFiles(imageFiles);
    }
  };

  // Generate preview URLs for attached images
  const imagePreviewUrls = attachedFiles
    .filter(f => f.type.startsWith('image/'))
    .map(f => URL.createObjectURL(f));

  return (
    <div className="w-full mx-auto px-6 pb-6 pt-2" style={{ maxWidth: 'min(95%, 1100px)' }}>
      <div className="relative">
        {/* Animated Onyx Bot */}
        <AnimatePresence>
          {(isFocused || isTyping || isSending) && (
            <motion.div 
              className="absolute pointer-events-none z-10"
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={
                isSending 
                  ? { x: 500, y: -200, scale: 0.8, opacity: 0, transition: { duration: 0.8, ease: "easeIn" } }
                  : { 
                      opacity: 1, 
                      y: isTyping ? -45 : -40, 
                      x: text.length > 0 ? Math.min(text.length * 7.5 + 20, 700) : 20, 
                      scale: isTyping ? 0.8 : 0.9 
                    }
              }
              exit={{ opacity: 0, y: 10, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {isTyping && !isSending ? (
                <div className="relative">
                   <div className="absolute inset-0 bg-primary/40 rounded-full blur-md"></div>
                   <OnyxBotLogo size={32} />
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }} 
                     animate={{ opacity: [0, 1, 0], x: -30 }} 
                     transition={{ repeat: Infinity, duration: 0.8 }}
                     className="absolute top-1/2 -left-4 w-2 h-2 rounded-full bg-accent blur-[1px]"
                   />
                </div>
              ) : (
                <OnyxBotLogo size={40} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attached files preview */}
        {attachedFiles.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {attachedFiles.map((file, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-card border border-foreground/10 rounded-lg px-2.5 py-1.5 text-xs text-text">
                {file.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(file)} alt={file.name} className="w-8 h-8 rounded object-cover" />
                ) : (
                  <Paperclip size={12} className="text-accent" />
                )}
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button onClick={() => removeFile(i)} className="text-muted hover:text-red-400 transition-colors">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={`relative bg-card/80 backdrop-blur-xl border rounded-3xl p-3 flex items-end gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all z-20 ${isCodeMode ? 'border-amber-500/50 shadow-[0_8px_30px_rgba(245,158,11,0.15)]' : 'border-foreground/10 focus-within:border-primary/50 focus-within:shadow-[0_8px_30px_rgba(56,189,248,0.15)]'}`}>
          
          {/* Attach file */}
          <button
            onClick={triggerFilePicker}
            className="p-2 text-muted hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors mb-1"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>
          
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={isCodeMode ? "Paste or type code..." : "Message Onyx AI... (paste images with Ctrl+V)"}
            className={`flex-1 bg-transparent border-none outline-none resize-none max-h-[150px] py-3 text-sm text-text placeholder:text-muted/60 ${isCodeMode ? 'font-mono' : ''}`}
            rows={1}
          />

          <div className="flex items-center gap-2 mb-1">
            {/* Voice */}
            <button
              onClick={handleVoiceClick}
              className={`p-2 rounded-xl transition-colors ${isListening ? 'text-red-400 bg-red-500/10 animate-pulse' : 'text-muted hover:text-foreground hover:bg-foreground/5'}`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Code mode */}
            <button
              onClick={toggleCodeMode}
              className={`p-2 rounded-xl transition-colors hidden sm:flex ${isCodeMode ? 'text-amber-400 bg-amber-500/10' : 'text-muted hover:text-foreground hover:bg-foreground/5'}`}
              title={isCodeMode ? 'Exit code mode' : 'Code mode'}
            >
              <Code2 size={20} />
            </button>
            
            {/* Send */}
            <button 
              onClick={handleSend}
              disabled={!text.trim() || isSending}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(56,189,248,0.4)] ml-1"
            >
              <ArrowUp size={20} className={isSending ? "animate-bounce" : ""} />
            </button>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-muted/60 mt-3">
          {isCodeMode && <span className="text-amber-400 mr-1">⟨/⟩ Code Mode Active</span>}
          Onyx AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
