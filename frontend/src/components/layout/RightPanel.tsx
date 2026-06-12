import React from 'react';
import { MessageSquarePlus, Upload, Mic, Code, AlertTriangle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function RightPanel() {
  const {
    tokenCount, tokenLimit, clearChat,
    triggerFilePicker, isListening, startListening, stopListening,
    isCodeMode, toggleCodeMode,
    modelHasError, errorModelName, modelName, model,
  } = useChat();


  const remainingTokens = Math.max(0, tokenLimit - tokenCount);
  const remainingPercentage = Math.round((remainingTokens / tokenLimit) * 100);
  const circumference = 339.29;
  const strokeDashoffset = circumference * (1 - remainingPercentage / 100);

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(() => { });
    }
  };

  // Model color mapping
  const modelColor = model === 'nexus' ? '#22C55E' : model === 'gemini-2.5-flash' ? '#3B82F6' : '#F97316';

  const quickActions = [
    { label: 'New Chat', icon: MessageSquarePlus, onClick: clearChat, active: false },
    { label: 'Upload File', icon: Upload, onClick: triggerFilePicker, active: false },
    { label: 'Voice Chat', icon: Mic, onClick: handleVoiceClick, active: isListening },
    { label: 'Code Mode', icon: Code, onClick: toggleCodeMode, active: isCodeMode },
  ];

  return (
    <aside className="w-[280px] h-screen bg-surface border-l border-foreground/5 p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0">

      {/* Model Status Card */}
      <div className="bg-card border border-foreground/5 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: modelHasError ? '#EF4444' : modelColor, boxShadow: `0 0 8px ${modelHasError ? 'rgba(239,68,68,0.5)' : modelColor + '80'}` }} />
          <span className="text-sm font-semibold text-text">{modelName}</span>
        </div>
        <p className="text-[10px] text-muted ml-6">
          {modelHasError ? 'Issue detected — see chat for details' : 'Online & ready'}
        </p>
      </div>

      {/* Model Error Banner — only shows for the model that actually errored, auto-dismisses */}
      {modelHasError && errorModelName && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 items-start animate-fade-in">
          <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-400 mb-1">Model Issue</p>
            <p className="text-[10px] text-red-400/80 leading-relaxed">
              {errorModelName} returned an error. Check the chat for details. Try switching models from the top bar.
            </p>
          </div>
        </div>
      )}

      {/* Context Usage Card */}
      <div className={`bg-card border rounded-2xl p-5 relative transition-all duration-300 ${modelHasError ? 'border-red-500/20 opacity-80' : 'border-foreground/5'}`}>

        <h3 className="text-sm font-semibold text-text mb-1">Chat Context</h3>
        <p className="text-[10px] text-muted mb-5">
          {modelHasError ? 'Model unavailable — switch to continue' : 'Conversation memory for this chat session'}
        </p>

        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64" cy="64" r="54"
                stroke="currentColor" strokeWidth="12" fill="transparent"
                className="text-foreground/5"
              />
              {/* Progress Ring — gray and empty when model has error */}
              <circle
                cx="64" cy="64" r="54"
                stroke={modelHasError ? '#6B7280' : 'url(#progressGradient)'}
                strokeWidth="12" fill="transparent"
                strokeDasharray="339.29"
                strokeDashoffset={modelHasError ? circumference : strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-500 ${modelHasError
                    ? 'opacity-30'
                    : remainingPercentage > 50
                      ? 'drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                      : remainingPercentage > 20
                        ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                        : 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  }`}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  {remainingPercentage > 50 ? (
                    <>
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </>
                  ) : remainingPercentage > 20 ? (
                    <>
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#EAB308" />
                    </>
                  ) : (
                    <>
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#DC2626" />
                    </>
                  )}
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              {modelHasError ? (
                <>
                  <span className="text-2xl font-bold text-red-400">0<span className="text-lg">%</span></span>
                  <span className="text-[10px] text-red-400/70 mt-1 uppercase tracking-wider">Unavailable</span>
                </>
              ) : (
                <>
                  <span className={`text-3xl font-bold ${remainingPercentage > 50 ? 'text-text' : remainingPercentage > 20 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{remainingPercentage}<span className="text-lg">%</span></span>
                  <span className="text-[10px] text-muted mt-1 uppercase tracking-wider">Available</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted">
          {modelHasError
            ? '⚠️ API limit reached — try another model'
            : `${remainingTokens.toLocaleString()} / ${tokenLimit.toLocaleString()} tokens`
          }
        </div>

        {/* Low token warning — only when model is healthy */}
        {!modelHasError && remainingPercentage <= 20 && remainingPercentage > 0 && (
          <div className="mt-3 text-center text-[10px] text-yellow-400 bg-yellow-500/10 rounded-lg py-1.5 px-2">
            ⚡ Running low — consider starting a new chat
          </div>
        )}
        {!modelHasError && remainingPercentage === 0 && (
          <div className="mt-3 text-center text-[10px] text-red-400 bg-red-500/10 rounded-lg py-1.5 px-2">
            🔴 Context full — start a new chat or reset usage
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-foreground/5 rounded-2xl p-5 mt-auto">
        <h3 className="text-sm font-semibold text-text mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`bg-background/50 hover:bg-foreground/5 border p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors ${action.active ? 'border-accent/50 bg-accent/5' : 'border-foreground/5'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action.active ? 'bg-accent/20 text-accent' : 'bg-foreground/10 text-accent'}`}>
                <action.icon size={16} />
              </div>
              <span className="text-[10px] text-muted">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}

