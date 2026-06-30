import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { useCircles } from '../../hooks/useCircles';
import { Colors } from '../../constants/colors';
import { USER_AVATARS } from '../../constants/assets';
import { useToast } from '../../providers/ToastProvider';

const SETTINGS = [
  {
    id: 'account',
    icon: 'person-outline' as const,
    label: 'Account',
    sub: 'Manage your account details',
    color: '#111827',
    bg: '#F3F4F6',
  },
  {
    id: 'privacy',
    icon: 'shield-outline' as const,
    label: 'Privacy',
    sub: 'Control your privacy settings',
    color: '#111827',
    bg: '#F3F4F6',
  },
  {
    id: 'notifs',
    icon: 'notifications-outline' as const,
    label: 'Notifications',
    sub: 'Manage your notification preferences',
    color: '#111827',
    bg: '#F3F4F6',
  },
  {
    id: 'invite',
    icon: 'person-add-outline' as const,
    label: 'Invite friends',
    sub: 'Bring your friends to My Circles',
    color: '#111827',
    bg: '#F3F4F6',
  },
  {
    id: 'help',
    icon: 'help-circle-outline' as const,
    label: 'Help & support',
    sub: 'Get help and learn more',
    color: '#111827',
    bg: '#F3F4F6',
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);
  const { user, logout } = useAuth();
  const { circles } = useCircles();
  const toast = useToast();
  const [showLogout, setShowLogout] = useState(false);
  const displayName = user?.name ?? 'Your profile';
  const rawUsername = user?.username ?? 'you';
  const username = rawUsername.startsWith('@') ? rawUsername : `@${rawUsername}`;
  const initials = user?.initials ?? displayName.slice(0, 1).toUpperCase();
  const bio = user?.bio?.trim() || 'No bio yet';
  const totalPeople = circles.reduce((acc, circle) => acc + circle.memberCount, 0);
  const gradient = Colors.avatarGradients[user?.gradientIndex ?? 0] ?? Colors.gradientViolet;
  const shareLink = `mycircles.app/${username.replace(/^@/, '')}`;
  // Use custom photo if set, otherwise fall back to preset avatar
  const avatarSource = user?.photoUri
    ? { uri: user.photoUri }
    : USER_AVATARS[user?.avatarId as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1'];

  function handleLogout() {
    setShowLogout(true);
  }

  async function confirmLogout() {
    setShowLogout(false);
    await logout();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: tabClearance }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Profile</Text>
            <Text style={styles.pageSubtitle}>Your profile card</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.bellBtn}>
              <Ionicons name="notifications-outline" size={19} color="#111827" />
              <View style={styles.notifDot} />
            </Pressable>
            <Image
              source={avatarSource}
              style={styles.headerAvatarImage}
            />
          </View>
        </View>

        {/* ── Profile Card ── */}
        <View style={styles.card}>
          {/* Avatar */}
          <Pressable style={styles.avatarWrap} onPress={() => router.push('/modal/edit-avatar')}>
            <Image
              source={avatarSource}
              style={styles.avatarImage}
            />
            <View style={styles.badge}>
              <Ionicons name="pencil" size={11} color="#fff" />
            </View>
          </Pressable>

          {/* Name + username + bio */}
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.bio}>{bio}</Text>

          <Pressable
            style={({ pressed }) => [styles.editBioBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/modal/edit-profile')}
          >
            <Text style={styles.editBioText}>Edit Profile</Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Ionicons name="heart-outline" size={12} color="#D1D5DB" />
            <View style={styles.dividerLine} />
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="people-outline" size={18} color="#111827" />
              <Text style={styles.statNum}>{circles.length}</Text>
              <Text style={styles.statLbl}>Circles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="person-outline" size={18} color="#111827" />
              <Text style={styles.statNum}>{totalPeople}</Text>
              <Text style={styles.statLbl}>People</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="images-outline" size={18} color="#111827" />
              <Text style={styles.statNum}>0</Text>
              <Text style={styles.statLbl}>Memories</Text>
            </View>
          </View>
        </View>

        {/* ── Action buttons ── */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) =>
              [styles.actionBtn, pressed && { opacity: 0.82 }]
            }
            onPress={() =>
              Share.share({ message: `Join me on My Circles! ${shareLink}` })
            }
          >
            <Ionicons name="share-outline" size={15} color="#111827" />
            <Text style={styles.actionText}>Share Card</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) =>
              [styles.actionBtn, pressed && { opacity: 0.82 }]
            }
            onPress={() => toast.show('QR Code coming soon!', 'info')}
          >
            <Ionicons name="qr-code-outline" size={15} color="#111827" />
            <Text style={styles.actionText}>Show QR</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) =>
              [styles.actionBtn, pressed && { opacity: 0.82 }]
            }
            onPress={() => toast.show('Link copied!', 'success')}
          >
            <Ionicons name="link-outline" size={15} color="#111827" />
            <Text style={styles.actionText}>Copy Link</Text>
          </Pressable>
        </View>

        {/* ── Settings ── */}
        <View style={styles.settingsCard}>
          {SETTINGS.map((s, i) => (
            <Pressable
              key={s.id}
              style={({ pressed }) => [
                styles.row,
                i < SETTINGS.length - 1 && styles.rowBorder,
                pressed && { backgroundColor: '#F9F8FF' },
              ]}
              onPress={() => {
                if (s.id === 'account') {
                  router.push('/modal/edit-profile');
                } else {
                  toast.show('Coming soon!', 'info');
                }
              }}
            >
              <View style={[styles.iconBox, { backgroundColor: s.bg }]}>
                <Ionicons name={s.icon} size={18} color={s.color} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{s.label}</Text>
                <Text style={styles.rowSub}>{s.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#D0D5DD" />
            </Pressable>
          ))}
        </View>

        {/* ── Log out ── */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.75 }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>

        <Text style={styles.version}>My Circles v1.0.0</Text>
      </ScrollView>

      {/* ── Logout Modal ── */}
      <Modal visible={showLogout} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Log out</Text>
            <Text style={styles.modalText}>Are you sure you want to log out of your account?</Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#F3F4F6' }]}
                onPress={() => setShowLogout(false)}
              >
                <Text style={[styles.modalBtnText, { color: '#111827' }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#EF4444' }]}
                onPress={confirmLogout}
              >
                <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Log out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  headerGradient: {
    marginBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FAF8FF',
  },
  headerAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  avatarWrap: {
    marginBottom: 8,
    position: 'relative',
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
  },
  badge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -0.4,
    marginTop: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  bio: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  editBioBtn: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  editBioText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statNum: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 24,
  },
  statLbl: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F3F4F6',
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingVertical: 13,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },

  // Settings
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 13,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowText: { flex: 1, gap: 1 },
  rowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1040',
  },
  rowSub: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 20,
    marginBottom: 40,
    fontWeight: '500',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  modalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
});

