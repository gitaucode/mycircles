import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { CIRCLE_ICONS } from '../../constants/assets';
import { searchUsers } from '../../data/api';
import { USER_AVATARS } from '../../constants/assets';
import { useToast } from '../providers/ToastProvider';

// ── Mock public circles for UI demo ──────────────────────────────────────────
const FEATURED_CIRCLES = [
  { id: 'f1', name: 'Hiking Enthusiasts', emoji: 'camping', members: 42, tag: 'Outdoors' },
  { id: 'f2', name: 'Book Club', emoji: 'reading', members: 18, tag: 'Culture' },
  { id: 'f3', name: 'Startup Founders', emoji: 'office', members: 31, tag: 'Work' },
  { id: 'f4', name: 'Foodies Unite', emoji: 'food', members: 57, tag: 'Lifestyle' },
];

const CATEGORIES = [
  { label: 'All', icon: 'apps' },
  { label: 'Friends', icon: 'people' },
  { label: 'Work', icon: 'briefcase' },
  { label: 'Hobbies', icon: 'color-palette' },
  { label: 'Outdoors', icon: 'leaf' },
  { label: 'Culture', icon: 'book' },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [peopleResults, setPeopleResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const toast = useToast();

  async function handleSearch(text: string) {
    setQuery(text);
    if (text.trim().length < 2) {
      setPeopleResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchUsers(text.trim());
      setPeopleResults(results);
    } catch {
      // silently fail for explore
    } finally {
      setIsSearching(false);
    }
  }

  const showPeople = query.trim().length >= 2;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabClearance }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Explore</Text>
          <Text style={styles.pageSubtitle}>Discover circles and people</Text>
        </View>

        {/* ── Search Bar ── */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search people or circles…"
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query.length > 0 && (
              <Pressable onPress={() => { setQuery(''); setPeopleResults([]); }}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        {/* ── People results ── */}
        {showPeople && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>People</Text>
            {isSearching ? (
              <View style={styles.centerCard}>
                <ActivityIndicator color={Colors.violet} />
              </View>
            ) : peopleResults.length === 0 ? (
              <View style={styles.centerCard}>
                <Text style={styles.mutedText}>No users found for "{query}"</Text>
              </View>
            ) : (
              <View style={styles.card}>
                {peopleResults.map((person, i) => (
                  <View key={person.id} style={[styles.personRow, i < peopleResults.length - 1 && styles.rowBorder]}>
                    <Image
                      source={USER_AVATARS[person.avatarId as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1']}
                      style={styles.personAvatar}
                    />
                    <View style={styles.personMeta}>
                      <Text style={styles.personName}>{person.name}</Text>
                      <Text style={styles.personUsername}>@{person.username}</Text>
                    </View>
                    <Pressable
                      style={styles.connectBtn}
                      onPress={() => toast.show('Invite sent!', 'success')}
                    >
                      <Text style={styles.connectText}>Connect</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── Categories ── */}
        {!showPeople && (
          <>
            <View style={styles.categoriesRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.label}
                    style={[styles.categoryPill, activeCategory === cat.label && styles.categoryPillActive]}
                    onPress={() => setActiveCategory(cat.label)}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={14}
                      color={activeCategory === cat.label ? '#FFFFFF' : '#6B7280'}
                    />
                    <Text style={[styles.categoryLabel, activeCategory === cat.label && styles.categoryLabelActive]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* ── Join via invite ── */}
            <View style={styles.section}>
              <Pressable
                style={styles.inviteBanner}
                onPress={() => router.push('/modal/join-circle')}
              >
                <View style={styles.inviteIconWrap}>
                  <Ionicons name="link" size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inviteTitle}>Have an invite link?</Text>
                  <Text style={styles.inviteSub}>Tap to join a private circle</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
            </View>

            {/* ── Featured circles ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured Circles</Text>
              <Text style={styles.sectionSub}>Public circles you might enjoy</Text>
              <View style={styles.card}>
                {FEATURED_CIRCLES.map((circle, i) => (
                  <Pressable
                    key={circle.id}
                    style={[styles.circleRow, i < FEATURED_CIRCLES.length - 1 && styles.rowBorder]}
                    onPress={() => toast.show('Public circles coming soon!', 'info')}
                  >
                    <View style={styles.circleIconWrap}>
                      <Image
                        source={CIRCLE_ICONS[circle.emoji as keyof typeof CIRCLE_ICONS]}
                        style={styles.circleIconImg}
                      />
                    </View>
                    <View style={styles.circleMeta}>
                      <Text style={styles.circleName}>{circle.name}</Text>
                      <Text style={styles.circleSub}>{circle.members} members · {circle.tag}</Text>
                    </View>
                    <View style={styles.joinBtn}>
                      <Text style={styles.joinText}>Join</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* ── Create own circle CTA ── */}
            <View style={styles.section}>
              <Pressable
                style={styles.createCta}
                onPress={() => router.push('/modal/create-circle')}
              >
                <Ionicons name="add-circle" size={32} color={Colors.violet} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.ctaTitle}>Start a new circle</Text>
                  <Text style={styles.ctaSub}>Invite friends and build your own community</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
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

  searchRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    padding: 0,
  },

  categoriesRow: {
    marginBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  categoryPillActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 16,
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
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  centerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  mutedText: {
    color: Colors.muted,
    fontSize: Typography.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },

  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  personAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
  },
  personMeta: { flex: 1 },
  personName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  personUsername: {
    fontSize: Typography.sm,
    color: Colors.muted,
    marginTop: 2,
  },
  connectBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#111827',
  },
  connectText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  inviteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  inviteIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  inviteSub: {
    fontSize: Typography.sm,
    color: Colors.muted,
    marginTop: 2,
  },

  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  circleIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIconImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  circleMeta: { flex: 1 },
  circleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  circleSub: {
    fontSize: Typography.sm,
    color: Colors.muted,
    marginTop: 2,
  },
  joinBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  joinText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  createCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  ctaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  ctaSub: {
    fontSize: Typography.sm,
    color: Colors.muted,
    marginTop: 2,
  },
});
