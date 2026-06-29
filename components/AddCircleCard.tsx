import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onPress?: () => void;
};

export default function AddCircleCard({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
      ]}
    >
      <View style={styles.card}>
        <Ionicons name="add" size={28} color="#C0AFF8" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
    borderRadius: 24,
  },
  card: {
    height: 200,
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D4C8FF',
    backgroundColor: 'rgba(118, 85, 240, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
