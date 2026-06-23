import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CircleCard from '../../components/CircleCard';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { CIRCLES, Circle } from '../../data/mockData';

const TABS = ['All', 'My Circles', 'Joined', 'Archived'];

export default function CirclesScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [circles] = useState<Circle[]>(CIRCLES);

  const displayedCircles = activeTab === 'Archived' ? [] : circles;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Circles</Text>
          <Text style={styles.subtitle}>Your people, your vibe.</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/modal/create-circle')}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
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
        </ScrollView>
      </View>

      {/* Grid */}
      <FlatList
        data={displayedCircles}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CircleCard
            circle={item}
            onPress={() => router.push(`/circle/${item.id}/chat`)}
          />
        )}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: Typography.bold,
    color: Colors.navy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.muted,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tabsContainer: {
    marginBottom: 8,
  },
  tabsRow: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 100,
  },
  tabActive: {
    backgroundColor: Colors.violet,
  },
  tabText: {
    fontSize: Typography.sm,
    color: Colors.muted,
    fontWeight: Typography.medium,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: Typography.bold,
  },
  grid: {
    paddingHorizontal: 16,
  },
});
