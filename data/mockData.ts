// ─── Types ────────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  username: string;
  initials: string;
  avatarGradientIndex: number;
  bio?: string;
};

export type Circle = {
  id: string;
  name: string;
  emoji: string;
  memberCount: number;
  memberIds: string[];
  vibe: string;
  type: 'Friends' | 'Family' | 'Campus' | 'Creators' | 'Work' | 'Custom';
  privacy: 'Invite only' | 'Approval required';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  gradientIndex: number;
};

export type Message = {
  id: string;
  circleId: string;
  senderId: string;
  type: 'text' | 'voice' | 'poll' | 'memory';
  text?: string;
  voiceDuration?: string;
  poll?: Poll;
  memoryCaption?: string;
  timestamp: string;
};

export type Poll = {
  question: string;
  options: PollOption[];
  totalVotes: number;
};

export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type Plan = {
  id: string;
  circleId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  tag: string;
  memberIds: string[];
};

export type Contribution = {
  id: string;
  circleId: string;
  title: string;
  current: number;
  goal: number;
  currency: string;
  paidCount: number;
  totalCount: number;
};

export type Memory = {
  id: string;
  circleId: string;
  caption: string;
  gradientIndex: number;
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const USERS: User[] = [
  { id: 'u1', name: 'Maya', username: '@maya', initials: 'M', avatarGradientIndex: 0, bio: 'Keeping my people close.' },
  { id: 'u2', name: 'Amani', username: '@amani', initials: 'A', avatarGradientIndex: 1 },
  { id: 'u3', name: 'Brian', username: '@brian', initials: 'B', avatarGradientIndex: 2 },
  { id: 'u4', name: 'Wanja', username: '@wanja', initials: 'W', avatarGradientIndex: 3 },
  { id: 'u5', name: 'Njeri', username: '@njeri', initials: 'N', avatarGradientIndex: 4 },
  { id: 'u6', name: 'Tasha', username: '@tasha', initials: 'T', avatarGradientIndex: 5 },
  { id: 'u7', name: 'Kevin', username: '@kevin', initials: 'K', avatarGradientIndex: 6 },
  { id: 'u8', name: 'Imani', username: '@imani', initials: 'I', avatarGradientIndex: 7 },
];

export const CURRENT_USER = USERS[0]; // Maya

// ─── Circles ──────────────────────────────────────────────────────────────────

export const CIRCLES: Circle[] = [
  {
    id: 'c1',
    name: 'Besties',
    emoji: '❤️',
    memberCount: 6,
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    vibe: 'chaotic 🤪',
    type: 'Friends',
    privacy: 'Invite only',
    lastMessage: 'Amani: Let\'s brunch this weekend?',
    lastMessageTime: '2m ago',
    unreadCount: 3,
    gradientIndex: 0,
  },
  {
    id: 'c2',
    name: 'Campus Crew',
    emoji: '🎓',
    memberCount: 12,
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
    vibe: 'always grinding 📚',
    type: 'Campus',
    privacy: 'Approval required',
    lastMessage: 'Brian: Notes for tomorrow\'s class',
    lastMessageTime: '15m ago',
    unreadCount: 5,
    gradientIndex: 1,
  },
  {
    id: 'c3',
    name: 'Family',
    emoji: '🏠',
    memberCount: 7,
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'],
    vibe: 'love & loyalty 💚',
    type: 'Family',
    privacy: 'Invite only',
    lastMessage: 'Mom: Don\'t forget Sunday lunch',
    lastMessageTime: '1h ago',
    unreadCount: 2,
    gradientIndex: 2,
  },
  {
    id: 'c4',
    name: 'Creators',
    emoji: '✨',
    memberCount: 8,
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
    vibe: 'build mode 🚀',
    type: 'Creators',
    privacy: 'Approval required',
    lastMessage: 'Tasha: New reel is out! Check it 🔥',
    lastMessageTime: '3h ago',
    unreadCount: 1,
    gradientIndex: 3,
  },
  {
    id: 'c5',
    name: 'Study Squad',
    emoji: '📚',
    memberCount: 8,
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
    vibe: 'locked in 😤',
    type: 'Campus',
    privacy: 'Approval required',
    lastMessage: 'Kevin: CAT results are out',
    lastMessageTime: '30m ago',
    unreadCount: 0,
    gradientIndex: 4,
  },
  {
    id: 'c6',
    name: 'Weekend Plans',
    emoji: '🌿',
    memberCount: 6,
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    vibe: 'outside 🌿',
    type: 'Friends',
    privacy: 'Invite only',
    lastMessage: 'Imani: Hike or beach?',
    lastMessageTime: '2h ago',
    unreadCount: 0,
    gradientIndex: 5,
  },
];

// ─── Messages ─────────────────────────────────────────────────────────────────

export const MESSAGES: Message[] = [
  {
    id: 'm1', circleId: 'c1', senderId: 'u2', type: 'text',
    text: 'Guys! Who\'s free this weekend?',
    timestamp: '10:15 AM',
  },
  {
    id: 'm2', circleId: 'c1', senderId: 'u1', type: 'text',
    text: 'I\'m free! Let\'s do brunch 😍',
    timestamp: '10:20 AM',
  },
  {
    id: 'm3', circleId: 'c1', senderId: 'u4', type: 'text',
    text: 'Yesss! Somewhere new?',
    timestamp: '10:22 AM',
  },
  {
    id: 'm4', circleId: 'c1', senderId: 'u5', type: 'voice',
    voiceDuration: '0:18',
    timestamp: '10:25 AM',
  },
  {
    id: 'm5', circleId: 'c1', senderId: 'u3', type: 'poll',
    timestamp: '10:34 AM',
    poll: {
      question: 'Where should we go?',
      totalVotes: 6,
      options: [
        { id: 'o1', label: 'Brunch at Baraza', votes: 4 },
        { id: 'o2', label: 'Picnic at Karura', votes: 2 },
      ],
    },
  },
  {
    id: 'm6', circleId: 'c1', senderId: 'u2', type: 'memory',
    memoryCaption: 'Memories from last time 😭🔥',
    timestamp: '10:35 AM',
  },
];

// ─── Plans ────────────────────────────────────────────────────────────────────

export const PLANS: Plan[] = [
  {
    id: 'p1',
    circleId: 'c1',
    title: 'Beach Hangout 🌊',
    date: 'Saturday, 28 Jun',
    time: '3:00 PM',
    location: 'Diani Beach',
    tag: 'Just for us',
    memberIds: ['u1', 'u2', 'u3', 'u4'],
  },
  {
    id: 'p2',
    circleId: 'c3',
    title: "Wanja's Birthday 🎂",
    date: 'Sunday, 29 Jun',
    time: '6:00 PM',
    location: 'Rooftop, Westlands',
    tag: 'Family',
    memberIds: ['u1', 'u2', 'u4', 'u5', 'u7'],
  },
  {
    id: 'p3',
    circleId: 'c2',
    title: 'Movie Night 🎬',
    date: 'Friday, 4 Jul',
    time: '8:00 PM',
    location: 'Brian\'s Place',
    tag: 'Campus Crew',
    memberIds: ['u1', 'u3', 'u5'],
  },
];

// ─── Contributions ────────────────────────────────────────────────────────────

export const CONTRIBUTIONS: Contribution[] = [
  {
    id: 'con1',
    circleId: 'c1',
    title: 'Beach Trip Fund',
    current: 7200,
    goal: 10000,
    currency: 'KES',
    paidCount: 4,
    totalCount: 6,
  },
];

// ─── Memories ─────────────────────────────────────────────────────────────────

export const MEMORIES: Memory[] = [
  { id: 'mem1', circleId: 'c1', caption: 'Beach vibes ☀️', gradientIndex: 0 },
  { id: 'mem2', circleId: 'c1', caption: 'Laughs all day', gradientIndex: 2 },
  { id: 'mem3', circleId: 'c1', caption: 'Golden hour 🌅', gradientIndex: 3 },
  { id: 'mem4', circleId: 'c1', caption: 'Our fave spot', gradientIndex: 5 },
];
