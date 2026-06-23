import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// ── Poll Card (inline) ────────────────────────────────────────────────────────

type PollOption = { label: string; votes: number; total: number };

function PollMiniCard() {
  const [voted, setVoted] = useState<number | null>(null);
  const options: PollOption[] = [
    { label: '🍕 Pizza', votes: 14, total: 22 },
    { label: '🍔 Burgers', votes: 8, total: 22 },
  ];

  return (
    <View style={pollStyles.card}>
      <View style={pollStyles.topRow}>
        <View style={pollStyles.pill}>
          <Text style={pollStyles.pillText}>Poll</Text>
        </View>
        <Text style={pollStyles.circleName}>Besties</Text>
      </View>
      <Text style={pollStyles.question}>Pizza or Burgers? 🤔</Text>
      {options.map((opt, i) => {
        const pct = Math.round((opt.votes / opt.total) * 100);
        const isVoted = voted === i;
        return (
          <Pressable
            key={i}
            onPress={() => setVoted(i)}
            style={[pollStyles.optionWrap, isVoted && pollStyles.optionVoted]}
          >
            <View style={[pollStyles.barFill, { width: `${pct}%` as any }]} />
            <Text style={pollStyles.optionLabel}>{opt.label}</Text>
            {voted !== null && (
              <Text style={pollStyles.optionPct}>{pct}%</Text>
            )}
          </Pressable>
        );
      })}
      <Text style={pollStyles.totalVotes}>{options[0].total} votes • Tap to vote</Text>
    </View>
  );
}

const pollStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: {
    backgroundColor: '#EDE8FF',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 100,
  },
  pillText: { fontSize: 11, fontWeight: '700', color: '#7655F0' },
  circleName: { fontSize: 12, fontWeight: '600', color: '#8F96A3' },
  question: { fontSize: 16, fontWeight: '800', color: '#111827' },
  optionWrap: {
    position: 'relative',
    borderRadius: 10,
    backgroundColor: '#F5F3FF',
    paddingVertical: 11,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  optionVoted: { borderWidth: 1.5, borderColor: '#7655F0' },
  barFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(118, 85, 240, 0.13)',
    borderRadius: 10,
  },
  optionLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#2A1F5E' },
  optionPct: { fontSize: 13, fontWeight: '700', color: '#7655F0' },
  totalVotes: { fontSize: 11, color: '#8F96A3', fontWeight: '500' },
});

// ── Shared Album (inline) ─────────────────────────────────────────────────────

const ALBUM_PHOTOS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=200&h=200',
];

function SharedAlbumCard() {
  return (
    <View style={albumStyles.card}>
      <View style={albumStyles.topRow}>
        <View style={albumStyles.pill}>
          <Text style={albumStyles.pillText}>Shared Album</Text>
        </View>
        <Text style={albumStyles.count}>24 photos</Text>
      </View>
      <Text style={albumStyles.title}>Beach Trip — May '25 🌊</Text>
      <View style={albumStyles.grid}>
        {ALBUM_PHOTOS.map((uri, i) => (
          <Pressable key={i} style={albumStyles.photoWrap}>
            <Image source={{ uri }} style={albumStyles.photo} />
            {i === 3 && (
              <View style={albumStyles.overlay}>
                <Text style={albumStyles.overlayText}>+20</Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const albumStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: {
    backgroundColor: '#FFF0E6',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 100,
  },
  pillText: { fontSize: 11, fontWeight: '700', color: '#F4845F' },
  count: { fontSize: 12, fontWeight: '600', color: '#8F96A3' },
  title: { fontSize: 15, fontWeight: '800', color: '#111827' },
  grid: { flexDirection: 'row', gap: 6 },
  photoWrap: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  photo: { width: '100%', aspectRatio: 1, backgroundColor: '#E5E7EB' },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  overlayText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

// ── Memory Card (inline) ──────────────────────────────────────────────────────

function MemoryCard() {
  return (
    <LinearGradient
      colors={['#FFE4B5', '#FFD580']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={memStyles.card}
    >
      <Text style={memStyles.calendar}>📅</Text>
      <View style={memStyles.body}>
        <Text style={memStyles.label}>One year ago today…</Text>
        <Text style={memStyles.title}>Beach vibes with the Besties ☀️</Text>
        <Text style={memStyles.sub}>You posted 12 photos that day</Text>
      </View>
      <Pressable style={memStyles.btn}>
        <Text style={memStyles.btnText}>Relive it</Text>
      </Pressable>
    </LinearGradient>
  );
}

const memStyles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    gap: 10,
  },
  calendar: { fontSize: 28 },
  body: { gap: 3 },
  label: { fontSize: 11, fontWeight: '700', color: '#7A5500', opacity: 0.8 },
  title: { fontSize: 16, fontWeight: '800', color: '#4A3300' },
  sub: { fontSize: 12, color: '#7A5500', fontWeight: '500' },
  btn: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.12)',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 100,
  },
  btnText: { fontSize: 12, fontWeight: '700', color: '#4A3300' },
});

// ── Voice Note Card (inline) ──────────────────────────────────────────────────

function VoiceNoteCard() {
  const [playing, setPlaying] = useState(false);
  return (
    <View style={voiceStyles.card}>
      <View style={voiceStyles.topRow}>
        <View style={voiceStyles.pill}>
          <Text style={voiceStyles.pillText}>Voice Note</Text>
        </View>
        <Text style={voiceStyles.time}>0:42</Text>
      </View>
      <View style={voiceStyles.body}>
        <Pressable
          onPress={() => setPlaying((p) => !p)}
          style={voiceStyles.playBtn}
        >
          <Ionicons
            name={playing ? 'pause' : 'play'}
            size={22}
            color="#fff"
          />
        </Pressable>
        <View style={voiceStyles.waveform}>
          {Array.from({ length: 28 }).map((_, i) => {
            const h = [12, 18, 24, 20, 14, 28, 22, 16, 10, 26, 18, 12, 22, 30, 18, 14, 20, 16, 24, 10, 28, 20, 14, 18, 22, 16, 12, 24][i];
            return (
              <View
                key={i}
                style={[
                  voiceStyles.bar,
                  { height: h, opacity: playing && i < 10 ? 1 : 0.35 },
                ]}
              />
            );
          })}
        </View>
      </View>
      <Text style={voiceStyles.sender}>Amani • Besties • Just now</Text>
    </View>
  );
}

const voiceStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: {
    backgroundColor: '#E6F9F3',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 100,
  },
  pillText: { fontSize: 11, fontWeight: '700', color: '#20B889' },
  time: { fontSize: 12, fontWeight: '600', color: '#8F96A3' },
  body: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7655F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 34,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#7655F0',
  },
  sender: { fontSize: 11, color: '#8F96A3', fontWeight: '500' },
});

// ── Bucket List Card (inline) ─────────────────────────────────────────────────

const BUCKET_ITEMS = [
  { done: true, text: 'Road trip to Mombasa 🚗' },
  { done: true, text: 'Try that new sushi spot 🍣' },
  { done: false, text: 'Sunrise hike at Ngong Hills 🌄' },
  { done: false, text: 'Paint & wine night 🎨' },
  { done: false, text: 'Camp under the stars ⛺' },
];

function BucketListCard() {
  const [items, setItems] = useState(BUCKET_ITEMS);

  const toggle = (i: number) => {
    setItems((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <View style={bucketStyles.card}>
      <View style={bucketStyles.topRow}>
        <View style={bucketStyles.pill}>
          <Text style={bucketStyles.pillText}>Bucket List</Text>
        </View>
        <Text style={bucketStyles.circleName}>Besties</Text>
      </View>
      <Text style={bucketStyles.title}>Places to visit together 🗺️</Text>
      <View style={bucketStyles.list}>
        {items.map((item, i) => (
          <Pressable key={i} onPress={() => toggle(i)} style={bucketStyles.item}>
            <View style={[bucketStyles.checkbox, item.done && bucketStyles.checkboxDone]}>
              {item.done && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={[bucketStyles.itemText, item.done && bucketStyles.itemDone]}>
              {item.text}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const bucketStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: {
    backgroundColor: '#E6F3FF',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 100,
  },
  pillText: { fontSize: 11, fontWeight: '700', color: '#2F9AF2' },
  circleName: { fontSize: 12, fontWeight: '600', color: '#8F96A3' },
  title: { fontSize: 15, fontWeight: '800', color: '#111827' },
  list: { gap: 10 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxDone: { backgroundColor: '#7655F0', borderColor: '#7655F0' },
  itemText: { flex: 1, fontSize: 14, color: '#111827', fontWeight: '500' },
  itemDone: { color: '#8F96A3', textDecorationLine: 'line-through' },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function MomentsScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: tabClearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Extras</Text>
            <Text style={styles.subtitle}>Polls, memories & more</Text>
          </View>
          <Pressable style={styles.searchBtn}>
            <Ionicons name="search-outline" size={20} color="#7655F0" />
          </Pressable>
        </View>

        {/* Section: Polls */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Polls 🗳️</Text>
          <Pressable hitSlop={8}><Text style={styles.seeAll}>See all</Text></Pressable>
        </View>
        <View style={styles.cardPad}>
          <PollMiniCard />
        </View>

        {/* Section: Shared Albums */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shared Albums 📸</Text>
          <Pressable hitSlop={8}><Text style={styles.seeAll}>See all</Text></Pressable>
        </View>
        <View style={styles.cardPad}>
          <SharedAlbumCard />
        </View>

        {/* Section: Memories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Memories ✨</Text>
        </View>
        <View style={styles.cardPad}>
          <MemoryCard />
        </View>

        {/* Section: Voice Notes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Voice Notes 🎙️</Text>
        </View>
        <View style={styles.cardPad}>
          <VoiceNoteCard />
        </View>

        {/* Section: Bucket List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bucket List 🗺️</Text>
        </View>
        <View style={styles.cardPad}>
          <BucketListCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF8FF' },
  list: { paddingTop: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#2A1F5E', marginBottom: 3 },
  subtitle: { fontSize: 13, color: '#7265A8', fontWeight: '500' },
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(118, 85, 240, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  seeAll: { fontSize: 13, fontWeight: '700', color: '#7655F0' },
  cardPad: { paddingHorizontal: 20, marginBottom: 20 },
});
