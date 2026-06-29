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

import PrimaryButton from '../../components/PrimaryButton';
import { useCircles } from '../../hooks/useCircles';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export default function MomentsScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);
  const { circles, isLoading } = useCircles();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabClearance }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Moments</Text>
            <Text style={styles.subtitle}>Real activity from your circles will appear here.</Text>
          </View>
          <Pressable style={styles.iconButton} onPress={() => router.push('/modal/create-circle')}>
            <Ionicons name="add" size={22} color={Colors.violet} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="sparkles-outline" size={34} color={Colors.violet} />
          </View>
          <Text style={styles.cardTitle}>
            {isLoading ? 'Loading moments' : 'Moments are coming next'}
          </Text>
          <Text style={styles.cardText}>
            We are keeping this screen quiet until plans, memories, polls, and prompts are backed by real data.
          </Text>

          {circles.length > 0 ? (
            <PrimaryButton
              label="Open Your Circles"
              onPress={() => router.push('/(tabs)/circles')}
              small
            />
          ) : (
            <PrimaryButton
              label="Create a Circle"
              onPress={() => router.push('/modal/create-circle')}
              small
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
  },
  title: {
    color: Colors.navy,
    fontSize: Typography['2xl'],
    fontWeight: Typography.extrabold,
  },
  subtitle: {
    color: Colors.muted,
    fontSize: Typography.sm,
    marginTop: 4,
    maxWidth: 260,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDE8FF',
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDE8FF',
  },
  cardTitle: {
    color: Colors.navy,
    fontSize: Typography.lg,
    fontWeight: Typography.extrabold,
    textAlign: 'center',
  },
  cardText: {
    color: Colors.muted,
    fontSize: Typography.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
});
