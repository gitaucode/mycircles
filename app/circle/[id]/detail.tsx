import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AvatarStack from '../../../components/AvatarStack';
import PlanCard from '../../../components/PlanCard';
import ContributionCard from '../../../components/ContributionCard';
import MemoryGrid from '../../../components/MemoryGrid';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { CIRCLES, PLANS, CONTRIBUTIONS, MEMORIES } from '../../../data/mockData';

const TABS = ['Plans', 'Wall', 'Files', 'People'];

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const circle = CIRCLES.find((c) => c.id === id) ?? CIRCLES[0];
  const [activeTab, setActiveTab] = useState('Plans');
  const plan = PLANS.find((p) => p.circleId === circle.id) ?? PLANS[0];
  const contribution = CONTRIBUTIONS.find((c) => c.circleId === circle.id) ?? CONTRIBUTIONS[0];
  const memories = MEMORIES.filter((m) => m.circleId === circle.id);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.navy} />
        </Pressable>
        <AvatarStack users={[0]} size={32} />
        <View style={styles.headerMeta}>
          <Text style={styles.circleName}>{circle.name} 💜</Text>
          <Text style={styles.memberCount}>{circle.memberCount} members</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="calendar-outline" size={22} color={Colors.navy} />
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color={Colors.navy} />
          </Pressable>
        </View>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'Plans' && (
          <View style={styles.plansContent}>
            <Text style={styles.sectionTitle}>Upcoming Plan</Text>
            <PlanCard plan={plan} />
            
            <View style={styles.divider} />
            <ContributionCard contribution={contribution} />
            
            <View style={styles.divider} />
            <MemoryGrid memories={memories} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FE' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerMeta: { flex: 1 },
  circleName: { fontSize: 16, fontWeight: Typography.bold, color: Colors.navy },
  memberCount: { fontSize: 12, color: Colors.muted },
  headerActions: { flexDirection: 'row', gap: 16 },
  actionBtn: { padding: 4 },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: { backgroundColor: Colors.violet },
  tabText: { fontSize: 13, color: Colors.muted, fontWeight: Typography.medium },
  tabTextActive: { color: Colors.white, fontWeight: Typography.bold },
  content: { padding: 20, paddingBottom: 100 },
  plansContent: { gap: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.navy, marginBottom: -8 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
});
