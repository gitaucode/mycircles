import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Stat accent colors — intentionally muted to stay in-system
const STAT_COLORS = [
  { bg: '#EDE8FF', text: '#7655F0' },  // messages — violet
  { bg: '#FFF0E6', text: '#F4845F' },  // hangouts — coral
  { bg: '#E6F3FF', text: '#2F9AF2' },  // photos — blue
];

type Props = {
  circleName: string;
  circleEmoji: string;
  month: string;
  messages: number;
  hangouts: number;
  photos: number;
  topMemory: string;
  streakDays: number;
};

export default function CircleWrappedCard({
  circleName,
  circleEmoji,
  month,
  messages,
  hangouts,
  photos,
  topMemory,
  streakDays,
}: Props) {
  const stats = [
    { icon: '💬', value: messages.toString(), label: 'messages', ...STAT_COLORS[0] },
    { icon: '🤝', value: hangouts.toString(), label: 'hangouts', ...STAT_COLORS[1] },
    { icon: '📸', value: photos.toString(), label: 'photos', ...STAT_COLORS[2] },
  ];

  const handleShare = () => {
    Share.share({
      message: `${circleEmoji} ${circleName} — ${month}\n\n💬 ${messages} messages · 🤝 ${hangouts} hangouts · 📸 ${photos} photos\n🔥 ${streakDays}-day streak · Top memory: ${topMemory}\n\n#MyCircles #CircleWrapped`,
    });
  };

  return (
    <View style={styles.card}>
      {/* Header: category pill + month */}
      <View style={styles.topRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>🎁 Circle Wrapped</Text>
        </View>
        <Text style={styles.month}>{month}</Text>
      </View>

      {/* Circle name */}
      <View style={styles.nameRow}>
        <Text style={styles.emoji}>{circleEmoji}</Text>
        <Text style={styles.circleName}>{circleName}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Stats row */}
      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={[styles.statChip, { backgroundColor: s.bg }]}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: s.text }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: s.text }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Highlights */}
      <View style={styles.highlights}>
        <View style={styles.highlightRow}>
          <Text style={styles.highlightLabel}>Top memory</Text>
          <Text style={styles.highlightValue}>{topMemory}</Text>
        </View>
        <View style={styles.highlightRow}>
          <Text style={styles.highlightLabel}>Streak</Text>
          <Text style={styles.highlightValue}>{streakDays} days 🔥</Text>
        </View>
      </View>

      {/* Share — same style as profile action buttons */}
      <Pressable
        onPress={handleShare}
        style={({ pressed }) => [styles.shareBtn, pressed && { opacity: 0.75 }]}
      >
        <Ionicons name="share-outline" size={14} color="#7655F0" />
        <Text style={styles.shareBtnText}>Share Recap</Text>
      </Pressable>
    </View>
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
    backgroundColor: '#F0FDF4',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  categoryText: { fontSize: 11, fontWeight: '700', color: '#16A34A' },
  month: { fontSize: 12, fontWeight: '600', color: '#8F96A3' },

  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emoji: { fontSize: 22 },
  circleName: { fontSize: 18, fontWeight: '900', color: '#111827', letterSpacing: -0.3 },

  divider: { height: 1, backgroundColor: '#F3F4F6' },

  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 3,
  },
  statIcon: { fontSize: 16 },
  statValue: { fontSize: 18, fontWeight: '900', lineHeight: 22 },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    opacity: 0.85,
  },

  highlights: { gap: 8 },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  highlightLabel: { fontSize: 13, fontWeight: '500', color: '#8F96A3' },
  highlightValue: { fontSize: 13, fontWeight: '800', color: '#111827' },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(118,85,240,0.2)',
    borderRadius: 12,
    paddingVertical: 11,
    backgroundColor: '#FAFAFF',
  },
  shareBtnText: { fontSize: 13, fontWeight: '700', color: '#7655F0' },
});
