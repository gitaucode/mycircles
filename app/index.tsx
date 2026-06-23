import React from 'react';
import {
  ImageBackground,
  View,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import PrimaryButton from '../components/PrimaryButton';

const SPLASH_IMAGE = require('../assets/splash.webp');

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  const enterApp = () => {
    router.replace('/home');
  };

  return (
    <ImageBackground
      source={SPLASH_IMAGE}
      resizeMode="cover"
      style={styles.screen}
    >
      <StatusBar style="light" />

      {/* Bottom gradient overlay so buttons stay readable */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.55)']}
        style={styles.overlay}
        pointerEvents="none"
      />

      {/* CTA buttons pinned to the bottom */}
      <View style={[styles.ctas, { paddingBottom: Math.max(insets.bottom, 28) }]}>
        <PrimaryButton
          label="Create Your Circle"
          onPress={enterApp}
        />
        <PrimaryButton
          label="I already have an invite"
          onPress={enterApp}
          ghost
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B0B1A',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  ctas: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    gap: 12,
  },
});
