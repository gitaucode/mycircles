import React, { useEffect, useRef, useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../contexts/AuthContext';
import { useMessages, ChatMessage } from '../../../hooks/useMessages';
import { useCircles } from '../../../hooks/useCircles';

// ── Avatar bubble ─────────────────────────────────────────────────────────────

function SenderAvatar({
  initials,
  gradientIndex,
}: {
  initials: string;
  gradientIndex: number;
}) {
  const gradient = Colors.avatarGradients[gradientIndex % Colors.avatarGradients.length] as [string, string];
  return (
    <LinearGradient colors={gradient} style={styles.senderAvatar}>
      <Text style={styles.senderAvatarText}>{initials}</Text>
    </LinearGradient>
  );
}

// ── Message row ───────────────────────────────────────────────────────────────

function MessageRow({
  item,
  isOwn,
}: {
  item: ChatMessage;
  isOwn: boolean;
}) {
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
          {[0, 1, 2].map((i) => (
            <LinearGradient
              key={i}
              colors={['#E5E7EB', '#D1D5DB']}
              style={styles.memoryThumb}
            >
              <Text style={styles.thumbEmoji}>📷</Text>
            </LinearGradient>
          ))}
        </View>
        <Text style={styles.memoryTime}>{time}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, isOwn && styles.rowOwn]}>
      {!isOwn && (
        <SenderAvatar
          initials={item.senderInitials}
          gradientIndex={item.senderGradient}
        />
      )}
      <View style={styles.bubbleCol}>
        {!isOwn && (
          <Text style={styles.senderName}>{item.senderName}</Text>
        )}
        <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>
            {item.text}
          </Text>
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

  const circle = circles.find((c) => c.id === id);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    setInputText('');
    setSending(true);
    await sendMessage(text);
    setSending(false);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageRow item={item} isOwn={item.senderId === user?.id} />
  );

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
            <Text style={styles.circleName}>
              {circle?.emoji ?? '💜'} {circle?.name ?? '…'}
            </Text>
            <Text style={styles.memberCount}>
              {circle ? `${circle.memberCount} members` : ''}
            </Text>
          </Pressable>

          <Pressable
            style={styles.headerActionBtn}
            onPress={() => router.push(`/circle/${id}/detail`)}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={Colors.navy}
            />
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
              Be the first to say something in{' '}
              {circle?.name ?? 'this circle'}!
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
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
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
            <Ionicons
              name="happy-outline"
              size={22}
              color={Colors.muted}
              style={styles.emojiIcon}
            />
          </View>
          <Pressable
            onPress={handleSend}
            style={[
              styles.sendBtn,
              (!inputText.trim() || sending) && styles.sendBtnDisabled,
            ]}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons name="send" size={18} color={Colors.white} />
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: '#F8F9FE' },
  safe: { flex: 1, backgroundColor: '#F8F9FE' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  backBtn: { padding: 4 },
  headerMeta: { flex: 1 },
  circleName: {
    fontSize: 16,
    fontWeight: Typography.bold,
    color: Colors.navy,
  },
  memberCount: { fontSize: 12, color: Colors.muted },
  headerActionBtn: { padding: 4 },

  // States
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 40,
  },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.navy,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Message list
  messageList: { paddingVertical: 20, paddingHorizontal: 16 },

  // Message rows
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  rowOwn: { flexDirection: 'row-reverse' },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  senderAvatarText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  bubbleCol: { maxWidth: '72%', gap: 3 },
  senderName: { fontSize: 11, fontWeight: '700', color: Colors.muted, marginLeft: 4 },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleOwn: {
    backgroundColor: Colors.violet,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  bubbleText: { fontSize: 15, color: Colors.navy, lineHeight: 21 },
  bubbleTextOwn: { color: Colors.white },
  timeText: {
    fontSize: 10,
    color: Colors.mutedLight,
    marginLeft: 4,
  },
  timeTextOwn: { textAlign: 'right', marginRight: 4 },

  // Memory
  memoryStrip: { marginLeft: 40, marginRight: 16, marginBottom: 16 },
  memoryHeader: { marginBottom: 8 },
  memorySender: {
    fontSize: 11,
    fontWeight: Typography.bold,
    color: Colors.violet,
    marginBottom: 2,
  },
  memoryCaption: { fontSize: 14, color: Colors.navy },
  memoryThumbs: { flexDirection: 'row', gap: 8 },
  memoryThumb: {
    width: 80,
    height: 100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 24 },
  memoryTime: {
    fontSize: 10,
    color: Colors.mutedLight,
    alignSelf: 'flex-end',
    marginTop: 6,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.navy,
    maxHeight: 100,
  },
  emojiIcon: { marginLeft: 8 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.45 },
});
