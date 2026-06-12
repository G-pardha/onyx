import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Download, Loader2, Sparkles, Copy, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../lib/api';

export default function ImageGenPage() {
  const { token } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ prompt: string; base64: string; timestamp: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    'A mystical forest with glowing mushrooms and fireflies at twilight',
    'Cyberpunk samurai standing in neon-lit Tokyo rain, cinematic',
    'An astronaut floating above Earth, watercolor painting style',
    'A cozy cabin in snowy mountains with northern lights overhead',
    'Steampunk airship flying through golden clouds at sunset',
    'Crystal dragon emerging from a volcano, fantasy digital art',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImages(prev => [{
          prompt: prompt.trim(),
          base64: data.image_base64,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }, ...prev]);
        setPrompt('');
      } else {
        setError(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError('🌐 **Connection Error**\n\nCouldn\'t reach the server. Make sure the backend is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownload = (base64: string, promptText: string) => {
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${base64}`;
    a.download = `onyx-${promptText.slice(0, 30).replace(/[^a-z0-9]/gi, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header>
          <div className="flex items-center gap-3 text-accent mb-2">
            <Wand2 size={24} />
            <h1 className="text-2xl font-bold text-text tracking-tight">Image Generation</h1>
          </div>
          <p className="text-muted">Create stunning images with FLUX.1 AI — powered by Hugging Face</p>
        </header>

        {/* Prompt Input */}
        <div className="relative">
          <div className={`bg-card/80 backdrop-blur-xl border rounded-2xl p-4 transition-all ${isGenerating ? 'border-primary/50 shadow-[0_0_20px_rgba(56,189,248,0.1)]' : 'border-foreground/10 focus-within:border-primary/30'}`}>
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the image you want to create..."
              className="w-full bg-transparent border-none outline-none resize-none text-sm text-text placeholder:text-muted/60 min-h-[60px] max-h-[120px]"
              rows={2}
              disabled={isGenerating}
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-[10px] text-muted/50">
                Press <kbd className="px-1 py-0.5 rounded bg-foreground/5 text-muted/70 font-mono text-[9px]">Enter</kbd> to generate · <kbd className="px-1 py-0.5 rounded bg-foreground/5 text-muted/70 font-mono text-[9px]">Shift+Enter</kbd> for new line
              </p>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-purple-500 text-white rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(56,189,248,0.3)]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        {generatedImages.length === 0 && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="text-xs font-medium text-muted uppercase tracking-wider">✨ Try these prompts</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setPrompt(s); inputRef.current?.focus(); }}
                  className="px-3 py-1.5 bg-card/50 border border-foreground/5 rounded-full text-xs text-muted hover:text-text hover:border-primary/30 hover:bg-card transition-all"
                >
                  {s.length > 50 ? s.slice(0, 50) + '...' : s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading Animation */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card/50 border border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <Wand2 size={28} className="text-primary animate-pulse" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-2 rounded-2xl border border-primary/20"
                  style={{ background: 'conic-gradient(from 0deg, transparent, rgba(56, 189, 248, 0.1), transparent)' }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text mb-1">Creating your image...</p>
                <p className="text-[11px] text-muted">FLUX.1 is generating — this may take 10-30 seconds</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3"
          >
            <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-400 whitespace-pre-line">{error.replace(/\*\*/g, '')}</div>
          </motion.div>
        )}

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-text flex items-center gap-2">
              <Sparkles size={14} className="text-accent" />
              Generated Images ({generatedImages.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-card border border-foreground/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-background">
                    <img
                      src={`data:image/png;base64,${img.base64}`}
                      alt={img.prompt}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleDownload(img.base64, img.prompt)}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleCopyPrompt(img.prompt)}
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
                        title="Copy prompt"
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs text-muted truncate">{img.prompt}</p>
                    <p className="text-[10px] text-muted/50 mt-1">{img.timestamp} · FLUX.1-schnell</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
