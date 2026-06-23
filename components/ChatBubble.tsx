import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Message, USERS } from '../data/mockData';

type Props = {
  message: Message;
  isOwn: boolean;
};

export default function ChatBubble({ message, isOwn }: Props) {
  const sender = USERS.find((u) => u.id === message.senderId);
  const gradColors = Colors.avatarGradients[
    (parseInt(message.senderId.replace('u', '')) - 1) % Colors.avatarGradients.length
  ] as [string, string];

  return (
    <View style={[styles.row, isOwn && styles.rowOwn]}>
      {!isOwn && (
        <LinearGradient colors={gradColors} style={styles.avatar}>
          <Text style={styles.avatarText}>{sender?.initials}</Text>
        </LinearGradient>
      )}
      <View style={[styles.bubbleWrap, isOwn && styles.bubbleWrapOwn]}>
        {!isOwn && (
          <Text style={[styles.senderName, { color: gradColors[0] }]}>{sender?.name}</Text>
        )}
        {isOwn ? (
          <LinearGradient
            colors={[Colors.violet, Colors.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.bubble, styles.bubbleOwn]}
          >
            <Text style={[styles.text, styles.textOwn]}>{message.text}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.bubble}>
            <Text style={styles.text}>{message.text}</Text>
          </View>
        )}
        <Text style={[styles.time, isOwn && styles.timeOwn]}>{message.timestamp}{isOwn && ' ✓✓'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 16,
    gap: 8,
  },
  rowOwn: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: Typography.bold,
  },
  bubbleWrap: {
    maxWidth: '75%',
    gap: 4,
  },
  bubbleWrapOwn: {
    alignItems: 'flex-end',
  },
  senderName: {
    fontSize: 11,
    fontWeight: Typography.bold,
    marginLeft: 4,
  },
  bubble: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleOwn: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 15,
    color: Colors.navy,
  },
  textOwn: {
    color: Colors.white,
  },
  time: {
    fontSize: 10,
    color: Colors.mutedLight,
    alignSelf: 'flex-end',
    marginTop: 2,
    marginRight: 4,
  },
  timeOwn: {
    marginRight: 0,
  },
});
