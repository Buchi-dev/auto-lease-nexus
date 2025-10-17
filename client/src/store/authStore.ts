import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
}

async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || res.statusText);
  }
  return res.json();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const data = await api<{ user: User; token: string }>(`/api/auth/login`, {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        set({ user: data.user, token: data.token, isAuthenticated: true });
      },
      register: async (name: string, email: string, password: string) => {
        const data = await api<{ user: User; token: string }>(`/api/auth/register`, {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
        set({ user: data.user, token: data.token, isAuthenticated: true });
      },
      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        const data = await api<{ user: User }>(`/api/auth/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ user: data.user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
