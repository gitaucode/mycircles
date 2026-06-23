import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { USERS, Message } from '../data/mockData';

type Props = {
  message: Message;
};

export default function VoiceNoteBubble({ message }: Props) {
  const sender = USERS.find((u) => u.id === message.senderId);
  const gradColors = Colors.avatarGradients[
    (parseInt(message.senderId.replace('u', '')) - 1) % Colors.avatarGradients.length
  ] as [string, string];

  // Animate waveform bars
  const bars = Array.from({ length: 18 }, (_, i) => useRef(new Animated.Value(0.4)).current);

  useEffect(() => {
    const animations = bars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: Math.random() * 0.6 + 0.4,
            duration: 300 + i * 40,
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: 0.2 + Math.random() * 0.3,
            duration: 300 + i * 30,
            useNativeDriver: false,
          }),
        ])
      )
    );
    const anim = Animated.stagger(60, animations);
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={styles.row}>
      <LinearGradient colors={gradColors} style={styles.avatar}>
        <Text style={styles.avatarText}>{sender?.initials}</Text>
      </LinearGradient>
      <View style={styles.wrap}>
        <Text style={styles.senderName}>{sender?.name}</Text>
        <View style={styles.bubble}>
          <Pressable style={styles.playBtn}>
            <LinearGradient colors={[Colors.violet, Colors.blue]} style={styles.playGrad}>
              <Ionicons name="play" size={14} color={Colors.white} />
            </LinearGradient>
          </Pressable>
          <View style={styles.waveform}>
            {bars.map((bar, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.bar,
                  {
                    height: bar.interpolate({
                      inputRange: [0, 1],
                      outputRange: [4, 28],
                    }),
                    backgroundColor: i % 3 === 0 ? Colors.violet : Colors.blue,
                    opacity: 0.7,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.duration}>{message.voiceDuration}</Text>
        </View>
        <Text style={styles.time}>{message.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
  wrap: {
    gap: 3,
  },
  senderName: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
    color: Colors.violet,
    marginLeft: 2,
  },
  bubble: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
    elevation: 1,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  playBtn: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  playGrad: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 30,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  duration: {
    fontSize: Typography.xs,
    color: Colors.muted,
    minWidth: 28,
  },
  time: {
    fontSize: 11,
    color: Colors.mutedLight,
    marginLeft: 4,
  },
});
