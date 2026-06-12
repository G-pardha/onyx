import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { API_URL } from '../lib/api';

interface UserData {
  username: string;
  display_name: string;
  email: string;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  updateProfile: (data: { display_name?: string; email?: string; current_password?: string; new_password?: string }) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'onyx_auth_token';
const USER_KEY = 'onyx_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!token && !!user;

  // Verify token on mount
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (!res.ok) throw new Error('Invalid token');
          return res.json();
        })
        .then(data => {
          setUser(data);
          localStorage.setItem(USER_KEY, JSON.stringify(data));
        })
        .catch(() => {
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        });
    }
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        return err.detail || 'Login failed';
      }

      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return null; // no error
    } catch {
      return 'Cannot connect to server';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('onyx_chat_history');
  }, []);

  const updateProfile = useCallback(async (data: {
    display_name?: string;
    email?: string;
    current_password?: string;
    new_password?: string;
  }): Promise<string | null> => {
    if (!token) return 'Not authenticated';

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        return err.detail || 'Update failed';
      }

      const result = await res.json();
      setUser(result.user);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      return null;
    } catch {
      return 'Cannot connect to server';
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
