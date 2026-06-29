import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'my_circles_auth_token';

function canUseWebStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export async function getAuthToken() {
  if (Platform.OS === 'web') {
    return canUseWebStorage() ? window.localStorage.getItem(TOKEN_KEY) : null;
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setAuthToken(token: string) {
  if (Platform.OS === 'web') {
    if (canUseWebStorage()) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeAuthToken() {
  if (Platform.OS === 'web') {
    if (canUseWebStorage()) {
      window.localStorage.removeItem(TOKEN_KEY);
    }
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
