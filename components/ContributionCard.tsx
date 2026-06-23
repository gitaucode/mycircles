import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Contribution } from '../data/mockData';

type Props = {
  contribution: Contribution;
};

export default function ContributionCard({ contribution }: Props) {
  const percent = 72;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Contributions</Text>
        <View style={styles.percentBadge}>
          <Text style={styles.percent}>{percent}%</Text>
        </View>
      </View>

      <Text style={styles.amount}>
        <Text style={styles.current}>{contribution.currency} {contribution.current.toLocaleString()}</Text>
        <Text style={styles.goal}> / {contribution.goal.toLocaleString()}</Text>
      </Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.paidText}>Paid by 4 of 6 members</Text>
        <Pressable
          style={styles.btn}
          onPress={() => Alert.alert('Coming Soon', 'Payments coming soon!')}
        >
          <Text style={styles.btnText}>Contribute</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: Typography.bold, color: Colors.navy },
  percentBadge: { backgroundColor: '#E6FBF2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  percent: { color: Colors.success, fontWeight: Typography.bold, fontSize: 12 },
  amount: { marginBottom: 4 },
  current: { fontSize: 18, fontWeight: Typography.bold, color: Colors.navy },
  goal: { fontSize: 14, color: Colors.muted },
  track: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Colors.success, borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  paidText: { fontSize: 12, color: Colors.muted },
  btn: { backgroundColor: '#E6FBF2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  btnText: { color: Colors.success, fontWeight: Typography.bold, fontSize: 13 },
});
