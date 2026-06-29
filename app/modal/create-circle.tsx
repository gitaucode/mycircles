import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createCircle } from '../../data/api';
import { CIRCLE_ICONS } from '../../constants/assets';
import { useToast } from '../providers/ToastProvider';

// ── Data ──────────────────────────────────────────────────────────────────────

const ICON_OPTIONS = Object.keys(CIRCLE_ICONS);

const CIRCLE_TYPES: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Friends',  icon: 'people-outline' },
  { label: 'Family',   icon: 'home-outline' },
  { label: 'Campus',   icon: 'school-outline' },
  { label: 'Creators', icon: 'sparkles-outline' },
  { label: 'Work',     icon: 'briefcase-outline' },
  { label: 'Other',  icon: 'add-outline' },
];

const OTHER_LABEL = 'Other';

const PRIVACY_OPTIONS = [
  {
    value: 'Invite only',
    icon: 'lock-closed-outline' as keyof typeof Ionicons.glyphMap,
    desc: 'Only people you invite can join',
  },
  {
    value: 'Approval required',
    icon: 'shield-checkmark-outline' as keyof typeof Ionicons.glyphMap,
    desc: 'Anyone can request, you approve',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CreateCircleModal() {
  const [name, setName]             = useState('');
  const [iconId, setIconId]         = useState(ICON_OPTIONS[0]);
  const [customType, setCustomType] = useState('');
  const [type, setType]             = useState('Friends');
  const [privacy, setPrivacy]       = useState('Invite only');
  const [isLoading, setIsLoading]   = useState(false);
  const toast = useToast();
  const [createdCircle, setCreatedCircle] = useState<{
    id: string;
    name: string;
    inviteToken: string;
  } | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.show('Every circle needs a name.', 'error');
      return;
    }
    if (type === OTHER_LABEL && !customType.trim()) {
      toast.show('Tell us what kind of circle this is.', 'error');
      return;
    }

    const finalType = type === OTHER_LABEL ? customType.trim() : type;
    setIsLoading(true);

    try {
      const { id, inviteToken } = await createCircle({
        name: name.trim(),
        emoji: iconId, // backend still uses 'emoji' field for now, but it's an iconId
        type: finalType as any,
        privacy: privacy as any,
      });

      setCreatedCircle({ id, name: name.trim(), inviteToken });
    } catch (err: any) {
      toast.show(err?.message ?? 'Could not create circle. Try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!createdCircle) return;

    const timeout = setTimeout(() => {
      router.replace(`/circle/${createdCircle.id}/chat`);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [createdCircle]);

  if (createdCircle) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <View style={{ width: 36 }} />
          <Text style={styles.headerTitle}>Circle created</Text>
          <Pressable
            onPress={() => router.replace('/(tabs)/circles')}
            hitSlop={8}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={20} color="#374151" />
          </Pressable>
        </View>

        <View style={styles.successBody}>
          <View style={styles.successIconPremium}>
            <Ionicons name="checkmark-outline" size={42} color="#7655F0" />
          </View>
          <Text style={styles.successTitle}>{createdCircle.name} is live</Text>
          <Text style={styles.successText}>Preparing your new space...</Text>
          <ActivityIndicator color="#7655F0" style={styles.successSpinner} />
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#374151" />
        </Pressable>
        <Text style={styles.headerTitle}>New circle</Text>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Icon + Name row ────────────────────────────── */}
          <View style={styles.nameRow}>
            {/* Icon picker (tap to cycle) */}
            <Pressable
              style={styles.emojiBtn}
              onPress={() => {
                const i = ICON_OPTIONS.indexOf(iconId);
                setIconId(ICON_OPTIONS[(i + 1) % ICON_OPTIONS.length]);
              }}
            >
              <Image source={CIRCLE_ICONS[iconId as keyof typeof CIRCLE_ICONS]} style={styles.iconImage} />
            </Pressable>

            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Circle name"
              placeholderTextColor="#9CA3AF"
              maxLength={40}
              autoFocus
              returnKeyType="done"
            />
          </View>
          <Text style={styles.hint}>Tap the icon to change it</Text>

          {/* ── Type ────────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Type</Text>
          <View style={styles.typeGrid}>
            {CIRCLE_TYPES.map((t) => {
              const active = type === t.label;
              return (
                <Pressable
                  key={t.label}
                  onPress={() => setType(t.label)}
                  style={[styles.typeChip, active && styles.typeChipActive]}
                >
                  <Ionicons
                    name={t.icon}
                    size={16}
                    color={active ? '#7655F0' : '#6B7280'}
                  />
                  <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Inline input shown when user picks "+ Other" */}
          {type === OTHER_LABEL && (
            <TextInput
              style={styles.customTypeInput}
              value={customType}
              onChangeText={setCustomType}
              placeholder="Describe your circle type…"
              placeholderTextColor="#9CA3AF"
              maxLength={40}
              autoFocus
              returnKeyType="done"
            />
          )}

          {/* ── Privacy ─────────────────────────────────────── */}
          <Text style={styles.sectionLabel}>Privacy</Text>
          <View style={styles.privacyCol}>
            {PRIVACY_OPTIONS.map((p) => {
              const active = privacy === p.value;
              return (
                <Pressable
                  key={p.value}
                  onPress={() => setPrivacy(p.value)}
                  style={[styles.privacyRow, active && styles.privacyRowActive]}
                >
                  <View style={[styles.privacyIconBox, active && styles.privacyIconBoxActive]}>
                    <Ionicons
                      name={p.icon}
                      size={18}
                      color={active ? '#7655F0' : '#9CA3AF'}
                    />
                  </View>
                  <View style={styles.privacyText}>
                    <Text style={[styles.privacyLabel, active && styles.privacyLabelActive]}>
                      {p.value}
                    </Text>
                    <Text style={styles.privacyDesc}>{p.desc}</Text>
                  </View>
                  {active && (
                    <Ionicons name="checkmark-circle" size={20} color="#7655F0" />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* ── CTA ─────────────────────────────────────────── */}
          <Pressable
            onPress={handleCreate}
            disabled={isLoading}
            style={({ pressed }) => [styles.createBtn, (pressed || isLoading) && { opacity: 0.85 }]}
          >
            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.createBtnText}>Creating...</Text>
              </View>
            ) : (
              <Text style={styles.createBtnText}>Create circle</Text>
            )}
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.2,
  },

  // Body
  body: {
    padding: 20,
    gap: 6,
    paddingBottom: 40,
  },

  // Name row
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  nameInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    padding: 0,
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
    marginLeft: 2,
  },

  // Section label
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 10,
  },

  // Custom type input
  customTypeInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    marginTop: 2,
    marginBottom: 4,
  },

  // Type chips
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  typeChipActive: {
    borderColor: '#7655F0',
    backgroundColor: 'rgba(118, 85, 240, 0.07)',
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeChipTextActive: {
    color: '#7655F0',
    fontWeight: '600',
  },

  // Privacy options
  privacyCol: {
    gap: 10,
    marginBottom: 8,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  privacyRowActive: {
    borderColor: '#7655F0',
    backgroundColor: 'rgba(118, 85, 240, 0.05)',
  },
  privacyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyIconBoxActive: {
    backgroundColor: 'rgba(118, 85, 240, 0.10)',
  },
  privacyText: {
    flex: 1,
    gap: 2,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  privacyLabelActive: {
    color: '#7655F0',
  },
  privacyDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },

  // CTA
  createBtn: {
    marginTop: 24,
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  successBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  successIconPremium: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F3F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(118, 85, 240, 0.1)',
  },
  successTitle: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  successText: {
    color: '#6B7280',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  successSpinner: {
    marginTop: 12,
  },
  inviteLink: {
    color: '#7655F0',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#F3F0FF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  successActions: {
    alignSelf: 'stretch',
    gap: 10,
    marginTop: 12,
  },
  secondaryBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#7655F0',
    backgroundColor: '#FFFFFF',
  },
  secondaryBtnText: {
    color: '#7655F0',
    fontSize: 16,
    fontWeight: '700',
  },
});
