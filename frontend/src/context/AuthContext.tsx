import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginDemo: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nexus_auth_token');
    if (token) {
      authApi.getMe()
        .then((userData) => setUser(userData))
        .catch(() => {
          localStorage.removeItem('nexus_auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      // Auto demo user for instant frictionless browsing if no token
      setUser({
        id: 'demo-user-1',
        email: 'demo.researcher@antigravity.ai',
        full_name: 'Lead AI Researcher',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString()
      });
      setLoading(false);
    }
  }, []);

  const loginDemo = async () => {
    setLoading(true);
    try {
      const data = await authApi.loginDemo();
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, pass);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name?: string) => {
    setLoading(true);
    try {
      const data = await authApi.register(email, pass, name);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginDemo, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
