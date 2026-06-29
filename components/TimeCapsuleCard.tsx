import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimeCapsule } from '../data/mockData';

type Props = {
  capsule: TimeCapsule;
  onPress?: () => void;
};

export default function TimeCapsuleCard({ capsule, onPress }: Props) {
  const totalDays = 7;
  const progress = Math.max(0, Math.min(1, 1 - capsule.daysUntilOpen / totalDays));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      {/* Top row: category pill + circle pill */}
      <View style={styles.topRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>🔒 Time Capsule</Text>
        </View>
        <View style={styles.circlePill}>
          <Text style={styles.circleEmoji}>{capsule.circleEmoji}</Text>
          <Text style={styles.circleName}>{capsule.circleName}</Text>
        </View>
      </View>

      {/* Body: lock icon + message */}
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed-outline" size={20} color="#7655F0" />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.headline}>
            A {capsule.type} from {capsule.senderName}
          </Text>
          <Text style={styles.sub}>Opens {capsule.openDate}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.barSection}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <Text style={styles.daysLabel}>
          {capsule.daysUntilOpen} day{capsule.daysUntilOpen !== 1 ? 's' : ''} to go
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryPill: {
    backgroundColor: '#EDE8FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#7655F0' },
  circlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F3FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  circleEmoji: { fontSize: 12 },
  circleName: { fontSize: 11, fontWeight: '600', color: '#7265A8' },

  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE8FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: { flex: 1, gap: 3 },
  headline: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 20,
  },
  sub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F96A3',
  },

  barSection: { gap: 5 },
  barTrack: {
    height: 4,
    backgroundColor: '#F0EEF9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#C4B5FD',
    borderRadius: 2,
  },
  daysLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A89EC4',
    alignSelf: 'flex-end',
  },
});
