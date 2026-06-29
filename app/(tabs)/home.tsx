import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';
import { useCircles } from '../../hooks/useCircles';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { CIRCLE_ICONS, USER_AVATARS } from '../../constants/assets';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);
  const { user } = useAuth();
  const { circles, isLoading, error } = useCircles();
  const firstName = user?.name?.trim().split(' ')[0] || 'there';
  const avatarGradient = Colors.avatarGradients[user?.gradientIndex ?? 0] ?? Colors.gradientViolet;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabClearance }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getTimeGreeting()}, {firstName}</Text>
              <Text style={styles.subtitle}>Your private circles, plans, and chats.</Text>
            </View>
            <Image 
              source={USER_AVATARS[user?.avatarId as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1']} 
              style={styles.userAvatar} 
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Circles</Text>
          <Pressable onPress={() => router.push('/modal/create-circle')} hitSlop={8}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.violet} />
          </Pressable>
        </View>

        {isLoading && circles.length === 0 ? (
          <View style={styles.centerCard}>
            <ActivityIndicator color={Colors.violet} />
            <Text style={styles.mutedText}>Loading circles</Text>
          </View>
        ) : error && circles.length === 0 ? (
          <View style={styles.centerCard}>
            <Ionicons name="cloud-offline-outline" size={30} color={Colors.error} />
            <Text style={styles.emptyTitle}>Could not load circles</Text>
            <Text style={styles.mutedText}>{error.message}</Text>
          </View>
        ) : circles.length === 0 ? (
          <View style={styles.centerCard}>
            <Ionicons name="people-outline" size={32} color={Colors.violet} />
            <Text style={styles.emptyTitle}>No circles yet</Text>
            <Text style={styles.mutedText}>
              Create your first circle and invite your people.
            </Text>
            <PrimaryButton
              label="Create a Circle"
              onPress={() => router.push('/modal/create-circle')}
              small
            />
          </View>
        ) : (
          <View style={styles.circleList}>
            {circles.map((circle) => {
              const gradient = Colors.avatarGradients[circle.gradientIndex] ?? Colors.gradientViolet;
              return (
                <Pressable
                  key={circle.id}
                  style={({ pressed }) => [styles.circleRow, pressed && styles.pressed]}
                  onPress={() => router.push(`/circle/${circle.id}/chat`)}
                >
                  <View style={styles.circleIconContainer}>
                    <Image source={CIRCLE_ICONS[circle.emoji as keyof typeof CIRCLE_ICONS]} style={styles.circleIcon} />
                  </View>
                  <View style={styles.circleMeta}>
                    <Text style={styles.circleName}>{circle.name}</Text>
                    <Text style={styles.circleSub}>
                      {circle.memberCount} {circle.memberCount === 1 ? 'member' : 'members'}
                    </Text>
                    {circle.lastMessage ? (
                      <Text style={styles.lastMessage} numberOfLines={1}>
                        {circle.lastMessage}
                      </Text>
                    ) : null}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.mutedLight} />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { paddingBottom: 24 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  greeting: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: Colors.muted,
    fontSize: Typography.sm,
    marginTop: 4,
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  centerCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  emptyTitle: {
    color: Colors.navy,
    fontSize: Typography.lg,
    fontWeight: Typography.extrabold,
    textAlign: 'center',
  },
  mutedText: {
    color: Colors.muted,
    fontSize: Typography.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  circleList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  pressed: { opacity: 0.82 },
  circleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  circleIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  circleMeta: { flex: 1, gap: 2 },
  circleName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
  },
  circleSub: {
    color: Colors.muted,
    fontSize: Typography.sm,
  },
  lastMessage: {
    color: Colors.mutedLight,
    fontSize: Typography.xs,
    marginTop: 2,
  },
});
