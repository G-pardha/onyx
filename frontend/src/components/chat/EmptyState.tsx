import React from 'react';
import { motion } from 'framer-motion';
import { Code, PenTool, FileText, Lightbulb, MonitorPlay } from 'lucide-react';
import OnyxBotLogo from '../ui/OnyxBotLogo';
import { useChat } from '../../context/ChatContext';

export default function EmptyState() {
  const { sendMessage, modelName } = useChat();

  const suggestions = [
    { icon: MonitorPlay, title: 'Build an app', prompt: 'Help me build a modern web application from scratch', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Code, title: 'Generate code', prompt: 'Generate a Python function that sorts a list using merge sort with detailed comments', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: FileText, title: 'Analyze files', prompt: 'How do I analyze a CSV file using Python pandas? Give me a step-by-step guide', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Lightbulb, title: 'Research a topic', prompt: 'Research the latest advancements in artificial intelligence and summarize the key breakthroughs', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: PenTool, title: 'Create content', prompt: 'Write a professional blog post about the future of AI in software development', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 h-full relative">

      {/* Content - on top of starfield (starfield is in MainLayout) */}
      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* Logo + Greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}
          className="flex flex-col items-center mb-10"
        >
          {/* Animated logo with glow ring */}
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 rounded-full border border-primary/20"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(56, 189, 248, 0.1), transparent, rgba(139, 92, 246, 0.1), transparent)',
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-8 rounded-full border border-purple-500/10"
              style={{
                background: 'conic-gradient(from 180deg, transparent, rgba(139, 92, 246, 0.05), transparent, rgba(236, 72, 153, 0.05), transparent)',
              }}
            />
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
              <OnyxBotLogo size={80} />
            </div>
          </div>

          {/* Greeting */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-400 tracking-tight mb-2"
          >
            {greeting} ✨
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-muted text-sm"
          >
            Powered by <span className="text-primary font-medium">{modelName}</span> — ask me anything
          </motion.p>
        </motion.div>

        {/* Suggestion Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full max-w-4xl"
        >
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendMessage(s.prompt)}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-card/30 backdrop-blur-sm border border-foreground/5 hover:border-primary/20 hover:bg-card/60 transition-all duration-300 shadow-lg shadow-black/10"
            >
              <div className={`p-3 rounded-xl ${s.bg} ${s.color} group-hover:scale-110 transition-transform duration-300`}>
                <s.icon size={20} />
              </div>
              <span className="text-xs font-medium text-text/80 group-hover:text-text transition-colors">{s.title}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 text-[11px] text-muted/50"
        >
          Press <kbd className="px-1.5 py-0.5 rounded bg-foreground/5 text-muted/70 font-mono text-[10px]">Enter</kbd> to send a message
        </motion.p>
      </div>
    </div>
  );
}
