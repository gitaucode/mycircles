import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCircles } from '../../hooks/useCircles';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

// ── Upcoming feature cards ────────────────────────────────────────────────────
const UPCOMING = [
  {
    id: 'polls',
    icon: 'bar-chart-outline',
    title: 'Polls',
    desc: 'Vote on anything with your circle — plans, opinions, decisions.',
  },
  {
    id: 'memories',
    icon: 'images-outline',
    title: 'Memories',
    desc: 'Shared photo grids from your most memorable moments together.',
  },
  {
    id: 'prompts',
    icon: 'chatbubble-ellipses-outline',
    title: 'Prompts',
    desc: 'Spark conversations with daily questions inside your circles.',
  },
  {
    id: 'timecapsule',
    icon: 'time-outline',
    title: 'Time Capsules',
    desc: 'Lock away a message or photo — revealed at a future date.',
  },
];

export default function MomentsScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);
  const { circles, isLoading } = useCircles();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabClearance }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Moments</Text>
            <Text style={styles.pageSubtitle}>Activity from your circles</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.75 }]}
            onPress={() => router.push('/modal/create-circle')}
          >
            <Ionicons name="add" size={20} color="#111827" />
          </Pressable>
        </View>

        {/* ── Coming soon banner ── */}
        <View style={styles.section}>
          <View style={styles.bannerCard}>
            <View style={styles.bannerIconWrap}>
              <Ionicons name="sparkles" size={28} color="#111827" />
            </View>
            <Text style={styles.bannerTitle}>
              {isLoading ? 'Loading moments…' : 'Moments are on the way'}
            </Text>
            <Text style={styles.bannerText}>
              Real activity from your circles — plans, memories, polls, and prompts — will appear here soon.
            </Text>

            {/* CTA */}
            <Pressable
              style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.82 }]}
              onPress={() =>
                circles.length > 0
                  ? router.push('/(tabs)/circles')
                  : router.push('/modal/create-circle')
              }
            >
              <Text style={styles.ctaText}>
                {circles.length > 0 ? 'Open Your Circles' : 'Create a Circle'}
              </Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* ── Upcoming features ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <Text style={styles.sectionSub}>Features we're building for you</Text>
          <View style={styles.featureGrid}>
            {UPCOMING.map((item) => (
              <View key={item.id} style={styles.featureCard}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={item.icon as any} size={22} color="#111827" />
                </View>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1,
  },
  pageSubtitle: {
    fontSize: Typography.sm,
    color: Colors.muted,
    marginTop: 4,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: Typography.sm,
    color: Colors.muted,
    marginBottom: 14,
  },

  // Banner
  bannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  bannerIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  bannerText: {
    fontSize: Typography.sm,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111827',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 4,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Feature grid
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  featureDesc: {
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 18,
  },
});
