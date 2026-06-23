import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const PROMPTS = [
  { text: "What's one small win\nyou're proud of?", emoji: '🏆' },
  { text: "What's your comfort food\nright now?", emoji: '🍜' },
  { text: 'Post a photo from\nyour day', emoji: '📸' },
  { text: "What song are you\nobsessed with?", emoji: '🎵' },
  { text: "What made you smile\ntoday?", emoji: '😊' },
];

export default function PromptCard() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? PROMPTS.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === PROMPTS.length - 1 ? 0 : i + 1));

  const prompt = PROMPTS[index];

  return (
    <LinearGradient
      colors={['#EDE8FF', '#F5F0FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Header row */}
      <View style={styles.topRow}>
        <View style={styles.labelPill}>
          <Text style={styles.labelText}>Today's Prompt</Text>
        </View>
        {/* Dots indicator */}
        <View style={styles.dotsRow}>
          {PROMPTS.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* Emoji + Question */}
      <View style={styles.promptBody}>
        <Text style={styles.promptEmoji}>{prompt.emoji}</Text>
        <Text style={styles.question}>{prompt.text}</Text>
      </View>

      {/* Action row: arrows + share button */}
      <View style={styles.actionRow}>
        <View style={styles.navRow}>
          <Pressable onPress={prev} style={styles.navBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={16} color="#7655F0" />
          </Pressable>
          <Pressable onPress={next} style={styles.navBtn} hitSlop={8}>
            <Ionicons name="chevron-forward" size={16} color="#7655F0" />
          </Pressable>
        </View>
        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.86 }]}
        >
          <Text style={styles.btnText}>Share in Besties</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: '#DDD4FF',
    shadowColor: '#7655F0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelPill: {
    backgroundColor: 'rgba(118, 85, 240, 0.12)',
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
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(118, 85, 240, 0.2)',
  },
  dotActive: {
    backgroundColor: '#7655F0',
    width: 14,
  },
  promptBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  promptEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  question: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#2A1F5E',
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navRow: {
    flexDirection: 'row',
    gap: 6,
  },
  navBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(118, 85, 240, 0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#7655F0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
