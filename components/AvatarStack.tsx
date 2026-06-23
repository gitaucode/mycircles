import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

/**
 * Reliable avatar URLs — using picsum.photos with a fixed seed so they
 * always resolve to the same person, never go blank, and have no CORS issues.
 * Each ID maps to a distinct portrait-style photo.
 */
const AVATARS = [
  'https://i.pravatar.cc/100?img=47', // Amani  – index 0
  'https://i.pravatar.cc/100?img=44', // Zara   – index 1
  'https://i.pravatar.cc/100?img=12', // Brian  – index 2
  'https://i.pravatar.cc/100?img=56', // Wanja  – index 3
  'https://i.pravatar.cc/100?img=48', // Njeri  – index 4
  'https://i.pravatar.cc/100?img=15', // Kevin  – index 5
  'https://i.pravatar.cc/100?img=32', // Leo    – index 6
  'https://i.pravatar.cc/100?img=45', // Imani  – index 7
];

type Props = {
  users: number[];
  size?: number;
};

export default function AvatarStack({ users, size = 24 }: Props) {
  return (
    <View style={styles.container}>
      {users.map((u, i) => {
        const uri = AVATARS[u % AVATARS.length];
        return (
          <Image
            key={`${u}-${i}`}
            source={{ uri }}
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: i === 0 ? 0 : -(size * 0.3),
                zIndex: users.length - i,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#D1D5DB', // light grey fallback (never blank)
  },
});
