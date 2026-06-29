import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { USER_AVATARS } from '../../constants/assets';

const AVATAR_OPTIONS = Object.keys(USER_AVATARS);

export default function EditAvatarModal() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(user?.avatarId || AVATAR_OPTIONS[0]);

  const handleSave = () => {
    // Ideally we would save this to the backend using an API call.
    // For now we will just pop the modal. Since mockData is static,
    // the user might not see it persist unless we update the context.
    // To make it simple, we just pretend it saves for the UI demo.
    // user.avatarId = selected; (if we had a setter)
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#374151" />
        </Pressable>
        <Text style={styles.headerTitle}>Choose Avatar</Text>
        <Pressable onPress={handleSave} hitSlop={8}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.previewContainer}>
          <Image source={USER_AVATARS[selected as keyof typeof USER_AVATARS]} style={styles.previewAvatar} />
        </View>

        <Text style={styles.sectionTitle}>Available Avatars</Text>
        
        <View style={styles.grid}>
          {AVATAR_OPTIONS.map(id => {
            const active = id === selected;
            return (
              <Pressable
                key={id}
                onPress={() => setSelected(id)}
                style={[styles.gridItem, active && styles.gridItemActive]}
              >
                <Image source={USER_AVATARS[id as keyof typeof USER_AVATARS]} style={styles.gridAvatar} />
                {active && (
                  <View style={styles.activeCheck}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
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
  saveText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  previewAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  gridItem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridItemActive: {
    borderColor: '#111827',
  },
  gridAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E5E7EB',
  },
  activeCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
