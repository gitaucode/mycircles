import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CircleCard from '../../components/CircleCard';
import AddCircleCard from '../../components/AddCircleCard';
import CircleActionSheet from '../../components/CircleActionSheet';
import { Circle } from '../../data/mockData';
import { useCircles } from '../../hooks/useCircles';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/colors';

function getTimeGreeting(): { label: string; icon: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { label: 'Good morning', icon: '🌤️' };
  if (hour < 17) return { label: 'Good afternoon', icon: '☀️' };
  return { label: 'Good evening', icon: '🌙' };
}

// ── Header component rendered above the grid ─────────────────────────────────

function CirclesHeader({
  circles,
  userName,
  userInitials,
  userGradientIndex,
}: {
  circles: Circle[];
  userName: string;
  userInitials: string;
  userGradientIndex: number;
}) {
  const { label: greetLabel, icon: greetIcon } = getTimeGreeting();
  const totalPeople = circles.reduce((acc, c) => acc + c.memberCount, 0);
  const firstName = userName.trim().split(' ')[0] || 'friend';
  const avatarGradient = Colors.avatarGradients[userGradientIndex] ?? Colors.gradientViolet;

  return (
    <LinearGradient
      colors={['#EDE8FF', '#F5F2FF', '#FAF8FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.timeGreet}>
          {greetLabel} {greetIcon}
        </Text>
        <View style={styles.topBarRight}>
          <Pressable style={styles.bellBtn} hitSlop={8}>
            <Ionicons name="notifications-outline" size={18} color="#5B3DD8" />
            <View style={styles.notifDot} />
          </Pressable>
          <Pressable>
            <LinearGradient colors={avatarGradient as [string, string]} style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </LinearGradient>
            <View style={styles.onlineDot} />
          </Pressable>
        </View>
      </View>

      {/* Greeting */}
      <View style={styles.greetingBlock}>
        <Text style={styles.greetingText}>Hey {firstName} 👋</Text>
        <Text style={styles.subtitleText}>What's happening in your world today?</Text>

        {/* Stats pills */}
        <View style={styles.pillsRow}>
          <View style={styles.statPill}>
            <Ionicons name="people" size={12} color="#7655F0" />
            <Text style={styles.statPillText}>{circles.length} circles</Text>
          </View>
          <View style={styles.statPill}>
            <Ionicons name="person" size={12} color="#7655F0" />
            <Text style={styles.statPillText}>{totalPeople} people</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

type GridItem = Circle | { id: '__add__' };

export default function CirclesScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);
  const { width } = useWindowDimensions();
  const { circles, refresh } = useCircles();
  const { user } = useAuth();
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);

  // Local state so reordering persists while app is open
  const [data, setData] = useState<GridItem[]>(() => [...circles, { id: '__add__' }]);

  useEffect(() => {
    setData([...circles, { id: '__add__' }]);
  }, [circles]);

  const PADDING_HORIZONTAL = 8;
  const ITEM_WIDTH = (width - PADDING_HORIZONTAL * 2) / 2;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaView style={styles.safe} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: tabClearance }}
            style={styles.list}
          >
            <CirclesHeader
              circles={circles}
              userName={user?.name ?? ''}
              userInitials={user?.initials ?? '?'}
              userGradientIndex={user?.gradientIndex ?? 0}
            />


            
            <View style={[styles.grid, { paddingHorizontal: PADDING_HORIZONTAL }]}>
              {data.map((item) => {
                const isAddCard = item.id === '__add__';

                return (
                  <View
                    key={item.id} 
                    style={[styles.gridItem, { width: ITEM_WIDTH }]}
                  >
                    <View style={styles.itemWrapper}>
                      {isAddCard ? (
                        <AddCircleCard
                          onPress={() => router.push('/modal/create-circle')}
                        />
                      ) : (
                        <CircleCard
                          circle={item as Circle}
                          onPress={() => router.push(`/circle/${item.id}/chat`)}
                          onLongPress={() => setSelectedCircle(item as Circle)}
                        />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <CircleActionSheet
            circle={selectedCircle}
            onClose={() => setSelectedCircle(null)}
          />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: '#EDE8FF',
  },
  list: {
    backgroundColor: '#FAF8FF',
  },
  itemWrapper: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    height: 216,
  },


  // ── Hero ──────────────────────────────────────────────
  hero: {
    paddingTop: 6,
    paddingBottom: 24,
    shadowColor: '#7655F0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 16,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    marginBottom: 18,
  },
  timeGreet: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7265A8',
    letterSpacing: 0.1,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(118, 85, 240, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F04444',
    borderWidth: 1.5,
    borderColor: '#EDE8FF',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#EDE8FF',
  },

  greetingBlock: {
    paddingHorizontal: 20,
    gap: 6,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2A1F5E',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7265A8',
    lineHeight: 20,
    marginBottom: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(118, 85, 240, 0.10)',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 100,
  },
  statPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B3DD8',
  },
});
