import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { UNAUTHORIZED_EVENT } from '@/api/apiClient';

const STORAGE_KEY = 'smarkets_session_token';

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage can throw in private-browsing/embedded contexts - treat as signed out.
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);

  const login = useCallback((newToken: string) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, newToken);
    } catch {
      // Ignore storage failures - the session will just not survive a refresh.
    }
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, login, logout]
  );

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
