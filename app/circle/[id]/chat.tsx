import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Animated,
  GestureResponderEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// expo-av native module might be missing in some Expo Go versions or without a dev build
let Audio: any = null;
try {
  Audio = require('expo-av').Audio;
} catch (e) {
  console.warn('expo-av is not available in this environment');
}

import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessages, ChatMessage } from '../../../hooks/useMessages';
import { useCircles } from '../../../hooks/useCircles';
import { CIRCLE_ICONS, USER_AVATARS } from '../../../constants/assets';
import * as ImagePicker from 'expo-image-picker';
import { uploadMedia } from '../../../data/api';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Voice bubble ──────────────────────────────────────────────────────────────

function VoiceBubble({
  item,
  isOwn,
}: {
  item: ChatMessage;
  isOwn: boolean;
}) {
  const [sound, setSound] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number>(0);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalMs = item.voiceDuration ? parseInt(item.voiceDuration, 10) : 0;

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [sound]);

  const togglePlay = async () => {
    if (!item.mediaId) return;

    if (playing) {
      await sound?.pauseAsync();
      setPlaying(false);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    if (!Audio) {
      alert('Audio playback is not supported in this environment (needs a dev build).');
      return;
    }

    if (sound) {
      await sound.playAsync();
      setPlaying(true);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: `${API_URL}/media/${item.mediaId}` },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setPlaying(false);
              setProgress(0);
              if (progressRef.current) clearInterval(progressRef.current);
            }
          }
        },
      );
      setSound(newSound);
      setPlaying(true);

      const status = await newSound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        setDuration(status.durationMillis);
      }
    }
  };

  // Simple progress ticker
  useEffect(() => {
    if (playing) {
      progressRef.current = setInterval(async () => {
        if (!sound) return;
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.durationMillis && status.positionMillis !== undefined) {
          setProgress(status.positionMillis / status.durationMillis);
        }
      }, 200);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [playing, sound]);

  const displayDuration = duration > 0 ? formatDuration(duration) : totalMs > 0 ? formatDuration(totalMs) : '0:00';

  return (
    <View style={[styles.voiceBubble, isOwn ? styles.voiceBubbleOwn : styles.voiceBubbleOther]}>
      <Pressable onPress={togglePlay} style={styles.voicePlayBtn}>
        <Ionicons
          name={playing ? 'pause' : 'play'}
          size={18}
          color={isOwn ? Colors.white : Colors.violet}
        />
      </Pressable>

      {/* Waveform bar */}
      <View style={styles.voiceWaveWrap}>
        <View style={styles.voiceTrack}>
          <View
            style={[
              styles.voiceFill,
              {
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: isOwn ? 'rgba(255,255,255,0.9)' : Colors.violet,
              },
            ]}
          />
        </View>
        <Text style={[styles.voiceDuration, isOwn && styles.voiceDurationOwn]}>
          {displayDuration}
        </Text>
      </View>
    </View>
  );
}

// ── Avatar bubble ─────────────────────────────────────────────────────────────

function SenderAvatar({
  initials,
  gradientIndex,
  avatarId,
}: {
  initials: string;
  gradientIndex: number;
  avatarId?: string;
}) {
  return (
    <View style={styles.senderAvatarWrapper}>
      <Image
        source={USER_AVATARS[avatarId as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1']}
        style={styles.senderAvatarImg}
      />
    </View>
  );
}

// ── Message row ───────────────────────────────────────────────────────────────

function MessageRow({ item, isOwn }: { item: ChatMessage; isOwn: boolean }) {
  const time = item.timestamp
    ? new Date(item.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  if (item.type === 'memory') {
    return (
      <View style={styles.memoryStrip}>
        <View style={styles.memoryHeader}>
          <Text style={styles.memorySender}>{item.senderName}</Text>
          <Text style={styles.memoryCaption}>{item.memoryCaption}</Text>
        </View>
        <View style={styles.memoryThumbs}>
          {item.mediaId ? (
            <Image
              source={{ uri: `${API_URL}/media/${item.mediaId}` }}
              style={styles.memoryImage}
            />
          ) : (
            [0, 1, 2].map((i) => (
              <LinearGradient
                key={i}
                colors={['#E5E7EB', '#D1D5DB']}
                style={styles.memoryThumb}
              >
                <Text style={styles.thumbEmoji}>📷</Text>
              </LinearGradient>
            ))
          )}
        </View>
        <Text style={styles.memoryTime}>{time}</Text>
      </View>
    );
  }

  if (item.type === 'voice') {
    return (
      <View style={[styles.row, isOwn && styles.rowOwn]}>
        {!isOwn && (
          <SenderAvatar
            initials={item.senderInitials}
            gradientIndex={item.senderGradient}
            avatarId={item.senderAvatarId}
          />
        )}
        <View style={styles.bubbleCol}>
          {!isOwn && <Text style={styles.senderName}>{item.senderName}</Text>}
          <VoiceBubble item={item} isOwn={isOwn} />
          <Text style={[styles.timeText, isOwn && styles.timeTextOwn]}>{time}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.row, isOwn && styles.rowOwn]}>
      {!isOwn && (
        <SenderAvatar
          initials={item.senderInitials}
          gradientIndex={item.senderGradient}
          avatarId={item.senderAvatarId}
        />
      )}
      <View style={styles.bubbleCol}>
        {!isOwn && <Text style={styles.senderName}>{item.senderName}</Text>}
        <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>{item.text}</Text>
        </View>
        <Text style={[styles.timeText, isOwn && styles.timeTextOwn]}>{time}</Text>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { circles } = useCircles();
  const { messages, isLoading, sendMessage } = useMessages(id);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Voice recording
  const [recording, setRecording] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMs, setRecordingMs] = useState(0);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const micPulse = useRef(new Animated.Value(1)).current;

  const circle = circles.find((c) => c.id === id);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  // Mic pulse animation
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      micPulse.stopAnimation();
      micPulse.setValue(1);
    }
  }, [isRecording]);

  const startRecording = async () => {
    if (!Audio) {
      alert('Audio recording is not supported in this environment (needs a dev build).');
      return;
    }
    
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: rec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecording(rec);
      setIsRecording(true);
      setRecordingMs(0);
      recordTimerRef.current = setInterval(() => {
        setRecordingMs((prev) => prev + 1000);
      }, 1000);
    } catch (err) {
      console.warn('Failed to start recording', err);
    }
  };

  const stopAndSendRecording = async () => {
    if (!recording) return;
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);

    setIsRecording(false);
    setSending(true);

    try {
      await recording.stopAndUnloadAsync();
      if (Audio) {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      }
      const uri = recording.getURI();
      const durationMs = recordingMs;

      if (uri && durationMs >= 1000) {
        const uploaded = await uploadMedia(uri, 'audio/m4a', id);
        await sendMessage('', 'voice', undefined, uploaded.id, String(durationMs));
      }
    } catch (err) {
      console.warn('Failed to send voice note', err);
    } finally {
      setRecording(null);
      setRecordingMs(0);
      setSending(false);
    }
  };

  const cancelRecording = async () => {
    if (!recording) return;
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
    } catch {}
    setRecording(null);
    setRecordingMs(0);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    setInputText('');
    setSending(true);
    await sendMessage(text);
    setSending(false);
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSending(true);
      try {
        const asset = result.assets[0];
        const uploaded = await uploadMedia(asset.uri, asset.mimeType || 'image/jpeg', id);
        await sendMessage('', 'memory', 'Shared a memory', uploaded.id);
      } catch (err: any) {
        console.warn(err);
      } finally {
        setSending(false);
      }
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageRow item={item} isOwn={item.senderId === user?.id} />
  );

  const showMic = !inputText.trim() && !sending;

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.navy} />
          </Pressable>

          <Pressable
            style={styles.headerMeta}
            onPress={() => router.push(`/circle/${id}/detail`)}
          >
            <View style={styles.headerTitleRow}>
              <Image
                source={CIRCLE_ICONS[(circle?.emoji as keyof typeof CIRCLE_ICONS)] || CIRCLE_ICONS['circle_house']}
                style={styles.headerCircleIcon}
              />
              <Text style={styles.circleName}>{circle?.name ?? '…'}</Text>
            </View>
            <Text style={styles.memberCount}>
              {circle ? `${circle.memberCount} members` : ''}
            </Text>
          </Pressable>

          <Pressable
            style={styles.headerActionBtn}
            onPress={() => router.push(`/circle/${id}/detail`)}
          >
            <Ionicons name="information-circle-outline" size={24} color={Colors.navy} />
          </Pressable>
        </View>

        {/* Messages */}
        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={Colors.violet} />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              Be the first to say something in {circle?.name ?? 'this circle'}!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          {isRecording ? (
            // ── Recording state ────────────────────────────────────────────────
            <>
              <Pressable onPress={cancelRecording} style={styles.cancelRecordBtn}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </Pressable>

              <View style={styles.recordingPill}>
                <Animated.View style={[styles.recordDot, { transform: [{ scale: micPulse }] }]} />
                <Text style={styles.recordTimer}>{formatDuration(recordingMs)}</Text>
                <Text style={styles.recordHint}>Release to send</Text>
              </View>

              <Pressable onPress={stopAndSendRecording} style={styles.sendBtn}>
                <Ionicons name="send" size={18} color={Colors.white} />
              </Pressable>
            </>
          ) : (
            // ── Normal state ────────────────────────────────────────────────────
            <>
              <Pressable onPress={handlePickImage} disabled={sending} style={styles.attachBtn}>
                <Ionicons name="image-outline" size={24} color={Colors.muted} />
              </Pressable>

              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder={`Message ${circle?.name ?? 'circle'}…`}
                  placeholderTextColor={Colors.muted}
                  multiline
                  onSubmitEditing={handleSend}
                  blurOnSubmit={false}
                />
                <Ionicons name="happy-outline" size={22} color={Colors.muted} style={styles.emojiIcon} />
              </View>

              {showMic ? (
                <Pressable
                  onPress={startRecording}
                  style={styles.micBtn}
                  disabled={sending}
                >
                  <Ionicons name="mic" size={20} color={Colors.white} />
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleSend}
                  style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
                  disabled={!inputText.trim() || sending}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Ionicons name="send" size={18} color={Colors.white} />
                  )}
                </Pressable>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1, backgroundColor: Colors.background },

  // Header
  headerGradient: { marginBottom: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerMeta: { flex: 1, gap: 2 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerCircleIcon: { width: 22, height: 22, resizeMode: 'contain' },
  circleName: { fontSize: 16, fontWeight: Typography.bold, color: Colors.navy },
  memberCount: { fontSize: 12, color: Colors.muted },
  headerActionBtn: { padding: 4 },

  // States
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  emptyText: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 20 },

  // Message list
  messageList: { paddingVertical: 20, paddingHorizontal: 16 },

  // Message rows
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
  rowOwn: { flexDirection: 'row-reverse' },
  senderAvatarWrapper: {
    width: 32, height: 32, borderRadius: 16, flexShrink: 0, overflow: 'hidden', backgroundColor: '#E5E7EB',
  },
  senderAvatarImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  bubbleCol: { maxWidth: '72%', gap: 3 },
  senderName: { fontSize: 11, fontWeight: '700', color: Colors.muted, marginLeft: 4 },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleOwn: { backgroundColor: Colors.violet, borderBottomRightRadius: 4 },
  bubbleOther: {
    backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#ECEAF5',
  },
  bubbleText: { fontSize: 15, color: Colors.navy, lineHeight: 21 },
  bubbleTextOwn: { color: Colors.white },
  timeText: { fontSize: 10, color: Colors.mutedLight, marginLeft: 4 },
  timeTextOwn: { textAlign: 'right', marginRight: 4 },

  // Voice bubble
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    minWidth: 180,
  },
  voiceBubbleOwn: { backgroundColor: Colors.violet, borderBottomRightRadius: 4 },
  voiceBubbleOther: {
    backgroundColor: Colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#ECEAF5',
  },
  voicePlayBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  voiceWaveWrap: { flex: 1, gap: 4 },
  voiceTrack: {
    height: 4, backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 2, overflow: 'hidden',
  },
  voiceFill: { height: 4, borderRadius: 2 },
  voiceDuration: { fontSize: 11, color: Colors.muted },
  voiceDurationOwn: { color: 'rgba(255,255,255,0.75)' },

  // Memory
  memoryStrip: { marginLeft: 40, marginRight: 16, marginBottom: 16 },
  memoryHeader: { marginBottom: 8 },
  memorySender: { fontSize: 11, fontWeight: Typography.bold, color: Colors.violet, marginBottom: 2 },
  memoryCaption: { fontSize: 14, color: Colors.navy },
  memoryThumbs: { flexDirection: 'row', gap: 8 },
  memoryThumb: { width: 80, height: 100, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 24 },
  memoryTime: { fontSize: 10, color: Colors.mutedLight, alignSelf: 'flex-end', marginTop: 6 },
  memoryImage: { width: 250, height: 250, borderRadius: 16, resizeMode: 'cover' },

  // Input
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#F3F4F6', gap: 10,
  },
  attachBtn: { padding: 4, marginLeft: -4 },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F3F4F6', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10,
  },
  input: { flex: 1, fontSize: 15, color: Colors.navy, maxHeight: 100 },
  emojiIcon: { marginLeft: 8 },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.violet,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.45 },
  micBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.violet,
    alignItems: 'center', justifyContent: 'center',
  },

  // Recording UI
  cancelRecordBtn: { padding: 8 },
  recordingPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FEF2F2', borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10,
  },
  recordDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' },
  recordTimer: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
  recordHint: { fontSize: 13, color: Colors.muted },
});
