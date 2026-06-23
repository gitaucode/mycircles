import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import AvatarStack from './AvatarStack';

type Props = {
  title: string;
  date: string;
  time: string;
  imageUri: string;
  goingCount: number;
  tag?: string;
  emoji?: string;
  onPress?: () => void;
};

export default function HangoutCard({
  title,
  date,
  time,
  imageUri,
  goingCount,
  tag,
  emoji,
  onPress,
}: Props) {
  // Parse day and month from date string like "Saturday, 28 Jun"
  const parts = date.split(', ');
  const dayMonth = parts[1] ?? date; // "28 Jun"
  const [day, month] = dayMonth.split(' ');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] }]}
    >
      {/* Header row: label left, date badge right */}
      <View style={styles.topRow}>
        <View style={styles.labelPill}>
          <Text style={styles.labelText}>Upcoming Event</Text>
        </View>
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
        </View>
      </View>

      {/* Event body: image left, details right */}
      <View style={styles.body}>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.eventName}>{title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaIcon}>🕒</Text>
            <Text style={styles.metaText}>{time}</Text>
          </View>
          {tag && (
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Footer: avatars + count */}
      <View style={styles.footer}>
        <AvatarStack users={[0, 1, 2, 3]} size={22} />
        <View style={styles.extraPill}>
          <Text style={styles.extraText}>+{goingCount} going</Text>
        </View>
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelPill: {
    backgroundColor: '#F0ECFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7655F0',
    letterSpacing: 0.2,
  },
  dateBadge: {
    backgroundColor: '#7655F0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 13,
  },
  body: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    flexShrink: 0,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaIcon: {
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4F5665',
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0ECFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    marginTop: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7655F0',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  extraPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  extraText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
});
