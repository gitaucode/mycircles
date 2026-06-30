import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { searchUsers, addCircleMember, AuthUser } from '../../data/api';
import { USER_AVATARS } from '../../constants/assets';
import { useToast } from '../../providers/ToastProvider';

export default function AddMemberModal() {
  const { circleId } = useLocalSearchParams<{ circleId: string }>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AuthUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const toast = useToast();

  async function handleSearch(text: string) {
    setQuery(text);
    if (text.trim().length < 2) { setResults([]); return; }
    setIsSearching(true);
    try {
      const users = await searchUsers(text.trim());
      setResults(users);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  async function handleAdd(user: AuthUser) {
    if (!circleId || adding) return;
    setAdding(user.id);
    try {
      await addCircleMember(circleId, user.username);
      setAdded((prev) => new Set([...prev, user.id]));
    } catch (err: any) {
      toast.show(err?.message ?? 'Could not add member', 'error');
    } finally {
      setAdding(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color="#374151" />
          </Pressable>
          <Text style={styles.title}>Add people</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Search box */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.muted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
            placeholder="Search by @username or name…"
            placeholderTextColor={Colors.mutedLight}
            autoFocus
            autoCapitalize="none"
          />
          {isSearching && <ActivityIndicator size="small" color={Colors.violet} />}
        </View>

        {/* Results */}
        <FlatList
          data={results}
          keyExtractor={(u) => u.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            query.length >= 2 && !isSearching ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No users found for "{query}"</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isAdded = added.has(item.id);
            const isAddingThis = adding === item.id;
            return (
              <View style={styles.userRow}>
                <View style={styles.avatarWrapper}>
                  <Image 
                    source={USER_AVATARS[item.avatarId as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1']} 
                    style={styles.avatarImg} 
                  />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userHandle}>{item.username}</Text>
                </View>
                <Pressable
                  onPress={() => handleAdd(item)}
                  disabled={isAdded || isAddingThis}
                  style={[styles.addBtn, isAdded && styles.addBtnDone]}
                >
                  {isAddingThis ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Ionicons
                      name={isAdded ? 'checkmark' : 'person-add-outline'}
                      size={16}
                      color={Colors.white}
                    />
                  )}
                </Pressable>
              </View>
            );
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.navy },
  list: { paddingHorizontal: 16, gap: 10 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { color: Colors.muted, fontSize: 14 },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  userHandle: { fontSize: 12, color: Colors.muted, marginTop: 1 },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#111827',
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnDone: { backgroundColor: Colors.success },
});

