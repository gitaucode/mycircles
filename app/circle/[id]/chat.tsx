import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from '../../../components/ChatBubble';
import VoiceNoteBubble from '../../../components/VoiceNoteBubble';
import PollCard from '../../../components/PollCard';
import AvatarStack from '../../../components/AvatarStack';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { CIRCLES, MESSAGES, CURRENT_USER, Message } from '../../../data/mockData';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const circle = CIRCLES.find((c) => c.id === id) ?? CIRCLES[0];
  const [messages, setMessages] = useState<Message[]>(
    MESSAGES.filter((m) => m.circleId === circle.id)
  );
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      circleId: circle.id,
      senderId: CURRENT_USER.id,
      type: 'text',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwn = item.senderId === CURRENT_USER.id;
    if (item.type === 'voice') return <VoiceNoteBubble message={item} />;
    if (item.type === 'poll' && item.poll) {
      return <PollCard poll={item.poll} senderId={item.senderId} timestamp={item.timestamp} />;
    }
    if (item.type === 'memory') {
      return (
        <View style={styles.memoryStrip}>
          <View style={styles.memoryHeader}>
            <Text style={styles.memorySender}>Amani</Text>
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
          <Text style={styles.memoryTime}>{item.timestamp}</Text>
        </View>
      );
    }
    return <ChatBubble message={item} isOwn={isOwn} />;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.navy} />
        </Pressable>
        <AvatarStack users={[0, 1, 2, 3]} size={32} />
        <Pressable
          style={styles.headerMeta}
          onPress={() => router.push(`/circle/${circle.id}/detail`)}
        >
          <Text style={styles.circleName}>{circle.name} 💜</Text>
          <Text style={styles.memberCount}>{circle.memberCount} members</Text>
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerActionBtn}>
            <Ionicons name="call-outline" size={22} color={Colors.navy} />
          </Pressable>
          <Pressable
            style={styles.headerActionBtn}
            onPress={() => router.push(`/circle/${circle.id}/detail`)}
          >
            <Ionicons name="information-circle-outline" size={24} color={Colors.navy} />
          </Pressable>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <SafeAreaView edges={['bottom']} style={styles.inputContainer}>
          <Pressable style={styles.inputAddBtn}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </Pressable>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Message ${circle.name} 💜`}
              placeholderTextColor={Colors.muted}
              multiline
            />
            <Ionicons name="happy-outline" size={22} color={Colors.muted} style={styles.emojiIcon} />
          </View>
          <Pressable onPress={sendMessage} style={styles.micBtn}>
            <Ionicons name={inputText.trim() ? 'send' : 'mic'} size={20} color={Colors.white} />
          </Pressable>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FE' },
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
  backBtn: {
    padding: 4,
  },
  headerMeta: { flex: 1 },
  circleName: {
    fontSize: 16,
    fontWeight: Typography.bold,
    color: Colors.navy,
  },
  memberCount: {
    fontSize: 12,
    color: Colors.muted,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerActionBtn: {
    padding: 4,
  },
  messageList: {
    paddingVertical: 20,
  },
  memoryStrip: {
    marginLeft: 52,
    marginRight: 16,
    marginBottom: 16,
  },
  memoryHeader: {
    marginBottom: 8,
  },
  memorySender: {
    fontSize: 11,
    fontWeight: Typography.bold,
    color: Colors.violet,
    marginBottom: 2,
  },
  memoryCaption: {
    fontSize: 14,
    color: Colors.navy,
  },
  memoryThumbs: {
    flexDirection: 'row',
    gap: 8,
  },
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    gap: 12,
  },
  inputAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
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
  emojiIcon: {
    marginLeft: 8,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
