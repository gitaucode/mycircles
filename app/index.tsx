import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';

const centerAvatar = require('../assets/images/avatar_1.png');
const avatarA = require('../assets/images/avatar_2.png');
const avatarB = require('../assets/images/avatar_3.png');
const avatarC = require('../assets/images/avatar_1.png');
const avatarD = require('../assets/images/avatar_2.png');
const avatarE = require('../assets/images/avatar_3.png');
const avatarF = require('../assets/images/avatar_1.png');
const avatarG = require('../assets/images/avatar_2.png');
const avatarH = require('../assets/images/avatar_3.png');

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)/circles');
    }
  }, [isAuthenticated, isLoading]);

  return (
    <LinearGradient
      colors={['#FDE8F0', '#EFE4FB', '#E4D9F8', '#DDD4F5']}
      locations={[0, 0.35, 0.65, 1]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
      style={styles.gradient}
    >
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.orbitContainer}>
            {/* Background glowing circle */}
            <View style={styles.centerGlow} />
            
            {/* Orbiting Avatars */}
            <Image source={avatarA} style={[styles.orbitAvatar, styles.pos1]} />
            <Image source={avatarB} style={[styles.orbitAvatar, styles.pos2]} />
            <Image source={avatarC} style={[styles.orbitAvatar, styles.pos3, { transform: [{ scaleX: -1 }] }]} />
            <Image source={avatarD} style={[styles.orbitAvatar, styles.pos4, { transform: [{ scaleX: -1 }] }]} />
            <Image source={avatarE} style={[styles.orbitAvatar, styles.pos5]} />
            <Image source={avatarF} style={[styles.orbitAvatar, styles.pos6]} />
            <Image source={avatarG} style={[styles.orbitAvatar, styles.pos7]} />
            <Image source={avatarH} style={[styles.orbitAvatar, styles.pos8, { transform: [{ scaleX: -1 }] }]} />

            {/* Center Avatar */}
            <View style={styles.centerAvatarContainer}>
              <Image source={centerAvatar} style={styles.centerAvatar} />
            </View>
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.headline}>Welcome to My Circles</Text>
          <Text style={styles.supporting}>
            A private space for your closest friends and communities.
          </Text>
        </View>

        <View style={styles.ctas}>
          <PrimaryButton 
            black 
            label="Get Started" 
            onPress={() => router.push('/register')} 
            disabled={isLoading}
          />
          <Pressable 
            onPress={() => router.push('/login')} 
            style={styles.tertiaryBtn}
            disabled={isLoading}
          >
            <Text style={styles.tertiaryBtnText}>Log in</Text>
          </Pressable>
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  orbitContainer: {
    width: 320,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#9B80F5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
  },
  centerAvatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  centerAvatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  orbitAvatar: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pos1: { top: 10, left: 136 },
  pos2: { top: 38, right: 48 },
  pos3: { top: 106, right: 10 },
  pos4: { bottom: 64, right: 38 },
  pos5: { bottom: 10, left: 136 },
  pos6: { bottom: 48, left: 48 },
  pos7: { top: 140, left: 10 },
  pos8: { top: 58, left: 40 },

  textSection: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 40,
  },
  headline: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1,
  },
  supporting: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  ctas: {
    paddingHorizontal: 32,
    gap: 8,
    marginBottom: 20,
  },
  tertiaryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tertiaryBtnText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '600',
  },
});
