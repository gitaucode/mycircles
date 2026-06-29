import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { CIRCLE_ICONS } from '../constants/assets';
import { Circle, USERS } from '../data/mockData';
import AvatarStack from './AvatarStack';

type Props = {
  circle: Circle;
  onPress?: () => void;
  onLongPress?: () => void;
};

const CARD_GRADIENTS: [string, string][] = [
  ['#8B6FF0', '#B49DF5'], // soft violet (brand family)
  ['#F4845F', '#F0A890'], // muted coral → peach
  ['#4DC48A', '#7ADBA8'], // sage green
  ['#5BA8E8', '#8DC8F5'], // sky blue
  ['#E87BA8', '#F0A8CA'], // dusty rose
  ['#D4A028', '#E8C060'], // warm amber → gold
];

export default function CircleCard({ circle, onPress, onLongPress }: Props) {
  const gradColors = CARD_GRADIENTS[circle.gradientIndex % CARD_GRADIENTS.length];


  // Get actual avatar IDs from mock USERS
  const memberAvatarIds = circle.memberIds
    .slice(0, 3)
    .map(id => USERS.find(u => u.id === id)?.avatarId || 'avatar_1');

  // Determine what to show in the bottom slot (priority: event > last message > memory > vibe)
  const bottomContent = circle.upcomingEvent
    ? { type: 'event' as const, text: `📅 ${circle.upcomingEvent}` }
    : circle.lastMessage
    ? { type: 'message' as const, text: circle.lastMessage }
    : circle.memoryHighlight
    ? { type: 'memory' as const, text: `✨ ${circle.memoryHighlight}` }
    : { type: 'vibe' as const, text: circle.vibe };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
      ]}
    >
      <LinearGradient
        colors={gradColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* ── Top: emoji (left) + avatars + unread badge (right) ─ */}
        <View style={styles.header}>
          <Image source={CIRCLE_ICONS[circle.emoji as keyof typeof CIRCLE_ICONS]} style={styles.circleIcon} />

          <View style={styles.headerRight}>
            <AvatarStack avatarIds={memberAvatarIds} size={22} />
          </View>
        </View>

        {/* ── Middle: name + member count ───────────── */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {circle.name}
          </Text>
          <Text style={styles.members}>
            {circle.memberCount} members
          </Text>
        </View>

        {/* ── Bottom: event pill / message / vibe ───── */}
        <View style={styles.footer}>
          {bottomContent.type === 'vibe' ? (
            <View style={styles.vibePill}>
              <Text
                style={[styles.bottomPillText, { color: gradColors[0] }]}
                numberOfLines={1}
              >
                {bottomContent.text}
              </Text>
            </View>
          ) : bottomContent.type === 'message' ? (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {bottomContent.text}
            </Text>
          ) : (
            /* event or memory pill */
            <View style={styles.eventPill}>
              <Text style={styles.eventPillText} numberOfLines={1}>
                {bottomContent.text}
              </Text>
            </View>
          )}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  card: {
    padding: 16,
    height: 200,
    justifyContent: 'space-between',
    borderRadius: 24,
    overflow: 'hidden',
  },

  // Top
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  circleIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },


  // Middle
  content: {
    marginTop: 'auto',
    marginBottom: 10,
    gap: 2,
  },
  name: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: Typography.bold,
    lineHeight: 21,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  members: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: Typography.xs,
    fontWeight: Typography.medium,
  },

  // Bottom
  footer: {
    flexDirection: 'row',
  },
  vibePill: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    maxWidth: '100%',
  },
  eventPill: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    maxWidth: '100%',
  },
  bottomPillText: {
    fontSize: 11,
    fontWeight: Typography.bold,
  },
  eventPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2A1F5E',
  },
  lastMessage: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.80)',
    flex: 1,
  },
});
