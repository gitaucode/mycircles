import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AuthUser, getMe, loginUser, registerUser, updateMe } from '../data/api';
import { getAuthToken, removeAuthToken, setAuthToken } from '../data/authStorage';

import { Platform } from 'react-native';

async function registerForPushNotificationsAsync(): Promise<string | null> {
  let Notifications: any = null;
  let Device: any = null;
  let Constants: any = null;
  
  try {
    Notifications = require('expo-notifications');
    Device = require('expo-device');
    Constants = require('expo-constants').default;
  } catch (e) {
    console.warn('Push notifications not supported in this environment');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.warn('Must use physical device for Push Notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('Failed to get push token for push notification!');
    return null;
  }
  
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  
  if (!projectId) {
    console.warn('Project ID not found');
    return null;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    return pushTokenString;
  } catch (e: unknown) {
    console.warn(e);
    return null;
  }
}

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
  updateUser: (input: { avatarId?: string; photoUri?: string | null; name?: string; bio?: string; username?: string }) => Promise<void>;
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
      const serverUser = await getMe();
      setUser(serverUser);
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

    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
      await updateMe({ pushToken });
    }
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

    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
      await updateMe({ pushToken });
    }
  }, []);

  const logout = useCallback(async () => {
    await removeAuthToken();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (input: {
    avatarId?: string;
    photoUri?: string | null;
    name?: string;
    bio?: string;
    username?: string;
  }) => {
    // 1. Capture previous state for rollback
    let previousUser: AuthUser | null = null;
    setUser((prev) => {
      previousUser = prev;
      return prev ? { ...prev, ...input } : prev;
    });

    // 2. Try to sync with backend
    try {
      const updated = await updateMe(input);
      setUser(updated);
    } catch {
      // Revert if API fails
      setUser(previousUser);
      console.warn('[updateUser] API sync failed — reverting state.');
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  }), [isLoading, login, logout, refreshUser, register, updateUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
