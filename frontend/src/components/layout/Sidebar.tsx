import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, Zap, Folder, Settings, Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import OnyxBotLogo from '../ui/OnyxBotLogo';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function Sidebar({ currentPage, onNavigate }: { currentPage: string, onNavigate: (page: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAllChats, setShowAllChats] = useState(false);
  const { newChat, chatHistory, currentChatId, loadChat, deleteChat } = useChat();
  const { user } = useAuth();

  const initials = (user?.display_name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const navItems = [
    { icon: Home, id: 'home', label: 'Home' },
    { icon: Compass, id: 'explore', label: 'Explore' },
    { icon: Zap, id: 'prompts', label: 'Prompts' },
    { icon: Folder, id: 'media', label: 'Media' },
    { icon: Wand2, id: 'image-gen', label: 'Image Gen' },
    { icon: Settings, id: 'settings', label: 'Settings' },
  ];

  // Sort by most recent first
  const sortedChats = [...chatHistory].sort((a, b) => b.updatedAt - a.updatedAt);
  const visibleChats = showAllChats ? sortedChats : sortedChats.slice(0, 5);

  const handleNewChat = () => {
    newChat();
    onNavigate('home');
  };

  const handleLoadChat = (id: string) => {
    loadChat(id);
    onNavigate('home');
  };

  return (
    <motion.aside 
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-surface border-r border-foreground/5 flex flex-col p-4 flex-shrink-0 relative transition-all duration-300"
    >
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 bg-card border border-foreground/10 rounded-full p-1 text-muted hover:text-foreground z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex items-center gap-3 mb-6 px-1">
        <OnyxBotLogo size={42} />
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap overflow-hidden">
            <h1 className="text-xl font-bold text-text tracking-wide">Onyx <span className="text-accent">AI</span></h1>
            <p className="text-[10px] text-muted tracking-wider uppercase mt-0.5">Think. Build. Evolve.</p>
          </motion.div>
        )}
      </div>

      {/* New Chat button */}
      <button
        onClick={handleNewChat}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold mb-6 hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(56,189,248,0.3)]",
          collapsed ? "px-0" : "px-4"
        )}
      >
        <Plus size={18} />
        {!collapsed && <span>New Chat</span>}
      </button>

      <nav className="flex-1 overflow-y-auto space-y-1 pr-2">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex items-center gap-3 w-full p-2.5 rounded-xl text-sm transition-all duration-200 group",
              currentPage === item.id ? "bg-card text-accent border border-foreground/10" : "text-muted hover:bg-card/50 hover:text-text",
              collapsed && "justify-center"
            )}
          >
            <item.icon size={18} className={cn("transition-colors", currentPage === item.id ? "text-accent" : "group-hover:text-foreground")} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        {!collapsed && sortedChats.length > 0 && (
          <div className="mt-8 mb-3">
            <h3 className="text-[11px] font-semibold text-muted uppercase tracking-wider px-2 flex justify-between items-center">
              Recent Chats
              {sortedChats.length > 5 && (
                <button
                  onClick={() => setShowAllChats(!showAllChats)}
                  className="text-primary hover:underline normal-case tracking-normal cursor-pointer text-xs"
                >
                  {showAllChats ? 'Show less' : `See all (${sortedChats.length})`}
                </button>
              )}
            </h3>
          </div>
        )}
        
        {!collapsed && visibleChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleLoadChat(chat.id)}
            className={cn(
              "flex items-center justify-between p-2 rounded-xl hover:bg-card/50 text-muted cursor-pointer text-sm group transition-all",
              currentChatId === chat.id && "bg-card/50 text-text"
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              <MessageSquare size={14} className={cn("opacity-50 flex-shrink-0", currentChatId === chat.id && "text-accent opacity-100")} />
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs">{chat.title}</span>
                <span className="text-[10px] text-muted/60">{timeAgo(chat.updatedAt)}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-400 transition-all flex-shrink-0"
              title="Delete chat"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {!collapsed && sortedChats.length === 0 && (
          <div className="text-center text-xs text-muted/50 py-4 px-2">
            No conversations yet. Start a new chat!
          </div>
        )}
      </nav>

      {!collapsed && (
        <div className="mt-auto pt-4 border-t border-foreground/5">
          <div
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-foreground/5 cursor-pointer hover:bg-card/80 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-text">{user?.display_name || 'User'}</div>
              <div className="text-[11px] text-muted truncate">{user?.email || ''}</div>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div className="mt-auto pt-4 flex justify-center">
          <div
            onClick={() => onNavigate('settings')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white cursor-pointer hover:opacity-80 transition-opacity"
          >
            {initials}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
