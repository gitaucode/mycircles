import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

const CIRCLE_TYPES = ['Friends', 'Family', 'Campus', 'Creators', 'Work', 'Custom'];
const VIBES = ['Chaotic', 'Locked in', 'Soft life', 'Build mode', 'Family-safe', 'Private'];
const PRIVACY = ['Invite only', 'Approval required'];

export default function CreateCircleModal() {
  const [name, setName] = useState('');
  const [type, setType] = useState('Friends');
  const [vibe, setVibe] = useState('Chaotic');
  const [privacy, setPrivacy] = useState('Invite only');

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please give your circle a name!');
      return;
    }
    Alert.alert(
      '🎉 Circle Created!',
      `"${name.trim()}" is ready. Your people are waiting!`,
      [{ text: 'Let\'s go!', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={Colors.navy} />
        </Pressable>
        <Text style={styles.title}>Create Circle</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Visual hero */}
        <LinearGradient
          colors={[Colors.violet + '18', Colors.blue + '10']}
          style={styles.hero}
        >
          <LinearGradient colors={[Colors.violet, Colors.blue]} style={styles.heroIcon}>
            <Text style={styles.heroIconText}>✨</Text>
          </LinearGradient>
          <Text style={styles.heroTitle}>Your new circle</Text>
          <Text style={styles.heroSub}>Private. Yours. Always.</Text>
        </LinearGradient>

        {/* Name */}
        <Text style={styles.fieldLabel}>Circle name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Weekend Squad"
          placeholderTextColor={Colors.mutedLight}
          maxLength={40}
        />

        {/* Type */}
        <Text style={styles.fieldLabel}>Circle type</Text>
        <View style={styles.chipRow}>
          {CIRCLE_TYPES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              style={[styles.chip, type === t && styles.chipActive]}
            >
              <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* Vibe */}
        <Text style={styles.fieldLabel}>Vibe</Text>
        <View style={styles.chipRow}>
          {VIBES.map((v) => (
            <Pressable
              key={v}
              onPress={() => setVibe(v)}
              style={[styles.chip, vibe === v && styles.chipActive]}
            >
              <Text style={[styles.chipText, vibe === v && styles.chipTextActive]}>{v}</Text>
            </Pressable>
          ))}
        </View>

        {/* Privacy */}
        <Text style={styles.fieldLabel}>Privacy</Text>
        <View style={styles.privacyRow}>
          {PRIVACY.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPrivacy(p)}
              style={[styles.privacyOption, privacy === p && styles.privacyOptionActive]}
            >
              <Ionicons
                name={p === 'Invite only' ? 'lock-closed-outline' : 'shield-checkmark-outline'}
                size={20}
                color={privacy === p ? Colors.violet : Colors.muted}
              />
              <Text style={[styles.privacyText, privacy === p && styles.privacyTextActive]}>
                {p}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleCreate}
          style={({ pressed }) => [styles.createBtnWrap, pressed && { opacity: 0.9 }]}
        >
          <LinearGradient
            colors={[Colors.violet, Colors.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createBtn}
          >
            <Text style={styles.createBtnText}>Create Circle ✨</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.navy,
  },
  content: { padding: 20, gap: 8 },
  hero: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroIconText: { fontSize: 28 },
  heroTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.navy,
  },
  heroSub: {
    fontSize: Typography.sm,
    color: Colors.muted,
  },
  fieldLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.navy,
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Typography.base,
    color: Colors.navy,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: {
    borderColor: Colors.violet,
    backgroundColor: Colors.violet + '14',
  },
  chipText: {
    fontSize: Typography.sm,
    color: Colors.muted,
    fontWeight: Typography.medium,
  },
  chipTextActive: {
    color: Colors.violet,
    fontWeight: Typography.semibold,
  },
  privacyRow: {
    flexDirection: 'row',
    gap: 12,
  },
  privacyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  privacyOptionActive: {
    borderColor: Colors.violet,
    backgroundColor: Colors.violet + '10',
  },
  privacyText: {
    fontSize: Typography.sm,
    color: Colors.muted,
    fontWeight: Typography.medium,
    flex: 1,
  },
  privacyTextActive: {
    color: Colors.violet,
    fontWeight: Typography.semibold,
  },
  createBtnWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  createBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createBtnText: {
    color: Colors.white,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    letterSpacing: 0.3,
  },
});
