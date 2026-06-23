import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  dark?: boolean;
};

export default function ScreenContainer({ children, style, dark = false }: Props) {
  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: dark ? Colors.navy : Colors.background },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
