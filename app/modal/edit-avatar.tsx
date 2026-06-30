import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { USER_AVATARS } from '../../constants/assets';
import { useToast } from '../../providers/ToastProvider';

const AVATAR_OPTIONS = Object.keys(USER_AVATARS) as (keyof typeof USER_AVATARS)[];

export default function EditAvatarModal() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [selected, setSelected] = useState<string>(user?.avatarId || AVATAR_OPTIONS[0]);
  // Custom photo URI — if set, this takes priority over the preset avatar
  const [customUri, setCustomUri] = useState<string | null>(user?.photoUri ?? null);
  const [isSaving, setIsSaving] = useState(false);

  // ── Photo picker ────────────────────────────────────────────────────────────
  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.show('Permission needed to access your photos.', 'error');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCustomUri(result.assets[0].uri);
      // Clear preset selection when custom photo is picked
      setSelected('');
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      toast.show('Permission needed to use your camera.', 'error');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCustomUri(result.assets[0].uri);
      setSelected('');
    }
  }

  // Selecting a preset clears any custom photo
  function handleSelectPreset(id: string) {
    setSelected(id);
    setCustomUri(null);
  }

  // ── Save ────────────────────────────────────────────────────────────────────
  async function handleSave() {
    setIsSaving(true);
    try {
      await updateUser({
        avatarId: customUri ? undefined : selected,
        photoUri: customUri ?? null,
      });
      toast.show('Avatar updated!', 'success');
      router.back();
    } catch {
      toast.show('Could not save avatar. Try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  // ── Preview source ──────────────────────────────────────────────────────────
  const previewSource = customUri
    ? { uri: customUri }
    : USER_AVATARS[selected as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1'];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#374151" />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Photo</Text>
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          hitSlop={8}
          style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>

        {/* ── Preview ── */}
        <View style={styles.previewContainer}>
          <Image source={previewSource} style={styles.previewAvatar} />
          {customUri && (
            <Pressable
              style={styles.removeCustomBtn}
              onPress={() => {
                setCustomUri(null);
                setSelected(user?.avatarId || AVATAR_OPTIONS[0]);
              }}
            >
              <Ionicons name="close-circle" size={22} color="#EF4444" />
            </Pressable>
          )}
        </View>

        {/* ── Upload options ── */}
        <View style={styles.uploadRow}>
          <Pressable
            style={({ pressed }) => [styles.uploadBtn, pressed && { opacity: 0.8 }]}
            onPress={handlePickPhoto}
          >
            <Ionicons name="images-outline" size={18} color="#111827" />
            <Text style={styles.uploadBtnText}>Choose Photo</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.uploadBtn, pressed && { opacity: 0.8 }]}
            onPress={handleTakePhoto}
          >
            <Ionicons name="camera-outline" size={18} color="#111827" />
            <Text style={styles.uploadBtnText}>Take Photo</Text>
          </Pressable>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or choose an avatar</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Avatar grid ── */}
        <View style={styles.grid}>
          {AVATAR_OPTIONS.map((id) => {
            const active = id === selected && !customUri;
            return (
              <Pressable
                key={id}
                onPress={() => handleSelectPreset(id)}
                style={[styles.gridItem, active && styles.gridItemActive]}
              >
                <Image
                  source={USER_AVATARS[id]}
                  style={[styles.gridAvatar, active && styles.gridAvatarActive]}
                />
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

  // Header
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
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  body: {
    padding: 20,
    paddingBottom: 48,
  },

  // Preview
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
    position: 'relative',
    alignSelf: 'center',
  },
  previewAvatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  removeCustomBtn: {
    position: 'absolute',
    top: 0,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },

  // Upload buttons
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Avatar grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  gridItem: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#E5E7EB',
  },
  gridAvatarActive: {
    opacity: 1,
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

