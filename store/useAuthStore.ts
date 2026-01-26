import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    studentId: string;
    name: string;
    class: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: AuthState['user']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: true,
      error: null,
      
      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
        }),
      
      setLoading: (isLoading) => 
        set({ isLoading }),
      
      setError: (error) => 
        set({ error, isLoading: false }),
      
      logout: () => 
        set({ 
          isAuthenticated: false, 
          user: null,
          error: null 
        }),
      
      reset: () => 
        set({ 
          isAuthenticated: false, 
          user: null, 
          isLoading: false, 
          error: null 
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// Helper hook to get current user ID for game telemetry
export const useCurrentUserId = (): string | null => {
  const user = useAuthStore((state) => state.user);
  return user?.studentId || null;
};

// Helper hook to check if user is authenticated
export const useIsAuthenticated = (): boolean => {
  return useAuthStore((state) => state.isAuthenticated);
};

