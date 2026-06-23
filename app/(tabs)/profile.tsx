import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CURRENT_USER } from '../../data/mockData';

const MAYA_AVATAR = 'https://i.pravatar.cc/150?img=47';

const SETTINGS = [
  {
    id: 'account',
    icon: 'person-outline' as const,
    label: 'Account',
    sub: 'Manage your account details',
    color: '#7655F0',
    bg: '#EDE8FF',
  },
  {
    id: 'privacy',
    icon: 'shield-outline' as const,
    label: 'Privacy',
    sub: 'Control your privacy settings',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    id: 'notifs',
    icon: 'notifications-outline' as const,
    label: 'Notifications',
    sub: 'Manage your notification preferences',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    id: 'invite',
    icon: 'person-add-outline' as const,
    label: 'Invite friends',
    sub: 'Bring your friends to My Circles',
    color: '#22C55E',
    bg: '#F0FDF4',
  },
  {
    id: 'help',
    icon: 'help-circle-outline' as const,
    label: 'Help & support',
    sub: 'Get help and learn more',
    color: '#6B7280',
    bg: '#F9FAFB',
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const tabClearance = 86 + Math.max(insets.bottom, 12);

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
              <Ionicons name="notifications-outline" size={19} color="#7655F0" />
              <View style={styles.notifDot} />
            </Pressable>
            <Image source={{ uri: MAYA_AVATAR }} style={styles.headerAvatar} />
          </View>
        </View>

        {/* ── Profile Card ── */}
        <LinearGradient
          colors={['#EDE8FF', '#F5EEFF', '#FFE9F5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Image source={{ uri: MAYA_AVATAR }} style={styles.avatar} />
            <View style={styles.badge}>
              <Ionicons name="sparkles" size={11} color="#fff" />
            </View>
          </View>

          {/* Name + username + bio */}
          <Text style={styles.name}>{CURRENT_USER.name} 🤍</Text>
          <Text style={styles.username}>{CURRENT_USER.username}</Text>
          <Text style={styles.bio}>{CURRENT_USER.bio}</Text>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Ionicons name="heart-outline" size={12} color="#C4A8F0" />
            <View style={styles.dividerLine} />
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="people-outline" size={18} color="#7655F0" />
              <Text style={styles.statNum}>6</Text>
              <Text style={styles.statLbl}>Circles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="person-outline" size={18} color="#F4845F" />
              <Text style={styles.statNum}>42</Text>
              <Text style={styles.statLbl}>People</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="images-outline" size={18} color="#22B5CC" />
              <Text style={styles.statNum}>18</Text>
              <Text style={styles.statLbl}>Memories</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Action buttons ── */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.82 }]}
            onPress={() => Share.share({ message: 'Join my circles! mycircles.app/maya' })}
          >
            <Ionicons name="share-outline" size={16} color="#7655F0" />
            <Text style={styles.actionText}>Share Profile Card</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.82 }]}
            onPress={() => Alert.alert('QR Code', 'Coming soon!')}
          >
            <Ionicons name="qr-code-outline" size={16} color="#7655F0" />
            <Text style={styles.actionText}>Show QR Code</Text>
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
              onPress={() => Alert.alert(s.label, 'Coming soon!')}
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

        <Text style={styles.version}>My Circles v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF8FF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1040',
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#7265A8',
    fontWeight: '500',
    marginTop: 2,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(118, 85, 240, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
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
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#7655F0',
    backgroundColor: '#C4B5FD',
  },

  // Card
  card: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(118,85,240,0.12)',
    shadowColor: '#7655F0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  avatarWrap: {
    marginBottom: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#7655F0',
    backgroundColor: '#C4B5FD',
  },
  badge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7655F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EDE8FF',
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2A1F5E',
    letterSpacing: -0.4,
    marginTop: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7655F0',
  },
  bio: {
    fontSize: 13,
    color: '#7265A8',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
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
    backgroundColor: 'rgba(118,85,240,0.15)',
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
    color: '#2A1F5E',
    lineHeight: 24,
  },
  statLbl: {
    fontSize: 11,
    color: '#7265A8',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(118,85,240,0.12)',
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: 'rgba(118,85,240,0.15)',
    shadowColor: '#7655F0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7655F0',
  },

  // Settings
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 14,
    overflow: 'hidden',
    shadowColor: '#1A1040',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
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

  version: {
    textAlign: 'center',
    fontSize: 11,
    color: '#C4B5FD',
    fontWeight: '500',
    marginBottom: 8,
  },
});
