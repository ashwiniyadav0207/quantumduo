'use client';

import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  worker: { name: string; id: string; area: string } | null;
  login: (name: string, id: string, area: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [worker, setWorker] = useState<{ name: string; id: string; area: string } | null>(null);

  const login = (name: string, id: string, area: string) => {
    setWorker({ name, id, area });
  };

  const logout = () => {
    setWorker(null);
  };

  return <AuthContext.Provider value={{ worker, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
