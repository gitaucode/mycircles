import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { createCircle } from '../data/api';
import { USER_AVATARS, CIRCLE_ICONS } from '../constants/assets';
import PrimaryButton from '../components/PrimaryButton';
import { useToast } from '../providers/ToastProvider';

const AVATAR_OPTIONS = Object.keys(USER_AVATARS) as (keyof typeof USER_AVATARS)[];
const ICON_OPTIONS = Object.keys(CIRCLE_ICONS);

const CIRCLE_TYPES = [
  { label: 'Friends',  icon: 'people-outline' as any },
  { label: 'Family',   icon: 'home-outline' as any },
  { label: 'Campus',   icon: 'school-outline' as any },
  { label: 'Creators', icon: 'sparkles-outline' as any },
  { label: 'Work',     icon: 'briefcase-outline' as any },
];

export default function OnboardingScreen() {
  const { user, updateUser } = useAuth();
  const { show: showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 state
  const [avatarId, setAvatarId] = useState<string>(user?.avatarId || 'avatar_1');

  // Step 2 state
  const [circleName, setCircleName] = useState('');
  const [circleType, setCircleType] = useState('Friends');
  const [circleIconId, setCircleIconId] = useState(ICON_OPTIONS[0]);

  // Step 3 state
  const [createdCircleName, setCreatedCircleName] = useState('');

  const handleSaveAvatar = async () => {
    setIsSubmitting(true);
    try {
      await updateUser({ avatarId });
      setStep(2);
    } catch (e) {
      showToast('Failed to save avatar', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCircle = async () => {
    if (!circleName.trim()) {
      showToast('Please enter a circle name', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await createCircle({
        name: circleName.trim(),
        type: circleType,
        isPublic: false,
        iconId: circleIconId,
      });
      setCreatedCircleName(circleName.trim());
      setStep(3);
    } catch (e) {
      showToast('Could not create circle', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishOnboarding = () => {
    router.replace('/(tabs)/circles');
  };

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
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.headerArea}>
                <Text style={styles.title}>Let's put a face to the name</Text>
                <Text style={styles.subtitle}>Choose an avatar for your profile</Text>
              </View>

              <View style={styles.grid}>
                {AVATAR_OPTIONS.map((id) => {
                  const selected = avatarId === id;
                  return (
                    <Pressable
                      key={id}
                      onPress={() => setAvatarId(id)}
                      style={[
                        styles.avatarWrap,
                        selected && styles.avatarWrapSelected,
                      ]}
                    >
                      <Image source={USER_AVATARS[id]} style={styles.avatarImage} />
                    </Pressable>
                  );
                })}
              </View>
              <View style={{ flex: 1 }} />
              <PrimaryButton 
                label={isSubmitting ? "Saving..." : "Continue"} 
                onPress={handleSaveAvatar} 
                disabled={isSubmitting} 
                black
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.headerArea}>
                <Text style={styles.title}>Create your first circle</Text>
                <Text style={styles.subtitle}>Where your people come together</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.nameRow}>
                  <Pressable
                    style={styles.emojiBtn}
                    onPress={() => {
                      const i = ICON_OPTIONS.indexOf(circleIconId);
                      setCircleIconId(ICON_OPTIONS[(i + 1) % ICON_OPTIONS.length]);
                    }}
                  >
                    <Image source={CIRCLE_ICONS[circleIconId as keyof typeof CIRCLE_ICONS]} style={styles.iconImage} />
                  </Pressable>
                  <TextInput
                    style={styles.nameInput}
                    value={circleName}
                    onChangeText={setCircleName}
                    placeholder="Circle name"
                    placeholderTextColor="#9CA3AF"
                    maxLength={40}
                  />
                </View>
                <Text style={styles.hint}>Tap the icon to change it</Text>

                <Text style={styles.sectionLabel}>Type</Text>
                <View style={styles.typeGrid}>
                  {CIRCLE_TYPES.map((t) => {
                    const active = circleType === t.label;
                    return (
                      <Pressable
                        key={t.label}
                        onPress={() => setCircleType(t.label)}
                        style={[styles.typeChip, active && styles.typeChipActive]}
                      >
                        <Ionicons
                          name={t.icon}
                          size={16}
                          color={active ? '#FFFFFF' : '#6B7280'}
                        />
                        <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                          {t.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              
              <View style={{ flex: 1 }} />
              <PrimaryButton 
                label={isSubmitting ? "Creating..." : "Create Circle"} 
                onPress={handleCreateCircle} 
                disabled={isSubmitting || !circleName.trim()} 
                black
              />
            </View>
          )}

          {step === 3 && (
            <View style={styles.successContainer}>
              <View style={styles.successIconPremium}>
                <Ionicons name="checkmark-outline" size={42} color="#111827" />
              </View>
              <Text style={styles.successTitle}>You're all set!</Text>
              <Text style={styles.successText}>
                {createdCircleName} has been created.
              </Text>
              <View style={{ height: 40 }} />
              <PrimaryButton 
                label="Enter My Circles" 
                onPress={finishOnboarding} 
                black
              />
            </View>
          )}

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
  content: {
    flexGrow: 1,
    padding: 24,
  },
  stepContainer: {
    flex: 1,
  },
  headerArea: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  // Step 1: Avatar Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarWrapSelected: {
    borderColor: '#111827',
    backgroundColor: '#E5E7EB',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Step 2: Form
  form: {
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    height: 44,
    backgroundColor: 'transparent',
  },
  hint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 32,
    paddingLeft: 6,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Step 3: Success
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconPremium: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  successText: {
    fontSize: 15,
    color: '#6B7280',
  },
});

