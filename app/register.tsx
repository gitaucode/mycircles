import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { ApiError } from '../data/api';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedUsername = useMemo(
    () => username.trim().toLowerCase().replace(/^@/, ''),
    [username],
  );
  const canSubmit = Boolean(
    name.trim() &&
    normalizedUsername.length >= 2 &&
    email.includes('@') &&
    password.length >= 6,
  );

  async function handleRegister() {
    setError('');
    setIsSubmitting(true);

    try {
      await register({
        name: name.trim(),
        username: normalizedUsername,
        email: email.trim().toLowerCase(),
        password,
      });
      router.replace((redirectTo as any) || '/onboarding');
    } catch (nextError) {
      setError(nextError instanceof ApiError ? nextError.message : 'Could not create your account');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
            <Text style={styles.eyebrow}>Start private</Text>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Your profile will be ready for circles and invites.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                autoComplete="name"
                placeholder="Maya Njeri"
                placeholderTextColor={Colors.mutedLight}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                placeholder="@maya"
                placeholderTextColor={Colors.mutedLight}
                style={styles.input}
              />
            </View>

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
                autoComplete="new-password"
                placeholder="At least 6 characters"
                placeholderTextColor={Colors.mutedLight}
                secureTextEntry
                style={styles.input}
              />
            </View>

            {error ? <Text style={styles.error} selectable>{error}</Text> : null}

            <PrimaryButton
              black
              label="Create Account"
              onPress={handleRegister}
              loading={isSubmitting}
              disabled={!canSubmit}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login" asChild>
              <Pressable hitSlop={8}>
                <Text style={styles.footerLink}>Log in</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    backgroundColor: Colors.white,
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
    flexWrap: 'wrap',
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
