import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import AvatarStack from './AvatarStack';
import { Circle } from '../data/mockData';

type Props = {
  circle: Circle;
  onPress?: () => void;
};

const CARD_GRADIENTS: [string, string][] = [
  ['#8B6FF0', '#B49DF5'], // soft violet (brand family)
  ['#F4845F', '#F0A890'], // muted coral → peach
  ['#4DC48A', '#7ADBA8'], // sage green
  ['#5BA8E8', '#8DC8F5'], // sky blue
  ['#E87BA8', '#F0A8CA'], // dusty rose
  ['#D4A028', '#E8C060'], // warm amber → gold
];

export default function CircleCard({ circle, onPress }: Props) {
  const gradColors = CARD_GRADIENTS[circle.gradientIndex % CARD_GRADIENTS.length];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
    >
      <LinearGradient
        colors={gradColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Emoji — big, expressive, top-left */}
        <View style={styles.header}>
          <Text style={styles.emoji}>{circle.emoji}</Text>
          <AvatarStack users={[0, 1, 2]} size={22} />
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{circle.name}</Text>
          <Text style={styles.members}>{circle.memberCount} members</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.vibePill}>
            <Text style={[styles.vibeText, { color: gradColors[0] }]} numberOfLines={1}>{circle.vibe}</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
    borderRadius: 24,
    overflow: 'hidden',
  },
  card: {
    padding: 16,
    height: 180,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 34,
    lineHeight: 40,
  },
  content: {
    marginTop: 'auto',
    marginBottom: 12,
  },
  name: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: Typography.bold,
    marginBottom: 3,
  },
  members: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },
  footer: {
    flexDirection: 'row',
  },
  vibePill: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  vibeText: {
    fontSize: 11,
    fontWeight: Typography.bold,
  },
});
