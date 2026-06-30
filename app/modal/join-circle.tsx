import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { joinByInvite } from '../../data/api';
import { useToast } from '../../providers/ToastProvider';

export default function JoinCircleModal() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  async function handleJoin() {
    const clean = token.trim();
    if (!clean) return;
    setIsLoading(true);
    try {
      const { circleId } = await joinByInvite(clean);
      toast.show('Joined successfully!', 'success');
      router.back();
      router.push(`/circle/${circleId}/chat`);
    } catch (err: any) {
      toast.show(err?.message ?? 'That invite link is invalid or expired.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#374151" />
          </Pressable>
          <Text style={styles.headerTitle}>Join a circle</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.body}>
          {/* Illustration */}
          <View style={styles.illustration}>
            <Text style={styles.illustrationEmoji}>🔗</Text>
          </View>

          <Text style={styles.headline}>Enter your invite code</Text>
          <Text style={styles.subtext}>
            Paste the invite code or link someone shared with you.
            {'\n'}e.g. <Text style={styles.example}>y9UC-LsqhWY</Text>
          </Text>

          {/* Token input */}
          <View style={styles.inputWrap}>
            <Ionicons name="key-outline" size={18} color={Colors.muted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={token}
              onChangeText={(t) => {
                // Accept either just the token or a full URL — extract the token part
                const match = t.match(/invite\/([A-Za-z0-9_-]+)/);
                setToken(match ? match[1] : t);
              }}
              placeholder="Paste invite code or link…"
              placeholderTextColor={Colors.mutedLight}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="join"
              onSubmitEditing={handleJoin}
            />
          </View>

          <Pressable
            onPress={handleJoin}
            disabled={!token.trim() || isLoading}
            style={({ pressed }) => [
              styles.joinBtn,
              (!token.trim() || isLoading) && styles.joinBtnDisabled,
              pressed && { opacity: 0.85 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="enter-outline" size={18} color={Colors.white} />
                <Text style={styles.joinBtnText}>Join Circle</Text>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },

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
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  illustration: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },

  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
    gap: 16,
  },
  illustration: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  illustrationEmoji: { fontSize: 44 },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.navy,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
  example: { color: Colors.violet, fontWeight: '700' },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
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
    paddingVertical: 14,
    gap: 10,
    marginTop: 4,
  },
  inputIcon: { flexShrink: 0 },
  input: { flex: 1, fontSize: 15, color: Colors.navy },

  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingVertical: 16,
    marginTop: 8,
  },
  joinBtnDisabled: { opacity: 0.45 },
  joinBtnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});

