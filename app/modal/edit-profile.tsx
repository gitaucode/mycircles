import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { checkUsername } from '../../data/api';
import { useToast } from '../../providers/ToastProvider';
import { Colors } from '../../constants/colors';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'same';

export default function EditProfileModal() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [username, setUsername] = useState((user?.username ?? '').replace(/^@/, ''));
  const [bio, setBio] = useState(user?.bio ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('same');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUsername = (user?.username ?? '').replace(/^@/, '');

  // ── Real-time username check ────────────────────────────────────────────────
  const checkAvailability = useCallback(async (value: string) => {
    const clean = value.trim().toLowerCase();

    if (clean === currentUsername) {
      setUsernameStatus('same');
      return;
    }
    if (clean.length < 3) {
      setUsernameStatus('invalid');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(clean)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');
    try {
      const { available } = await checkUsername(clean);
      setUsernameStatus(available ? 'available' : 'taken');
    } catch {
      // If the endpoint doesn't exist on backend, assume it's fine and let save handle it
      setUsernameStatus('available');
    }
  }, [currentUsername]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      checkAvailability(username);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username, checkAvailability]);

  // ── Validation helpers ──────────────────────────────────────────────────────
  const canSave =
    name.trim().length > 0 &&
    usernameStatus !== 'taken' &&
    usernameStatus !== 'invalid' &&
    usernameStatus !== 'checking' &&
    !isSaving;

  // ── Save ────────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!canSave) return;
    setIsSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
      });
      toast.show('Profile updated!', 'success');
      router.back();
    } catch {
      toast.show('Could not save. Try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  // ── Username status indicator ───────────────────────────────────────────────
  function UsernameIndicator() {
    if (usernameStatus === 'same') return null;
    if (usernameStatus === 'checking') {
      return <ActivityIndicator size="small" color="#9CA3AF" style={styles.statusIcon} />;
    }
    if (usernameStatus === 'available') {
      return <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.statusIcon} />;
    }
    if (usernameStatus === 'taken') {
      return <Ionicons name="close-circle" size={20} color="#EF4444" style={styles.statusIcon} />;
    }
    if (usernameStatus === 'invalid') {
      return <Ionicons name="alert-circle" size={20} color="#F59E0B" style={styles.statusIcon} />;
    }
    return null;
  }

  function usernameHint() {
    if (usernameStatus === 'available') return { text: `@${username.trim()} is available!`, color: '#10B981' };
    if (usernameStatus === 'taken') return { text: `@${username.trim()} is already taken.`, color: '#EF4444' };
    if (usernameStatus === 'invalid') return { text: 'Only lowercase letters, numbers, and underscores.', color: '#F59E0B' };
    return null;
  }

  const hint = usernameHint();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#374151" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          hitSlop={8}
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Name ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
        </View>

        {/* ── Username ── */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Username</Text>
          <View style={[
            styles.inputWrap,
            usernameStatus === 'taken' && styles.inputWrapError,
            usernameStatus === 'available' && styles.inputWrapSuccess,
          ]}>
            <Text style={styles.atSign}>@</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={username}
              onChangeText={(t) => setUsername(t.replace(/@/g, ''))}
              placeholder="your_username"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            <UsernameIndicator />
          </View>
          {hint && (
            <Text style={[styles.hint, { color: hint.color }]}>{hint.text}</Text>
          )}
          {usernameStatus === 'same' && (
            <Text style={styles.hintMuted}>3–20 chars. Letters, numbers, underscores only.</Text>
          )}
        </View>

        {/* ── Bio ── */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <Text style={styles.charCount}>{bio.length}/160</Text>
          </View>
          <View style={[styles.inputWrap, styles.textAreaWrap]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={(t) => t.length <= 160 && setBio(t)}
              placeholder="Tell your circles a little about yourself…"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="default"
            />
          </View>
        </View>

        {/* ── Info note ── */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>
            Your username appears on your shareable profile link and is how others find you.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },

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
  saveBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  body: {
    padding: 20,
    paddingBottom: 48,
    gap: 24,
  },

  fieldGroup: {
    gap: 8,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  inputWrapError: {
    borderColor: '#EF4444',
  },
  inputWrapSuccess: {
    borderColor: '#10B981',
  },
  textAreaWrap: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  atSign: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    paddingVertical: 14,
  },
  textArea: {
    minHeight: 96,
    paddingVertical: 0,
  },
  statusIcon: {
    marginLeft: 8,
  },

  hint: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  hintMuted: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
});

