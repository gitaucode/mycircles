import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Logo from '../components/Logo';
import PrimaryButton from '../components/PrimaryButton';
import FeaturePill from '../components/FeaturePill';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

export default function OnboardingScreen() {
  const enterApp = () => {
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={[styles.blob, styles.blob1]} />
          <View style={[styles.blob, styles.blob2]} />
          <View style={[styles.blob, styles.blob3]} />

          <View style={styles.circleViz}>
            <View style={[styles.vizNode, styles.vizNode1]}>
              <LinearGradient colors={[Colors.violet, Colors.blue]} style={styles.vizNodeGrad}>
                <Text style={styles.vizNodeText}>A</Text>
              </LinearGradient>
            </View>
            <View style={[styles.vizNode, styles.vizNode2]}>
              <LinearGradient colors={['#F97316', '#EC4899']} style={styles.vizNodeGrad}>
                <Text style={styles.vizNodeText}>B</Text>
              </LinearGradient>
            </View>
            <View style={[styles.vizNode, styles.vizNode3]}>
              <LinearGradient colors={['#10B981', '#06B6D4']} style={styles.vizNodeGrad}>
                <Text style={styles.vizNodeText}>W</Text>
              </LinearGradient>
            </View>
            <View style={[styles.vizNode, styles.vizNode4]}>
              <LinearGradient colors={['#8B5CF6', '#6366F1']} style={styles.vizNodeGrad}>
                <Text style={styles.vizNodeText}>N</Text>
              </LinearGradient>
            </View>
            <View style={styles.vizCenter}>
              <Logo size={52} />
            </View>
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.headline}>Your people.{'\n'}Your space.</Text>
          <Text style={styles.supporting}>
            Private circles for chats, plans, and memories.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
          style={styles.pillsScroll}
        >
          <FeaturePill icon={'\uD83D\uDD12'} label="Private by design" variant="violet" />
          <FeaturePill icon={'\uD83D\uDCC5'} label="Plans made easy" variant="blue" />
          <FeaturePill icon={'\uD83D\uDCF8'} label="Memories that last" variant="green" />
        </ScrollView>

        <View style={styles.ctas}>
          <PrimaryButton label="Create Your Circle" onPress={enterApp} />
          <PrimaryButton
            label="I already have an invite"
            onPress={enterApp}
            outline
          />
        </View>

        <Text style={styles.legalText}>
          By continuing, you agree to our Terms & Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  blob: {
    position: 'absolute',
    borderRadius: 1000,
  },
  blob1: {
    width: 220,
    height: 220,
    backgroundColor: Colors.violet + '18',
    top: -40,
    left: -40,
  },
  blob2: {
    width: 180,
    height: 180,
    backgroundColor: Colors.blue + '14',
    bottom: -20,
    right: -30,
  },
  blob3: {
    width: 140,
    height: 140,
    backgroundColor: Colors.success + '10',
    top: 60,
    right: 30,
  },
  circleViz: {
    width: 220,
    height: 220,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vizNode: {
    position: 'absolute',
  },
  vizNode1: { top: 0, left: 30 },
  vizNode2: { top: 0, right: 30 },
  vizNode3: { bottom: 10, left: 10 },
  vizNode4: { bottom: 10, right: 10 },
  vizNodeGrad: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  vizNodeText: {
    color: Colors.white,
    fontWeight: Typography.bold,
    fontSize: Typography.md,
  },
  vizCenter: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 10,
    elevation: 6,
    shadowColor: Colors.violet,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  textSection: {
    paddingHorizontal: 28,
    marginBottom: 24,
  },
  headline: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.extrabold,
    color: Colors.navy,
    lineHeight: Typography['3xl'] * 1.15,
    marginBottom: 12,
    letterSpacing: 0,
  },
  supporting: {
    fontSize: Typography.md,
    color: Colors.muted,
    lineHeight: Typography.md * Typography.normal,
  },
  pillsScroll: {
    marginBottom: 28,
  },
  pillsRow: {
    paddingHorizontal: 28,
  },
  ctas: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 20,
  },
  legalText: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.mutedLight,
    paddingHorizontal: 40,
  },
});
