import React, { useState } from 'react';
import { Settings, User, Palette, Bot, Shield, Lock, Check, AlertCircle, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { model, setModel, tokenCount, tokenLimit, resetTokenCount } = useChat();
  const { user, updateProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    setProfileMsg(null);
    const err = await updateProfile({ display_name: displayName, email });
    if (err) {
      setProfileMsg({ type: 'error', text: err });
    } else {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in both password fields' });
      return;
    }
    if (newPassword.length < 4) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 4 characters' });
      return;
    }
    setSaving(true);
    setPasswordMsg(null);
    const err = await updateProfile({ current_password: currentPassword, new_password: newPassword });
    if (err) {
      setPasswordMsg({ type: 'error', text: err });
    } else {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    }
    setSaving(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <div className="flex items-center gap-3 text-accent mb-2">
            <Settings size={24} />
            <h1 className="text-2xl font-bold text-text tracking-tight">Settings</h1>
          </div>
          <p className="text-muted">Manage your account, preferences, and AI configuration.</p>
        </header>

        {/* Profile Section */}
        <div className="bg-card border border-foreground/5 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-foreground/5">
            <User size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Profile</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">Username</label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className="w-full bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 text-sm text-muted cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {profileMsg && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${profileMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {profileMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                {profileMsg.text}
              </div>
            )}

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Check size={14} />
              Save Profile
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-card border border-foreground/5 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-foreground/5">
            <Lock size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Change Password</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {passwordMsg && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${passwordMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {passwordMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                {passwordMsg.text}
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-card border border-foreground/10 text-text rounded-xl text-sm font-medium hover:bg-foreground/5 disabled:opacity-50 transition-colors"
            >
              <Lock size={14} />
              Change Password
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card border border-foreground/5 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-foreground/5">
            <Palette size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">Appearance</h2>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-text">Theme</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-foreground/10 text-sm text-text hover:bg-foreground/5 transition-colors"
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>

        {/* AI Preferences */}
        <div className="bg-card border border-foreground/5 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-foreground/5">
            <Bot size={18} className="text-accent" />
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">AI Preferences</h2>
          </div>
          <div className="divide-y divide-foreground/5">
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-text">Default Model</span>
              <div className="flex gap-2">
                {['nexus', 'gemini-2.5-flash', 'mistral-small-latest'].map(m => (
                  <button
                    key={m}
                    onClick={() => setModel(m as any)}
                    className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${model === m ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-background border border-foreground/10 text-muted hover:text-text'}`}
                  >
                    {m === 'nexus' ? 'Nexus' : m === 'gemini-2.5-flash' ? 'Gemini 2.5' : 'Mistral'}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-text">Token Usage</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">{tokenCount.toLocaleString()} / {tokenLimit.toLocaleString()}</span>
                <button onClick={resetTokenCount} className="text-xs text-accent hover:text-accent/80 transition-colors">Reset</button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-card border border-red-500/20 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/20">
            <Shield size={18} className="text-red-400" />
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Session</h2>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-text">Sign Out</p>
              <p className="text-xs text-muted">You will be returned to the login screen.</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
