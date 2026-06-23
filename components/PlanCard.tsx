import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AvatarStack from './AvatarStack';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Plan } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  plan: Plan;
};

export default function PlanCard({ plan }: Props) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['#60A5FA', '#3B82F6']}
        style={styles.image}
      >
        <Text style={styles.imageEmoji}>🏖️</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{plan.title}</Text>
        <Text style={styles.date}>{plan.date}</Text>
        <Text style={styles.time}>{plan.time}</Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={Colors.muted} />
          <Text style={styles.location}>{plan.location}</Text>
        </View>

        <View style={styles.tag}>
          <Ionicons name="lock-closed-outline" size={12} color={Colors.violet} />
          <Text style={styles.tagText}>{plan.tag}</Text>
        </View>

        <View style={styles.avatarRow}>
          <AvatarStack users={[0, 1, 2, 3]} size={24} />
          <Text style={styles.extra}>+3</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    flexDirection: 'row',
    padding: 12,
    elevation: 2,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    gap: 16,
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: { fontSize: 40 },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: Typography.bold,
    color: Colors.navy,
  },
  date: {
    fontSize: 13,
    color: Colors.navy,
    fontWeight: Typography.medium,
  },
  time: {
    fontSize: 13,
    color: Colors.muted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 13,
    color: Colors.muted,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 2,
  },
  tagText: {
    color: Colors.violet,
    fontSize: 11,
    fontWeight: Typography.semibold,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  extra: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: Typography.medium,
  },
});
