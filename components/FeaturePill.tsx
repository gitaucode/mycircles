import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

type Props = {
  icon: string;
  label: string;
  variant?: 'violet' | 'blue' | 'green';
};

export default function FeaturePill({ icon, label, variant = 'violet' }: Props) {
  const bg =
    variant === 'blue'
      ? Colors.blue + '18'
      : variant === 'green'
      ? Colors.success + '18'
      : Colors.violet + '18';
  const textColor =
    variant === 'blue' ? Colors.blue : variant === 'green' ? Colors.success : Colors.violet;

  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: textColor + '30' }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    gap: 6,
    marginRight: 8,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
});
