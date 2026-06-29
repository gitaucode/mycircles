import React, { useRef, useEffect } from 'react';
import { router, Tabs } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ColorValue,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

// ── Animated tab icon ─────────────────────────────────────────────────────────
function TabIcon({
  name,
  color,
  focused,
  label,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: ColorValue;
  focused: boolean;
  label: string;
}) {
  const outlineName = `${name}-outline` as keyof typeof Ionicons.glyphMap;
  const scale = useRef(new Animated.Value(focused ? 1 : 0.92)).current;
  const pillOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const pillScale = useRef(new Animated.Value(focused ? 1 : 0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.08 : 0.92,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(pillOpacity, {
        toValue: focused ? 1 : 0,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(pillScale, {
        toValue: focused ? 1 : 0.7,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={styles.tabItem}>
      {/* Active indicator pill behind icon */}
      <Animated.View
        style={[
          styles.activePill,
          { opacity: pillOpacity, transform: [{ scaleX: pillScale }] },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={focused ? name : outlineName} size={22} color={color} />
      </Animated.View>
      <Text
        style={[styles.tabLabel, { color }]}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {label}
      </Text>
    </View>
  );
}

// ── Custom tab button — removes Android grey ripple ───────────────────────────
function TabButton(props: any) {
  return (
    <Pressable
      {...props}
      android_ripple={null}
      style={({ pressed }) => [
        props.style,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    />
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  return (
    <Tabs
      initialRouteName="circles"
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: Math.max(insets.bottom + 12, 24),
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
        safeAreaInsets: { bottom: 0 },
        tabBarButton: (props) => <TabButton {...props} />,
      }}
    >
      {/* ── Visible tabs ────────────────────────────────── */}
      <Tabs.Screen
        name="circles"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="people" color={color} focused={focused} label="Circles" />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="sparkles" color={color} focused={focused} label="Moments" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} label="Profile" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="compass" color={color} focused={focused} label="Explore" />
          ),
        }}
      />

      {/* ── Hidden tabs (routes still accessible) ──────── */}
      <Tabs.Screen name="create" options={{ href: null }} />
      <Tabs.Screen name="home" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 8,
    height: 64,
    paddingBottom: 0,
    overflow: 'visible',
  },
  tabBarItem: {
    flex: 1,
    height: '100%',
  },
  tabBarIcon: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 2,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 13,
    textAlign: 'center',
    includeFontPadding: false,
    alignSelf: 'center',
  },
});
