import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AuthUser, getMe, loginUser, registerUser } from '../data/api';
import { getAuthToken, removeAuthToken, setAuthToken } from '../data/authStorage';

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  register: (input: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = await getAuthToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const nextUser = await getMe();
      setUser(nextUser);
    } catch {
      await removeAuthToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (input: { email: string; password: string }) => {
    const response = await loginUser(input);
    await setAuthToken(response.token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (input: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await registerUser(input);
    await setAuthToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await removeAuthToken();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
  }), [isLoading, login, logout, refreshUser, register, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
