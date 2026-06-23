import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import AvatarStack from './AvatarStack';
import { Circle } from '../data/mockData';

type Props = {
  circle: Circle;
  onPress?: () => void;
};

// Soft tints — warmer and aligned with updated brand palette
const BG_COLORS = [
  '#F0ECFF', // soft violet tint (warmer than before)
  '#FFF2EE', // warm coral tint
  '#E8FBF2', // sage green tint
  '#EBF4FF', // sky blue tint
];

const ICON_COLORS = [
  Colors.violet,    // #7655F0 — new warmer violet
  '#E06060',        // muted red (less harsh than #EF4444)
  Colors.success,
  Colors.blue,
];

const CIRCLE_ICONS = ['💜', '🎓', '🏠', '✨', '📖', '🌿', '🚀'];

export default function CircleListItem({ circle, onPress }: Props) {
  const bgColor = BG_COLORS[circle.gradientIndex % BG_COLORS.length];
  const iconColor = ICON_COLORS[circle.gradientIndex % ICON_COLORS.length];
  const icon = CIRCLE_ICONS[circle.gradientIndex % CIRCLE_ICONS.length];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: bgColor },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.topLeft}>
          <Text style={styles.icon}>{icon}</Text>
          <View>
            <Text style={[styles.name, { color: iconColor }]}>{circle.name}</Text>
            <Text style={styles.members}>{circle.memberCount} members</Text>
          </View>
        </View>
        <View style={styles.topRight}>
          <AvatarStack users={[0, 1, 2]} size={24} />
          {(circle.unreadCount ?? 0) > 0 && (
            <View style={[styles.badge, { backgroundColor: iconColor }]}>
              <Text style={styles.badgeText}>{circle.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.bottomRow}>
        <Text style={styles.lastMessage} numberOfLines={1}>{circle.lastMessage}</Text>
        <Text style={styles.time}>{circle.lastMessageTime}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  members: {
    fontSize: Typography.xs,
    color: Colors.muted,
    marginTop: 2,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: Typography.bold,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: Typography.sm,
    color: Colors.navy,
    flex: 1,
    marginRight: 12,
  },
  time: {
    fontSize: Typography.xs,
    color: Colors.muted,
  },
});
