import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../constants/colors';
import { Typography } from '../../../constants/typography';
import { useCircles } from '../../../hooks/useCircles';
import { addCircleMember, AuthUser, createPlan, getCircleDetails, getCirclePlans, Plan, rsvpPlan, searchUsers, getPlanRsvps, PlanRsvp } from '../../../data/api';
import { CIRCLE_ICONS, USER_AVATARS } from '../../../constants/assets';
import { useToast } from '../../../providers/ToastProvider';
import { useAuth } from '../../../contexts/AuthContext';

const TABS = ['Plans', 'People'];

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { circles } = useCircles();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('Plans');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planTitle, setPlanTitle] = useState('');
  const [planDate, setPlanDate] = useState('');
  const [planTime, setPlanTime] = useState('');
  const [planLocation, setPlanLocation] = useState('');
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [rsvpingPlanId, setRsvpingPlanId] = useState<string | null>(null);
  const [memberQuery, setMemberQuery] = useState('');
  const [userResults, setUserResults] = useState<AuthUser[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [planRsvps, setPlanRsvps] = useState<Record<string, PlanRsvp[]>>({});
  const { user } = useAuth();

  const circle = circles.find((c) => c.id === id);

  const loadPlans = useCallback(() => {
    if (!id) return;
    setPlansLoading(true);
    getCirclePlans(id)
      .then(async (fetchedPlans) => {
        setPlans(fetchedPlans);
        const rsvpsDict: Record<string, PlanRsvp[]> = {};
        for (const p of fetchedPlans) {
          try {
            rsvpsDict[p.id] = await getPlanRsvps(p.id);
          } catch (e) {
            // Ignore error fetching individual plan rsvp
          }
        }
        setPlanRsvps(rsvpsDict);
      })
      .catch(() => setPlans([]))
      .finally(() => setPlansLoading(false));
  }, [id]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const loadMembers = useCallback(() => {
    if (!id) return;
    setMembersLoading(true);
    getCircleDetails(id)
      .then((details) => setMembers(details.members))
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));
  }, [id]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleCreatePlan = async () => {
    if (!id || creatingPlan) return;
    if (!planTitle.trim() || !planDate.trim()) {
      toast.show('Add a title and date for the plan.', 'error');
      return;
    }

    setCreatingPlan(true);
    try {
      await createPlan(id, {
        title: planTitle.trim(),
        date: planDate.trim(),
        time: planTime.trim(),
        location: planLocation.trim(),
        tag: circle?.name ?? '',
      });
      setPlanTitle('');
      setPlanDate('');
      setPlanTime('');
      setPlanLocation('');
      setShowPlanForm(false);
      await loadPlans();
    } catch (err: any) {
      toast.show(err?.message ?? 'Could not create plan. Try again.', 'error');
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleRsvp = async (planId: string, status: 'in' | 'out') => {
    if (rsvpingPlanId) return;
    setRsvpingPlanId(planId);
    try {
      await rsvpPlan(planId, status);
      await loadPlans();
    } catch (err: any) {
      toast.show(err?.message ?? 'Could not RSVP. Try again.', 'error');
    } finally {
      setRsvpingPlanId(null);
    }
  };

  const handleSearchUsers = async () => {
    const query = memberQuery.trim();
    if (query.length < 2) {
      toast.show('Type at least 2 characters.', 'error');
      return;
    }

    setUserSearchLoading(true);
    try {
      setUserResults(await searchUsers(query));
    } catch (err: any) {
      toast.show(err?.message ?? 'Could not search users.', 'error');
    } finally {
      setUserSearchLoading(false);
    }
  };

  const handleAddMember = async (user: AuthUser) => {
    if (!id || addingUserId) return;

    setAddingUserId(user.id);
    try {
      await addCircleMember(id, user.username);
      toast.show(`${user.name} is now in ${circle?.name ?? 'this circle'}.`, 'success');
      setMemberQuery('');
      setUserResults([]);
      loadMembers();
    } catch (err: any) {
      toast.show(err?.message ?? 'Could not add member', 'error');
    } finally {
      setAddingUserId(null);
    }
  };

  if (!circle) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Colors.navy} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <ActivityIndicator color={Colors.violet} />
        </View>
      </SafeAreaView>
    );
  }

  const inviteLink = circle.inviteToken
    ? `mycircles.app/invite/${circle.inviteToken}`
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.navy} />
        </Pressable>
        <View style={styles.headerMeta}>
          <View style={styles.headerTitleRow}>
            <Image 
              source={CIRCLE_ICONS[circle.emoji as keyof typeof CIRCLE_ICONS] || CIRCLE_ICONS['circle_house']}
              style={styles.headerCircleIcon}
            />
            <Text style={styles.circleName}>{circle.name}</Text>
          </View>
          <Text style={styles.memberCount}>{circle.memberCount} members</Text>
        </View>
        <View style={styles.headerActions}>
          {inviteLink && (
            <Pressable
              style={styles.actionBtn}
              onPress={() =>
                Share.share({
                  message: `Join my circle "${circle.name}" on My Circles!\n${inviteLink}`,
                })
              }
            >
              <Ionicons name="share-outline" size={22} color={Colors.violet} />
            </Pressable>
          )}
          <Pressable
            style={styles.actionBtn}
            onPress={() => router.push(`/circle/${id}/chat`)}
          >
            <Ionicons name="chatbubble-outline" size={22} color={Colors.navy} />
          </Pressable>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Plans tab ── */}
        {activeTab === 'Plans' && (
          <View style={styles.section}>
            <View style={styles.sectionTopRow}>
              <Text style={styles.sectionTitle}>Plans</Text>
              <Pressable
                style={styles.smallAddBtn}
                onPress={() => setShowPlanForm((current) => !current)}
              >
                <Ionicons name={showPlanForm ? 'close' : 'add'} size={16} color={Colors.white} />
                <Text style={styles.smallAddText}>{showPlanForm ? 'Cancel' : 'New plan'}</Text>
              </Pressable>
            </View>

            {showPlanForm && (
              <View style={styles.planForm}>
                <TextInput
                  value={planTitle}
                  onChangeText={setPlanTitle}
                  placeholder="Plan title"
                  placeholderTextColor={Colors.mutedLight}
                  style={styles.formInput}
                />
                <TextInput
                  value={planDate}
                  onChangeText={setPlanDate}
                  placeholder="Date, e.g. Sat, Jul 4"
                  placeholderTextColor={Colors.mutedLight}
                  style={styles.formInput}
                />
                <View style={styles.formSplitRow}>
                  <TextInput
                    value={planTime}
                    onChangeText={setPlanTime}
                    placeholder="Time"
                    placeholderTextColor={Colors.mutedLight}
                    style={[styles.formInput, styles.formHalfInput]}
                  />
                  <TextInput
                    value={planLocation}
                    onChangeText={setPlanLocation}
                    placeholder="Location"
                    placeholderTextColor={Colors.mutedLight}
                    style={[styles.formInput, styles.formHalfInput]}
                  />
                </View>
                <Pressable
                  style={styles.createPlanBtn}
                  onPress={handleCreatePlan}
                  disabled={creatingPlan}
                >
                  {creatingPlan ? (
                    <ActivityIndicator color={Colors.white} size="small" />
                  ) : (
                    <>
                      <Ionicons name="calendar-outline" size={16} color={Colors.white} />
                      <Text style={styles.createPlanText}>Create plan</Text>
                    </>
                  )}
                </Pressable>
              </View>
            )}

            {plansLoading ? (
              <ActivityIndicator color={Colors.violet} style={styles.loader} />
            ) : plans.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🗓️</Text>
                <Text style={styles.emptyTitle}>No plans yet</Text>
                <Text style={styles.emptyText}>
                  Create a plan for your circle to start coordinating!
                </Text>
                <Pressable
                  style={styles.addPlanBtn}
                  onPress={() => setShowPlanForm(true)}
                >
                  <Ionicons name="add" size={16} color={Colors.white} />
                  <Text style={styles.addPlanText}>Add a plan</Text>
                </Pressable>
              </View>
            ) : (
              plans.map((plan) => {
                const rsvps = planRsvps[plan.id] || [];
                const inRsvps = rsvps.filter((r) => r.status === 'in');
                const myRsvp = user ? rsvps.find(r => r.user_id === user.id)?.status : null;
                return (
                  <View key={plan.id} style={styles.planCard}>
                    <View style={styles.planIconBox}>
                      <Ionicons name="calendar" size={20} color={Colors.violet} />
                    </View>
                    <View style={styles.planInfo}>
                      <Text style={styles.planTitle}>{plan.title}</Text>
                      <Text style={styles.planMeta}>
                        {plan.date}{plan.time ? ` · ${plan.time}` : ''}
                        {plan.location ? `\n📍 ${plan.location}` : ''}
                      </Text>
                      
                      {inRsvps.length > 0 && (
                        <View style={styles.rsvpAvatarsRow}>
                          {inRsvps.slice(0, 5).map((r, i) => (
                            <View key={r.user_id} style={[styles.rsvpAvatarWrap, { marginLeft: i > 0 ? -10 : 0 }]}>
                              <Image 
                                source={USER_AVATARS[`avatar_${r.gradient_index + 1}` as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1']} 
                                style={styles.rsvpAvatar} 
                              />
                            </View>
                          ))}
                          {inRsvps.length > 5 && (
                            <View style={[styles.rsvpAvatarWrap, styles.rsvpAvatarMoreWrap, { marginLeft: -10 }]}>
                              <Text style={styles.rsvpAvatarMore}>+{inRsvps.length - 5}</Text>
                            </View>
                          )}
                        </View>
                      )}

                      <View style={styles.rsvpRow}>
                        <Pressable
                          style={[styles.rsvpInBtn, myRsvp === 'in' && styles.rsvpBtnActive]}
                          onPress={() => handleRsvp(plan.id, 'in')}
                          disabled={rsvpingPlanId === plan.id}
                        >
                          <Text style={[styles.rsvpInText, myRsvp === 'in' && styles.rsvpTextActive]}>I'm in</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.rsvpOutBtn, myRsvp === 'out' && styles.rsvpBtnActive]}
                          onPress={() => handleRsvp(plan.id, 'out')}
                          disabled={rsvpingPlanId === plan.id}
                        >
                          <Text style={[styles.rsvpOutText, myRsvp === 'out' && styles.rsvpTextActive]}>Can't make it</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ── People tab ── */}
        {activeTab === 'People' && (
          <View style={styles.section}>
            <View style={styles.searchCard}>
              <Text style={styles.searchTitle}>Members</Text>
              {membersLoading ? (
                <ActivityIndicator color={Colors.violet} />
              ) : members.length === 0 ? (
                <Text style={styles.inviteText}>No members loaded yet.</Text>
              ) : (
                <View style={styles.userResults}>
                  {members.map((member) => (
                    <View key={member.id} style={styles.userRow}>
                      <View style={styles.userAvatarWrapper}>
                        <Image 
                          source={USER_AVATARS[member.avatarId as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1']} 
                          style={styles.userAvatarImg} 
                        />
                      </View>
                      <View style={styles.userMeta}>
                        <Text style={styles.userName}>{member.name}</Text>
                        <Text style={styles.userUsername}>{member.username}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inviteCard}>
              <View style={styles.inviteContent}>
                <Ionicons name="person-add-outline" size={24} color={Colors.violet} />
                <Text style={styles.inviteTitle}>Invite people</Text>
                <Text style={styles.inviteText}>
                  {inviteLink
                    ? `Share your invite link:\n${inviteLink}`
                    : 'No invite link available yet.'}
                </Text>
                {inviteLink && (
                  <Pressable
                    style={styles.copyBtn}
                    onPress={() =>
                      Share.share({
                        message: `Join my circle "${circle.name}" on My Circles!\n${inviteLink}`,
                      })
                    }
                  >
                    <Ionicons name="share-outline" size={14} color={Colors.white} />
                    <Text style={styles.copyBtnText}>Share Invite</Text>
                  </Pressable>
                )}
              </View>
            </View>

            <View style={styles.searchCard}>
              <Text style={styles.searchTitle}>Add by username</Text>
              <View style={styles.searchRow}>
                <TextInput
                  value={memberQuery}
                  onChangeText={setMemberQuery}
                  placeholder="@username"
                  placeholderTextColor={Colors.mutedLight}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.searchInput}
                  returnKeyType="search"
                  onSubmitEditing={handleSearchUsers}
                />
                <Pressable
                  style={styles.searchBtn}
                  onPress={handleSearchUsers}
                  disabled={userSearchLoading}
                >
                  {userSearchLoading ? (
                    <ActivityIndicator color={Colors.white} size="small" />
                  ) : (
                    <Ionicons name="search" size={17} color={Colors.white} />
                  )}
                </Pressable>
              </View>

              {userResults.length > 0 && (
                <View style={styles.userResults}>
                  {userResults.map((user) => (
                    <View key={user.id} style={styles.userRow}>
                      <View style={styles.userAvatarWrapper}>
                        <Image 
                          source={USER_AVATARS[user.avatarId as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1']} 
                          style={styles.userAvatarImg} 
                        />
                      </View>
                      <View style={styles.userMeta}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userUsername}>{user.username}</Text>
                      </View>
                      <Pressable
                        style={styles.addMemberBtn}
                        onPress={() => handleAddMember(user)}
                        disabled={addingUserId === user.id}
                      >
                        {addingUserId === user.id ? (
                          <ActivityIndicator color={Colors.white} size="small" />
                        ) : (
                          <Text style={styles.addMemberText}>Add</Text>
                        )}
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FE' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

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
  backBtn: { padding: 4 },
  headerMeta: { flex: 1, gap: 2 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerCircleIcon: { width: 22, height: 22, resizeMode: 'contain' },
  circleName: { fontSize: 16, fontWeight: Typography.bold, color: Colors.navy },
  memberCount: { fontSize: 12, color: Colors.muted },
  headerActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { padding: 4 },

  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: { backgroundColor: Colors.violet },
  tabText: { fontSize: 13, color: Colors.muted, fontWeight: Typography.medium },
  tabTextActive: { color: Colors.white, fontWeight: Typography.bold },

  content: { padding: 20, paddingBottom: 100 },
  section: { gap: 12 },
  loader: { marginTop: 40 },
  sectionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: Colors.navy,
    fontSize: 18,
    fontWeight: '800',
  },
  smallAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.violet,
    borderRadius: 11,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  smallAddText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  planForm: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  formInput: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    color: Colors.navy,
    fontSize: 14,
    backgroundColor: '#FAF8FF',
  },
  formSplitRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formHalfInput: {
    flex: 1,
  },
  createPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: Colors.violet,
  },
  createPlanText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 40,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    padding: 24,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  emptyText: { fontSize: 13, color: Colors.muted, textAlign: 'center', lineHeight: 19 },
  addPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.violet,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 4,
  },
  addPlanText: { color: Colors.white, fontSize: 13, fontWeight: '700' },

  // Plan cards
  planCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  planIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EDE8FF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  planInfo: { flex: 1, gap: 3 },
  planTitle: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  planMeta: { fontSize: 12, color: Colors.muted, lineHeight: 17 },
  rsvpRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  rsvpInBtn: {
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rsvpInText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
  },
  rsvpOutBtn: {
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rsvpOutText: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },

  // Invite card
  inviteCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ECEAF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  inviteContent: {
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  inviteTitle: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  inviteText: {
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.violet,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 4,
  },
  copyBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  searchCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ECEAF5',
  },
  searchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.navy,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    color: Colors.navy,
    fontSize: 14,
    backgroundColor: '#FAF8FF',
  },
  searchBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: Colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userResults: {
    gap: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  userAvatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  userAvatarImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userMeta: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: Colors.navy,
    fontSize: 14,
    fontWeight: '700',
  },
  userUsername: {
    color: Colors.muted,
    fontSize: 12,
  },
  addMemberBtn: {
    minWidth: 58,
    minHeight: 34,
    borderRadius: 10,
    backgroundColor: Colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  addMemberText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  rsvpAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rsvpAvatarWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  rsvpAvatarMoreWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.navy,
  },
  rsvpAvatar: {
    width: '100%',
    height: '100%',
  },
  rsvpAvatarMore: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  rsvpBtnActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  rsvpTextActive: {
    color: Colors.white,
  },
});
