import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, CheckCircle2, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import OnyxBotLogo from '../ui/OnyxBotLogo';
import { useChat } from '../../context/ChatContext';

export interface MessageProps {
  id: string;
  role: 'user' | 'ai';
  content: string | React.ReactNode;
  time: string;
  imageUrls?: string[]; // base64 data URLs for inline display
}

export default function MessageBubble({ role, content, time, imageUrls }: MessageProps) {
  const isUser = role === 'user';
  const { regenerateLastResponse } = useChat();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<null | 'up' | 'down'>(null);

  const handleCopy = async () => {
    if (typeof content === 'string') {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    regenerateLastResponse();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn("flex w-full gap-4 mb-8 group", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-primary/20">
            U
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-card border border-foreground/10 flex items-center justify-center">
            <OnyxBotLogo size={20} />
          </div>
        )}
      </div>

      <div className={cn("max-w-[80%]", isUser ? "items-end flex flex-col" : "items-start flex flex-col")}>
        {/* Inline images */}
        {imageUrls && imageUrls.length > 0 && (
          <div className={cn("flex flex-wrap gap-2 mb-2", isUser ? "justify-end" : "justify-start")}>
            {imageUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Attached image ${i + 1}`}
                className="max-w-[240px] max-h-[200px] rounded-2xl object-cover border border-foreground/10 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(url, '_blank')}
              />
            ))}
          </div>
        )}

        <div className={cn(
          "px-5 py-3.5 text-sm shadow-xl leading-relaxed whitespace-pre-wrap",
          isUser 
            ? "bg-gradient-to-br from-primary to-accent text-white rounded-[20px] rounded-tr-[4px]" 
            : "bg-card/80 backdrop-blur-md border border-foreground/5 text-text rounded-[20px] rounded-tl-[4px]"
        )}>
          {content}
        </div>
        
        <div className={cn("flex items-center gap-3 mt-2 px-1 text-[11px] text-muted", isUser && "flex-row-reverse")}>
          <span>{time}</span>
          {isUser && <CheckCircle2 size={12} className="text-accent" />}
          
          {!isUser && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Copy */}
              <button
                onClick={handleCopy}
                className="p-1 hover:text-foreground hover:bg-foreground/10 rounded transition-colors"
                title="Copy"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              </button>

              {/* Thumbs Up */}
              <button
                onClick={() => setLiked(prev => prev === 'up' ? null : 'up')}
                className={cn("p-1 rounded transition-colors", liked === 'up' ? "text-green-400 bg-green-500/10" : "hover:text-foreground hover:bg-foreground/10")}
                title="Good response"
              >
                <ThumbsUp size={12} />
              </button>

              {/* Thumbs Down */}
              <button
                onClick={() => setLiked(prev => prev === 'down' ? null : 'down')}
                className={cn("p-1 rounded transition-colors", liked === 'down' ? "text-red-400 bg-red-500/10" : "hover:text-foreground hover:bg-foreground/10")}
                title="Bad response"
              >
                <ThumbsDown size={12} />
              </button>

              {/* Regenerate */}
              <button
                onClick={handleRegenerate}
                className="p-1 hover:text-foreground hover:bg-foreground/10 rounded transition-colors"
                title="Regenerate response"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
