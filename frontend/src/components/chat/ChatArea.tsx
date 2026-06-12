import React from 'react';
import EmptyState from './EmptyState';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useChat } from '../../context/ChatContext';

export default function ChatArea() {
  const { messages } = useChat();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col w-full mx-auto relative h-full" style={{ maxWidth: 'min(90%, 1200px)' }}>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="w-full mx-auto pb-10" style={{ maxWidth: 'min(95%, 1100px)' }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} {...msg} />
            ))}
          </div>
        )}
      </div>
      
      <div className={`flex-shrink-0 pt-4 ${messages.length > 0 ? 'bg-gradient-to-t from-background via-background/80 to-transparent' : ''}`}>
        <ChatInput />
      </div>
    </div>
  );
}
