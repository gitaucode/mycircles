import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AvatarStack from './AvatarStack';

type CircleIconName = keyof typeof Ionicons.glyphMap;

type Props = {
  name: string;
  members: string;
  preview: string;
  time: string;
  unread: number;
  iconName: CircleIconName;
  colorHex: string;
  bgHex: string;
  avatars: number[];
};

export default function CircleInboxRow({
  name,
  members,
  preview,
  time,
  unread,
  iconName,
  colorHex,
  bgHex,
  avatars,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: bgHex, borderColor: colorHex + '18' },
        pressed && { opacity: 0.86 },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={iconName} size={25} color={colorHex} />
        </View>

        <View style={styles.nameCol}>
          <Text style={[styles.name, { color: colorHex }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.members}>{members}</Text>
        </View>

        <AvatarStack users={avatars} size={25} />

        {unread > 0 && (
          <View style={[styles.badge, { backgroundColor: colorHex }]}>
            <Text style={styles.badgeText}>{unread}</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.preview} numberOfLines={1}>
          {preview}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 74,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 9,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.035,
    shadowRadius: 5,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  iconWrap: {
    width: 29,
    height: 29,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  nameCol: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 18,
  },
  members: {
    fontSize: 11,
    color: '#6F7482',
    marginTop: 1,
    lineHeight: 13,
    fontWeight: '500',
  },
  badge: {
    minWidth: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    flexShrink: 0,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 38,
  },
  preview: {
    fontSize: 12,
    color: '#535A68',
    flex: 1,
    marginRight: 6,
    lineHeight: 16,
    fontWeight: '500',
  },
  time: {
    fontSize: 10,
    color: '#8F96A3',
    flexShrink: 0,
    lineHeight: 13,
  },
});
