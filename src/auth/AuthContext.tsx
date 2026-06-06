import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  saveToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('access_token'));

  const saveToken = (newToken: string) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem('access_token');
    if (stored) setToken(stored);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
