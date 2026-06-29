import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import PrimaryButton from '../../components/PrimaryButton';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { joinByInvite } from '../../data/api';
import { useAuth } from '../../contexts/AuthContext';

export default function InviteJoinScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const [joinState, setJoinState] = useState<'idle' | 'joining' | 'error'>('idle');
  const [error, setError] = useState('');
  const didJoin = useRef(false);
  const invitePath = `/invite/${token}`;

  useEffect(() => {
    if (isLoading || !isAuthenticated || !token || didJoin.current) {
      return;
    }

    didJoin.current = true;
    setJoinState('joining');
    joinByInvite(token)
      .then(({ circleId }) => router.replace(`/circle/${circleId}/chat`))
      .catch((nextError) => {
        setError(nextError?.message ?? 'Could not join this circle.');
        setJoinState('error');
        didJoin.current = false;
      });
  }, [isAuthenticated, isLoading, token]);

  if (isLoading || joinState === 'joining') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.violet} />
          <Text style={styles.statusText}>
            {isLoading ? 'Checking your session' : 'Joining circle'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.replace('/')} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={Colors.navy} />
        </Pressable>

        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="people" size={30} color={Colors.violet} />
          </View>
          <Text style={styles.title}>Join this circle</Text>
          <Text style={styles.body}>
            Log in or create an account to accept the invite and start chatting.
          </Text>

          {error ? <Text style={styles.error} selectable>{error}</Text> : null}

          {isAuthenticated ? (
            <PrimaryButton
              label="Try Again"
              onPress={() => {
                didJoin.current = false;
                setError('');
                setJoinState('idle');
              }}
            />
          ) : (
            <View style={styles.actions}>
              <PrimaryButton
                label="Log In"
                onPress={() => router.push({ pathname: '/login', params: { redirectTo: invitePath } })}
              />
              <PrimaryButton
                label="Create Account"
                onPress={() => router.push({ pathname: '/register', params: { redirectTo: invitePath } })}
                outline
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 12,
    left: 18,
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EDE8FF',
  },
  title: {
    color: Colors.navy,
    fontSize: Typography['2xl'],
    fontWeight: Typography.extrabold,
  },
  body: {
    color: Colors.muted,
    fontSize: Typography.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  error: {
    color: Colors.error,
    fontSize: Typography.sm,
    textAlign: 'center',
  },
  statusText: {
    color: Colors.muted,
    fontSize: Typography.base,
  },
  actions: {
    alignSelf: 'stretch',
    gap: 12,
    marginTop: 4,
  },
});
