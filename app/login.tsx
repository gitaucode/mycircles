import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { USER_AVATARS } from '../constants/assets';

import PrimaryButton from '../components/PrimaryButton';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { ApiError } from '../data/api';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email: email.trim().toLowerCase(), password });
      router.replace((redirectTo as any) || '/(tabs)/circles');
    } catch (nextError) {
      setError(nextError instanceof ApiError ? nextError.message : 'Could not log you in');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LinearGradient
      colors={['#FDE8F0', '#EFE4FB', '#E4D9F8', '#DDD4F5']}
      locations={[0, 0.35, 0.65, 1]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.gradient}
    >
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Image source={USER_AVATARS.avatar_1} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
            </View>
            <Text style={styles.eyebrow}>Welcome back</Text>
            <Text style={styles.title}>Log in to your circles</Text>
            <Text style={styles.subtitle}>Use the email and password you signed up with.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="you@example.com"
                placeholderTextColor={Colors.mutedLight}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoComplete="password"
                placeholder="Your password"
                placeholderTextColor={Colors.mutedLight}
                secureTextEntry
                style={styles.input}
              />
            </View>

            {error ? <Text style={styles.error} selectable>{error}</Text> : null}

            <PrimaryButton
              black
              label="Log In"
              onPress={handleLogin}
              loading={isSubmitting}
              disabled={!email.trim() || password.length < 6}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here?</Text>
            <Link href="/register" asChild>
              <Pressable hitSlop={8}>
                <Text style={styles.footerLink}>Create an account</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 28,
  },
  header: {
    gap: 8,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  eyebrow: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  title: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 40,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    color: Colors.navy,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  input: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    color: Colors.navy,
    fontSize: Typography.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  error: {
    color: Colors.error,
    fontSize: Typography.sm,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: Colors.muted,
    fontSize: Typography.base,
  },
  footerLink: {
    color: Colors.violet,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
});
