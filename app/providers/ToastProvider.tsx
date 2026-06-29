import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (toast) {
      // Animate in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const timer = setTimeout(() => {
        hide();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: -20,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  };

  const show = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  let iconName = 'information-circle';
  let iconColor = Colors.navy || '#111827';
  
  if (toast?.type === 'success') {
    iconName = 'checkmark-circle';
    iconColor = Colors.success || '#10B981';
  } else if (toast?.type === 'error') {
    iconName = 'alert-circle';
    iconColor = Colors.error || '#EF4444';
  }

  const insets = useSafeAreaInsets();

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <View style={[styles.toastWrapper, { top: insets.top + 12 }]} pointerEvents="none">
          <Animated.View
            style={[
              styles.toast,
              { opacity, transform: [{ translateY }] },
            ]}
          >
            <Ionicons name={iconName as any} size={20} color={iconColor} />
            <Text style={styles.toastText}>{toast.message}</Text>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});
