import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Circle } from '../data/mockData';
import { deleteCircle } from '../data/api';
import { useCircles } from '../hooks/useCircles';
import { router } from 'expo-router';

interface Props {
  circle: Circle | null;
  onClose: () => void;
}

export default function CircleActionSheet({ circle, onClose }: Props) {
  const { refresh } = useCircles();
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = useCallback(() => {
    if (!circle) return;
    Alert.alert(
      'Delete circle?',
      `This will delete "${circle.name}" and remove it for all members. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteCircle(circle.id);
              await refresh();
              onClose();
            } catch (err: any) {
              Alert.alert('Could not delete circle', err?.message ?? 'Try again.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  }, [circle, refresh, onClose]);

  return (
    <Modal
      visible={Boolean(circle)}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet */}
      <View style={styles.sheet}>
        {/* Handle bar */}
        <View style={styles.handle} />

        {circle && (
          <>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {circle.emoji} {circle.name}
            </Text>
            <View style={styles.divider} />

            {/* Open Chat */}
            <Pressable
              style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
              onPress={() => {
                onClose();
                router.push(`/circle/${circle.id}/chat`);
              }}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#EDE8FF' }]}>
                <Ionicons name="chatbubble-outline" size={20} color={Colors.violet} />
              </View>
              <Text style={styles.actionText}>Open chat</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.mutedLight} />
            </Pressable>

            {/* View Details */}
            <Pressable
              style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
              onPress={() => {
                onClose();
                router.push(`/circle/${circle.id}/detail`);
              }}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionText}>Circle details</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.mutedLight} />
            </Pressable>

            <View style={styles.divider} />

            {/* Delete */}
            <Pressable
              style={({ pressed }) => [styles.actionRow, pressed && styles.actionRowPressed]}
              onPress={handleDelete}
              disabled={deleting}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: '#FEF2F2' }]}>
                {deleting ? (
                  <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                )}
              </View>
              <Text style={styles.actionTextDestructive}>Delete circle</Text>
            </Pressable>
          </>
        )}

        {/* Cancel button */}
        <Pressable
          style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.75 }]}
          onPress={onClose}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.mutedLight,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: 14,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 14,
  },
  actionRowPressed: { backgroundColor: '#F9F8FF' },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.navy,
  },
  actionTextDestructive: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.navy,
  },
});
