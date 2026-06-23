import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CircleInboxCard from '../../components/CircleInboxCard';
import PromptCard from '../../components/PromptCard';
import HangoutCard from '../../components/HangoutCard';

const MAYA_AVATAR = 'https://i.pravatar.cc/100?img=47';

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTimeGreeting(): { label: string; icon: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { label: 'Good morning', icon: '🌤️' };
  if (hour < 17) return { label: 'Good afternoon', icon: '☀️' };
  return { label: 'Good evening', icon: '🌙' };
}

// ── Streak Card ───────────────────────────────────────────────────────────────

type StreakProps = {
  flame: string;
  name: string;
  label: string;
  color: string;
  bg: string;
};

function StreakCard({ flame, name, label, color, bg }: StreakProps) {
  return (
    <View style={[streakStyles.card, { backgroundColor: bg }]}>
      <Text style={streakStyles.flame}>{flame}</Text>
      <Text style={[streakStyles.name, { color }]}>{name}</Text>
      <Text style={streakStyles.label}>{label}</Text>
    </View>
  );
}

const streakStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    width: 168,
    gap: 2,
  },
  flame: {
    fontSize: 24,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 17,
  },
  label: {
    fontSize: 11,
    color: '#6F7482',
    fontWeight: '500',
    lineHeight: 14,
  },
});

// ── Events data ───────────────────────────────────────────────────────────────

const EVENTS = [
  {
    id: 'e1',
    title: 'Beach Hangout 🌊',
    date: 'Saturday, 28 Jun',
    time: '3:00 PM',
    tag: 'Besties',
    goingCount: 4,
    imageUri:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: 'e2',
    title: "Wanja's Birthday 🎂",
    date: 'Sunday, 29 Jun',
    time: '6:00 PM',
    tag: 'Family',
    goingCount: 5,
    imageUri:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    id: 'e3',
    title: 'Movie Night 🎬',
    date: 'Friday, 4 Jul',
    time: '8:00 PM',
    tag: 'Campus Crew',
    goingCount: 3,
    imageUri:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=200&h=200',
  },
];

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);
  const { label: greetLabel, icon: greetIcon } = getTimeGreeting();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: tabClearance }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero surface ─────────────────────────────── */}
        <LinearGradient
          colors={['#EDE8FF', '#F5F2FF', '#FAF8FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Top bar: time greeting left, bell + avatar right */}
          <View style={styles.topBar}>
            <Text style={styles.timeGreet}>
              {greetLabel} {greetIcon}
            </Text>

            <View style={styles.topBarRight}>
              {/* Bell */}
              <Pressable style={styles.bellBtn} hitSlop={8}>
                <Ionicons name="notifications-outline" size={18} color="#5B3DD8" />
                <View style={styles.notifDot} />
              </Pressable>

              {/* Avatar */}
              <Pressable>
                <Image source={{ uri: MAYA_AVATAR }} style={styles.avatar} />
                <View style={styles.onlineDot} />
              </Pressable>
            </View>
          </View>

          {/* Greeting block — big + emotional */}
          <View style={styles.greetingBlock}>
            <Text style={styles.greetingText}>Hey Maya 👋</Text>
            <Text style={styles.subtitleText}>What's happening in your world today?</Text>

            {/* Status pill */}
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>4 circles active today</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Content ──────────────────────────────────── */}
        <View style={styles.scrollContent}>

          {/* Your Circles */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Circles</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.viewAll}>See all</Text>
            </Pressable>
          </View>

          <CircleInboxCard />

          {/* ── Streaks ────────────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Streaks 🔥</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.streaksRow}
          >
            <StreakCard
              flame="🔥"
              name="Besties"
              label="Active 6 days in a row"
              color="#F04D4F"
              bg="#FFF0F0"
            />
            <StreakCard
              flame="💚"
              name="Family"
              label="Everyone checked in this week"
              color="#20B889"
              bg="#DDFAED"
            />
            <StreakCard
              flame="⚡"
              name="Campus Crew"
              label="3 days strong"
              color="#2F9AF2"
              bg="#E6F3FF"
            />
          </ScrollView>

          {/* ── Today's Prompt ──────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Prompt</Text>
          </View>
          <View style={styles.paddedCard}>
            <PromptCard />
          </View>

          {/* ── Upcoming Events ──────────────────────────── */}
          <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.viewAll}>See all</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsRow}
          >
            {EVENTS.map((event) => (
              <View key={event.id} style={styles.eventCardWrap}>
                <HangoutCard
                  title={event.title}
                  date={event.date}
                  time={event.time}
                  imageUri={event.imageUri}
                  goingCount={event.goingCount}
                  tag={event.tag}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EDE8FF',
  },
  scroll: {
    flex: 1,
  },

  // ── Hero ─────────────────────────────────────────────
  hero: {
    paddingTop: 6,
    paddingBottom: 26,
    shadowColor: '#7655F0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 5,
  },

  // Top bar — time greeting on left, actions on right
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
    backgroundColor: '#C4B5FD',
    borderWidth: 2,
    borderColor: 'rgba(118, 85, 240, 0.3)',
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

  // Greeting block
  greetingBlock: {
    paddingHorizontal: 20,
    gap: 4,
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
    marginBottom: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(118, 85, 240, 0.10)',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 100,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7655F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B3DD8',
  },

  // ── Scroll content ────────────────────────────────────
  scrollContent: {
    backgroundColor: '#FAF8FF',
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionHeaderSpaced: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7655F0',
  },

  // Streaks
  streaksRow: {
    paddingHorizontal: 22,
    gap: 10,
    paddingBottom: 16,
  },

  // Prompt
  paddedCard: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },

  // Events carousel
  eventsRow: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 8,
  },
  eventCardWrap: {
    width: 290,
  },
});
