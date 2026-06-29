import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';
import { useCircles } from '../../hooks/useCircles';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

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
        <LinearGradient
          colors={['#EDE8FF', '#F8F6FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getTimeGreeting()}, {firstName}</Text>
              <Text style={styles.subtitle}>Your private circles, plans, and chats.</Text>
            </View>
            <LinearGradient colors={avatarGradient as [string, string]} style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.initials ?? '?'}</Text>
            </LinearGradient>
          </View>
        </LinearGradient>

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
                  <LinearGradient colors={gradient as [string, string]} style={styles.circleIcon}>
                    <Text style={styles.circleEmoji}>{circle.emoji}</Text>
                  </LinearGradient>
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
  safe: { flex: 1, backgroundColor: Colors.background },
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
    color: Colors.navy,
    fontSize: Typography['2xl'],
    fontWeight: Typography.extrabold,
  },
  subtitle: {
    color: Colors.muted,
    fontSize: Typography.sm,
    marginTop: 4,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.sm,
    fontWeight: Typography.extrabold,
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
    color: Colors.navy,
    fontSize: Typography.lg,
    fontWeight: Typography.extrabold,
  },
  centerCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#ECEAF5',
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
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  pressed: { opacity: 0.82 },
  circleIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleEmoji: { fontSize: 23 },
  circleMeta: { flex: 1, gap: 2 },
  circleName: {
    color: Colors.navy,
    fontSize: Typography.base,
    fontWeight: Typography.extrabold,
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
