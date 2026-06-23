import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Memory } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  memories: Memory[];
};

export default function MemoryGrid({ memories }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Wall</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      <View style={styles.grid}>
        <LinearGradient colors={['#D1D5DB', '#9CA3AF']} style={styles.largeImage}>
          <Ionicons name="image-outline" size={32} color={Colors.white} />
        </LinearGradient>
        <View style={styles.rightCol}>
          <LinearGradient colors={['#9CA3AF', '#6B7280']} style={styles.smallImage}>
            <Ionicons name="image-outline" size={24} color={Colors.white} />
          </LinearGradient>
          <View style={styles.recap}>
            <Text style={styles.recapTitle}>May Recap 🌟</Text>
            <Text style={styles.recapSub}>So many laughs, core memories & good vibes.</Text>
            <Text style={styles.recapMeta}>12 photos • 2 videos</Text>
          </View>
        </View>
      </View>

      <Pressable style={styles.addBtn}>
        <Ionicons name="add" size={20} color={Colors.white} />
        <Text style={styles.addBtnText}>Add Memory</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, position: 'relative' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: Typography.bold, color: Colors.navy },
  seeAll: { fontSize: 13, color: Colors.violet, fontWeight: Typography.medium },
  grid: { flexDirection: 'row', gap: 12, height: 200 },
  largeImage: { flex: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rightCol: { flex: 1, gap: 12 },
  smallImage: { flex: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  recap: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 12, elevation: 2, shadowColor: Colors.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  recapTitle: { fontSize: 13, fontWeight: Typography.bold, color: Colors.navy, marginBottom: 4 },
  recapSub: { fontSize: 11, color: Colors.muted, lineHeight: 14, marginBottom: 6 },
  recapMeta: { fontSize: 10, color: Colors.mutedLight },
  addBtn: { position: 'absolute', bottom: -10, right: 0, backgroundColor: Colors.violet, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 100, elevation: 4, shadowColor: Colors.violet, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, gap: 6 },
  addBtnText: { color: Colors.white, fontWeight: Typography.bold, fontSize: 14 },
});
