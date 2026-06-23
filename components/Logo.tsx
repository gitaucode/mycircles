import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

type LogoProps = {
  size?: number;
  showText?: boolean;
};

export default function Logo({ size = 48, showText = false }: LogoProps) {
  const nodeSize = size * 0.38;
  const centerSize = size * 0.5;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Top-left node */}
      <View
        style={[
          styles.node,
          styles.nodeTopLeft,
          {
            width: nodeSize,
            height: nodeSize,
            borderRadius: nodeSize / 2,
            backgroundColor: Colors.violet,
            top: 0,
            left: 0,
          },
        ]}
      />
      {/* Top-right node */}
      <View
        style={[
          styles.node,
          {
            width: nodeSize * 0.82,
            height: nodeSize * 0.82,
            borderRadius: nodeSize / 2,
            backgroundColor: Colors.blue,
            top: 0,
            right: 0,
          },
        ]}
      />
      {/* Center circle (main) */}
      <View
        style={[
          styles.centerNode,
          {
            width: centerSize,
            height: centerSize,
            borderRadius: centerSize / 2,
            backgroundColor: Colors.violet,
            top: size * 0.22,
            left: size * 0.25,
          },
        ]}
      >
        <View
          style={[
            styles.innerRing,
            {
              width: centerSize * 0.6,
              height: centerSize * 0.6,
              borderRadius: centerSize / 2,
              borderWidth: size * 0.05,
              borderColor: Colors.white,
            },
          ]}
        />
      </View>
      {/* Chat tail */}
      <View
        style={[
          styles.tail,
          {
            width: size * 0.15,
            height: size * 0.15,
            bottom: 0,
            left: size * 0.25,
            backgroundColor: Colors.violet,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  node: {
    position: 'absolute',
    elevation: 2,
    shadowColor: Colors.violet,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  nodeTopLeft: {},
  centerNode: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: Colors.violet,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  innerRing: {
    borderStyle: 'solid',
  },
  tail: {
    position: 'absolute',
    borderTopRightRadius: 6,
    transform: [{ rotate: '-30deg' }],
  },
});
