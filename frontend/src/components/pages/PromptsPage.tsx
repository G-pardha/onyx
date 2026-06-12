import React, { useState } from 'react';
import { Zap, Sparkles, Plus, X, Send } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

interface PromptsPageProps {
  onNavigateHome?: () => void;
}

export default function PromptsPage({ onNavigateHome }: PromptsPageProps) {
  const { sendMessage } = useChat();
  const [showNewPrompt, setShowNewPrompt] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Development');

  const [prompts, setPrompts] = useState([
    { title: 'Code Reviewer', category: 'Development', desc: 'Act as a senior engineer and review my code for bugs, performance, and best practices.', uses: '2.4k' },
    { title: 'Technical Writer', category: 'Documentation', desc: 'Rewrite this raw brain-dump into a professional, clear, and concise technical document.', uses: '1.1k' },
    { title: 'React Expert', category: 'Development', desc: 'Help me architect a complex React application using modern state management.', uses: '8.5k' },
    { title: 'UX Consultant', category: 'Design', desc: 'Analyze this UI flow and suggest improvements for better user retention.', uses: '900' },
  ]);

  const handleUsePrompt = (desc: string) => {
    sendMessage(desc);
    if (onNavigateHome) onNavigateHome();
  };

  const handleAddPrompt = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    setPrompts(prev => [...prev, {
      title: newTitle,
      category: newCategory,
      desc: newDesc,
      uses: '0',
    }]);
    setNewTitle('');
    setNewDesc('');
    setShowNewPrompt(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 text-accent mb-2">
              <Zap size={24} />
              <h1 className="text-2xl font-bold text-text tracking-tight">Prompt Library</h1>
            </div>
            <p className="text-muted">Save, discover, and organize your most effective prompts.</p>
          </div>
          <button
            onClick={() => setShowNewPrompt(!showNewPrompt)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            {showNewPrompt ? <X size={18} /> : <Plus size={18} />}
            <span>{showNewPrompt ? 'Cancel' : 'New Prompt'}</span>
          </button>
        </header>

        {/* New Prompt Form */}
        {showNewPrompt && (
          <div className="bg-card border border-primary/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-text">Create New Prompt</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Prompt title..."
              className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Prompt instructions..."
              rows={3}
              className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
            <div className="flex items-center gap-3">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-background border border-foreground/10 rounded-xl px-4 py-2 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option>Development</option>
                <option>Design</option>
                <option>Documentation</option>
                <option>Marketing</option>
                <option>Other</option>
              </select>
              <button
                onClick={handleAddPrompt}
                disabled={!newTitle.trim() || !newDesc.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Plus size={14} />
                Add Prompt
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prompts.map((prompt, i) => (
            <div
              key={i}
              className="bg-card border border-foreground/5 rounded-2xl p-5 hover:border-primary/30 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors">{prompt.title}</h3>
                <span className="text-xs text-muted flex items-center gap-1 bg-background/50 px-2 py-1 rounded-md border border-foreground/5">
                  <Sparkles size={12} className="text-accent" />
                  {prompt.uses}
                </span>
              </div>
              <p className="text-sm text-muted mb-4 flex-1">{prompt.desc}</p>
              <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-foreground/5">
                <span className="text-[10px] uppercase tracking-wider font-medium text-accent bg-accent/10 px-2 py-1 rounded-md">
                  {prompt.category}
                </span>
                <button
                  onClick={() => handleUsePrompt(prompt.desc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                >
                  <Send size={12} />
                  Use Prompt
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
