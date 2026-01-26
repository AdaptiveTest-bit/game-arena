
import { create } from 'zustand';

export interface User {
  id: string;
  studentId: string;
  name: string;
  class: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      set({ user: null });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (data.authenticated && data.user) {
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Session check error:', error);
      set({ user: null, isLoading: false });
    }
  },
}));

