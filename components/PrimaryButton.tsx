import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  outline?: boolean;
  ghost?: boolean;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
};

export default function PrimaryButton({
  label,
  onPress,
  style,
  outline = false,
  ghost = false,
  loading = false,
  disabled = false,
  small = false,
}: Props) {
  if (ghost) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.ghostBtn,
          small && styles.small,
          pressed && styles.pressed,
          style,
        ]}
      >
        <Text style={[styles.ghostLabel, small && styles.smallLabel]}>{label}</Text>
      </Pressable>
    );
  }

  if (outline) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={({ pressed }) => [
          styles.outlineBtn,
          small && styles.small,
          pressed && styles.pressed,
          style,
        ]}
      >
        <Text style={[styles.outlineLabel, small && styles.smallLabel]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.wrapper,
        small && styles.small,
        pressed && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={[Colors.violet, Colors.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, small && styles.small]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={[styles.label, small && styles.smallLabel]}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  label: {
    color: Colors.white,
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    letterSpacing: 0.3,
  },
  ghostBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ghostLabel: {
    color: Colors.white,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  outlineBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.violet,
  },
  outlineLabel: {
    color: Colors.violet,
    fontSize: Typography.md,
    fontWeight: Typography.semibold,
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  smallLabel: {
    fontSize: Typography.sm,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
