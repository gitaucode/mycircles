import { Circle } from './mockData';
import { getAuthToken } from './authStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new ApiError('EXPO_PUBLIC_API_URL is not configured', 0);
  }

  const token = await getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(errorBody?.message ?? `HTTP ${response.status}`, response.status);
  }

  return response.json();
}

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email?: string | null;
  initials: string;
  gradientIndex: number;
  bio?: string | null;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export function registerUser(input: {
  name: string;
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function loginUser(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getMe(): Promise<AuthUser> {
  return request<AuthUser>('/users/me');
}

export function getCircles(): Promise<Circle[]> {
  return request<Circle[]>('/circles');
}

export function deleteCircle(circleId: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/circles/${circleId}`, { method: 'DELETE' });
}

export type CircleDetails = Circle & {
  members: AuthUser[];
};

export function getCircleDetails(circleId: string): Promise<CircleDetails> {
  return request<CircleDetails>(`/circles/${circleId}`);
}

export function createCircle(input: {
  name: string;
  emoji?: string;
  vibe?: string;
  type?: Circle['type'];
  privacy?: Circle['privacy'];
  memberIds?: string[];
}): Promise<{ id: string; inviteToken: string }> {
  return request<{ id: string; inviteToken: string }>('/circles', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}



export function updateMe(input: {
  name?: string;
  bio?: string;
}): Promise<AuthUser> {
  return request<AuthUser>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function searchUsers(q: string): Promise<AuthUser[]> {
  return request<AuthUser[]>(`/users/search?q=${encodeURIComponent(q)}`);
}

export function addCircleMember(
  circleId: string,
  username: string,
): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(`/circles/${circleId}/members`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export function joinByInvite(
  token: string,
): Promise<{ circleId: string }> {
  return request<{ circleId: string }>(`/invite/${token}`, { method: 'POST' });
}

export type Plan = {
  id: string;
  circleId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  tag: string;
  memberIds: string[];
  createdAt: string;
};

export function getCirclePlans(circleId: string): Promise<Plan[]> {
  return request<Plan[]>(`/circles/${circleId}/plans`);
}

export function createPlan(
  circleId: string,
  input: { title: string; date: string; time?: string; location?: string; tag?: string },
): Promise<{ id: string }> {
  return request<{ id: string }>(`/circles/${circleId}/plans`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function rsvpPlan(
  planId: string,
  status: 'in' | 'out' | 'maybe',
): Promise<{ ok: boolean; status: string }> {
  return request<{ ok: boolean; status: string }>(`/plans/${planId}/rsvp`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}
