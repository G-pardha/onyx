import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, Sparkles, Check, PanelRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../context/ChatContext';

export default function TopNav({ onTogglePanel, isPanelOpen }: { onTogglePanel: () => void; isPanelOpen: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { model, setModel, chatTitle } = useChat();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const models = [
    { id: 'nexus', name: 'Nexus (Groq)' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'mistral-small-latest', name: 'Mistral Small' }
  ];

  const currentModelName = models.find(m => m.id === model)?.name || 'Nexus (Groq)';

  // Truncate title for display
  const displayTitle = chatTitle.length > 50 ? chatTitle.slice(0, 50) + '...' : chatTitle;

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-foreground/5 bg-background flex-shrink-0">
      <div className="flex items-center gap-3">
        <Sparkles size={18} className="text-accent" />
        <h2 className="text-base font-semibold text-text">{displayTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-card border border-foreground/5">
          <button 
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-1.5 rounded-full transition-colors ${theme === 'light' ? 'bg-foreground/10 text-accent shadow-sm' : 'hover:bg-foreground/5 text-muted hover:text-foreground'}`}
          >
            <Sun size={16} />
          </button>
          <button 
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'bg-foreground/10 text-accent shadow-sm' : 'hover:bg-foreground/5 text-muted hover:text-foreground'}`}
          >
            <Moon size={16} />
          </button>
        </div>

        {/* Panel Toggle */}
        <button
          onClick={onTogglePanel}
          className={`p-2 rounded-xl border transition-colors ${isPanelOpen ? 'bg-accent/10 border-accent/30 text-accent' : 'bg-card border-foreground/5 text-muted hover:text-foreground hover:bg-foreground/5'}`}
          title={isPanelOpen ? 'Hide panel' : 'Show panel'}
        >
          <PanelRight size={16} />
        </button>

        {/* Model Selector */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-foreground/5 hover:bg-card/80 transition-colors text-sm font-medium text-text"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent text-background">
              <Sparkles size={12} className="text-white" />
            </span>
            {currentModelName}
            <ChevronDown size={14} className={`text-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-foreground/5 rounded-xl shadow-lg z-50 overflow-hidden">
              {models.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setModel(m.id as any);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-text hover:bg-foreground/5 transition-colors flex justify-between items-center"
                >
                  {m.name}
                  {model === m.id && <Check size={14} className="text-accent" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
