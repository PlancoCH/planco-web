import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getMe, resendVerification } from '../api/auth';
import { ApiError } from '../api/client';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState({ user: null, loading: false, error: null });
      return;
    }

    getMe()
      .then((res) => {
        setState({ user: res.user, loading: false, error: null });
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState({ user: null, loading: false, error: null });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await apiLogin({ email, password });
      localStorage.setItem(TOKEN_KEY, res.token);
      setState({ user: res.user, loading: false, error: null });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Login failed. Please try again.';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw err;
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, passwordConfirmation: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await apiSignup({ name, email, password, password_confirmation: passwordConfirmation });
      setState((prev) => ({ ...prev, loading: false, error: null }));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Signup failed. Please try again.';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  const resendVerificationEmail = useCallback(async (email: string) => {
    await resendVerification(email);
  }, []);

  const setUser = useCallback((user: User) => {
    setState((prev) => ({ ...prev, user }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        resendVerificationEmail,
        setUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
