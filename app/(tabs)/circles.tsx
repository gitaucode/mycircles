import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ScrollView,
  Image,
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
import { Typography } from '../../constants/typography';
import { useAuth } from '../../contexts/AuthContext';
import { useCircles } from '../../hooks/useCircles';
import { CIRCLE_ICONS, USER_AVATARS } from '../../constants/assets';
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
  userAvatarId,
}: {
  circles: Circle[];
  userName: string;
  userInitials: string;
  userGradientIndex: number;
  userAvatarId?: string;
}) {
  const { label: greetLabel, icon: greetIcon } = getTimeGreeting();
  const totalPeople = circles.reduce((acc, c) => acc + c.memberCount, 0);
  const firstName = userName.trim().split(' ')[0] || 'friend';
  const avatarGradient = Colors.avatarGradients[userGradientIndex] ?? Colors.gradientViolet;

  return (
    <View style={styles.hero}>
      {/* Top bar (Actions only) */}
      <View style={styles.topBar}>
        <View style={styles.topBarRight}>
          <Pressable style={styles.bellBtn} hitSlop={8}>
            <Ionicons name="notifications-outline" size={18} color="#111827" />
            <View style={styles.notifDot} />
          </Pressable>
        </View>
      </View>

      {/* Centered Greeting Block */}
      <View style={styles.greetingBlock}>
        <Pressable onPress={() => router.push('/(tabs)/profile')} style={styles.heroAvatarWrapper}>
          <Image 
            source={USER_AVATARS[userAvatarId as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1']} 
            style={styles.heroAvatar} 
          />
          <View style={styles.onlineDotHero} />
        </Pressable>

        <Text style={styles.timeGreet}>
          {greetLabel} {greetIcon}
        </Text>
        <Text style={styles.greetingText}>Hey {firstName}</Text>
        <Text style={styles.subtitleText}>What's happening in your world today?</Text>

        {/* Stats pills */}
        <View style={styles.pillsRow}>
          <View style={styles.statPill}>
            <Ionicons name="people" size={12} color="#111827" />
            <Text style={styles.statPillText}>{circles.length} circles</Text>
          </View>
          <View style={styles.statPill}>
            <Ionicons name="person" size={12} color="#111827" />
            <Text style={styles.statPillText}>{totalPeople} people</Text>
          </View>
        </View>
      </View>
    </View>
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
              userAvatarId={user?.avatarId}
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
    backgroundColor: '#F9FAFB',
  },
  list: {
    backgroundColor: '#F9FAFB',
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


  hero: {
    paddingTop: 6,
    paddingBottom: 32,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    marginBottom: 8,
  },
  timeGreet: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  heroAvatarWrapper: {
    marginBottom: 8,
    position: 'relative',
  },
  heroAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
  },
  onlineDotHero: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  greetingBlock: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  greetingText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
});
