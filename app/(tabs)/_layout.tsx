import React from 'react';
import { router, Tabs } from 'expo-router';
import { View, Text, StyleSheet, ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

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

  return (
    <View style={styles.tabItem}>
      <Ionicons name={focused ? name : outlineName} size={22} color={color} />
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

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();
  const bottomInset = Math.max(insets.bottom, 8);

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
            height: 68 + bottomInset,
            paddingBottom: bottomInset,
          },
        ],
        tabBarItemStyle: styles.tabBarItem,
        // Expand the icon slot so our custom TabIcon (icon + label) fills the
        // full tab item height and can center itself properly.
        tabBarIconStyle: styles.tabBarIcon,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#7655F0',
        tabBarInactiveTintColor: '#8E94A3',
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
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="grid" color={color} focused={focused} label="Dashboard" />
          ),
        }}
      />

      {/* ── Hidden tabs (routes still accessible) ──────── */}
      <Tabs.Screen name="create" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EFF7',
    borderRadius: 0,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 14,
    paddingTop: 7,
    overflow: 'visible',
  },
  tabBarItem: {
    flex: 1,
    // Full height so the icon slot fills the whole pressable area
    height: '100%',
  },
  // The icon slot React Navigation creates around our tabBarIcon render prop.
  // By default it's a tiny fixed box — we override it to fill the tab item
  // so our custom View (icon + label) can centre itself properly.
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
    // Horizontal padding gives the label room; avoid squeezing to zero
    paddingHorizontal: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 13,
    textAlign: 'center',
    includeFontPadding: false,
    // Allow text to measure its full natural width inside the flex cell
    alignSelf: 'center',
  },
});
