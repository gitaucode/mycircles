// ─── Environment ─────────────────────────────────────────────────────────────

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  JWT_SECRET: string; // wrangler secret: JWT_SECRET
}

// ─── Types ───────────────────────────────────────────────────────────────────

type CircleRow = {
  id: string;
  name: string;
  emoji: string;
  member_count: number;
  member_ids: string;
  vibe: string;
  type: 'Friends' | 'Family' | 'Campus' | 'Creators' | 'Work' | 'Custom';
  privacy: 'Invite only' | 'Approval required';
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number | null;
  gradient_index: number;
  upcoming_event: string | null;
  memory_highlight: string | null;
  invite_token: string | null;
};

type UserRow = {
  id: string;
  name: string;
  username: string;
  email: string | null;
  initials: string;
  avatar_gradient_index: number;
  bio: string | null;
  password_hash: string | null;
};

type MessageRow = {
  id: string;
  circle_id: string;
  sender_id: string;
  sender_name: string;
  sender_initials: string;
  sender_gradient: number;
  type: string;
  text: string | null;
  voice_duration: string | null;
  memory_caption: string | null;
  media_id: string | null;
  created_at: string;
};

type PlanRow = {
  id: string;
  circle_id: string;
  title: string;
  date_label: string;
  time_label: string;
  location: string;
  tag: string;
  member_ids: string;
  created_at: string;
};

// ─── JWT (HS256, no external deps) ───────────────────────────────────────────

async function getSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded.padEnd(padded.length + (4 - padded.length % 4) % 4, '='));
  return Uint8Array.from(binary, c => c.charCodeAt(0));
}

async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body   = b64url(new TextEncoder().encode(JSON.stringify({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
  })));
  const key = await getSigningKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${header}.${body}`));
  return `${header}.${body}.${b64url(sig)}`;
}

async function verifyJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const [header, body, sig] = token.split('.');
    if (!header || !body || !sig) return null;
    const key = await getSigningKey(secret);
    const valid = await crypto.subtle.verify(
      'HMAC', key,
      b64urlDecode(sig),
      new TextEncoder().encode(`${header}.${body}`),
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(body)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// ─── Password hashing (PBKDF2) ────────────────────────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, keyMaterial, 256,
  );
  return `${b64url(salt.buffer)}:${b64url(bits)}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(':');
  if (!saltB64 || !hashB64) return false;
  const salt = b64urlDecode(saltB64);
  const keyMaterial = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, keyMaterial, 256,
  );
  return b64url(bits) === hashB64;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
};

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders };

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { ...jsonHeaders, ...(init.headers as Record<string, string> | undefined) },
  });
}

function notFound()    { return json({ message: 'Not found' },    { status: 404 }); }
function badRequest(m: string) { return json({ message: m },      { status: 400 }); }
function unauthorized()        { return json({ message: 'Unauthorized' }, { status: 401 }); }

async function authenticate(request: Request, env: Env): Promise<string | null> {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const payload = await verifyJwt(token, env.JWT_SECRET);
  return (payload?.sub as string) ?? null;
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapCircle(row: CircleRow) {
  return {
    id:              row.id,
    name:            row.name,
    emoji:           row.emoji,
    memberCount:     row.member_count,
    memberIds:       JSON.parse(row.member_ids || '[]'),
    vibe:            row.vibe,
    type:            row.type,
    privacy:         row.privacy,
    lastMessage:     row.last_message      ?? undefined,
    lastMessageTime: row.last_message_time ?? undefined,
    unreadCount:     row.unread_count      ?? 0,
    gradientIndex:   row.gradient_index,
    upcomingEvent:   row.upcoming_event    ?? undefined,
    memoryHighlight: row.memory_highlight  ?? undefined,
    inviteToken:     row.invite_token      ?? undefined,
  };
}

function mapMessage(row: MessageRow) {
  return {
    id:            row.id,
    circleId:      row.circle_id,
    senderId:      row.sender_id,
    senderName:    row.sender_name,
    senderInitials:row.sender_initials,
    senderGradient:row.sender_gradient,
    type:          row.type,
    text:          row.text          ?? undefined,
    voiceDuration: row.voice_duration ?? undefined,
    memoryCaption: row.memory_caption ?? undefined,
    mediaId:       row.media_id      ?? undefined,
    timestamp:     row.created_at,
  };
}

function mapPlan(row: PlanRow) {
  return {
    id:        row.id,
    circleId:  row.circle_id,
    title:     row.title,
    date:      row.date_label,
    time:      row.time_label,
    location:  row.location,
    tag:       row.tag,
    memberIds: JSON.parse(row.member_ids || '[]'),
    createdAt: row.created_at,
  };
}

// ─── Auth handlers ────────────────────────────────────────────────────────────

async function register(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as {
    name?: string; username?: string; email?: string; password?: string; bio?: string;
  };

  if (!body.name?.trim())     return badRequest('Name is required');
  if (!body.username?.trim()) return badRequest('Username is required');
  if (!body.email?.trim() || !body.email.includes('@')) return badRequest('Valid email is required');
  if (!body.password || body.password.length < 6)
    return badRequest('Password must be at least 6 characters');

  const username = body.username.trim().toLowerCase().replace(/^@/, '');
  const email = body.email.trim().toLowerCase();

  const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ? OR email = ?')
    .bind(`@${username}`, email).first<{ id: string }>();
  if (existing) return json({ message: 'Username already taken' }, { status: 409 });

  const id = crypto.randomUUID();
  const initials = body.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const passwordHash = await hashPassword(body.password);
  const gradientIndex = Math.floor(Math.random() * 8);

  await env.DB.prepare(
    `INSERT INTO users (id, name, username, email, initials, avatar_gradient_index, bio, password_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.name.trim(), `@${username}`, email, initials, gradientIndex, body.bio ?? null, passwordHash).run();

  const token = await signJwt({ sub: id }, env.JWT_SECRET);
  return json({
    token,
    user: { id, name: body.name.trim(), username: `@${username}`, email, initials, gradientIndex, bio: body.bio ?? null },
  }, { status: 201 });
}

async function login(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { email?: string; username?: string; password?: string };

  const identifier = (body.email ?? body.username)?.trim().toLowerCase();
  if (!identifier || !body.password) return badRequest('Email and password required');

  const user = await env.DB.prepare(
    'SELECT id, name, username, email, initials, avatar_gradient_index, bio, password_hash FROM users WHERE email = ? OR username = ?'
  ).bind(identifier, `@${identifier.replace(/^@/, '')}`).first<UserRow>();

  if (!user || !user.password_hash) return unauthorized();
  const ok = await verifyPassword(body.password, user.password_hash);
  if (!ok) return unauthorized();

  const token = await signJwt({ sub: user.id }, env.JWT_SECRET);
  return json({
    token,
    user: {
      id: user.id, name: user.name, username: user.username, email: user.email,
      initials: user.initials, gradientIndex: user.avatar_gradient_index, bio: user.bio,
    },
  });
}

// ─── User handlers ────────────────────────────────────────────────────────────

async function getMe(userId: string, env: Env): Promise<Response> {
  const user = await env.DB.prepare(
    'SELECT id, name, username, email, initials, avatar_gradient_index, bio FROM users WHERE id = ?'
  ).bind(userId).first<UserRow>();
  if (!user) return notFound();
  return json({ id: user.id, name: user.name, username: user.username, email: user.email,
    initials: user.initials, gradientIndex: user.avatar_gradient_index, bio: user.bio });
}

async function updateMe(request: Request, userId: string, env: Env): Promise<Response> {
  const body = await request.json() as { name?: string; bio?: string };
  const updates: string[] = [];
  const values: unknown[] = [];

  if (body.name?.trim()) { updates.push('name = ?');  values.push(body.name.trim()); }
  if (body.bio !== undefined) { updates.push('bio = ?'); values.push(body.bio || null); }

  if (updates.length === 0) return badRequest('Nothing to update');

  values.push(userId);
  await env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  return getMe(userId, env);
}

async function searchUsers(url: URL, env: Env): Promise<Response> {
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase().replace(/^@/, '');
  if (q.length < 2) return json([]);
  const { results } = await env.DB.prepare(
    `SELECT id, name, username, initials, avatar_gradient_index FROM users
     WHERE lower(username) LIKE ? LIMIT 20`
  ).bind(`%${q}%`).all<UserRow>();
  return json(results.map(u => ({
    id: u.id, name: u.name, username: u.username,
    initials: u.initials, gradientIndex: u.avatar_gradient_index,
  })));
}

async function updatePushToken(request: Request, userId: string, env: Env): Promise<Response> {
  const body = await request.json() as { pushToken?: string };
  const pushToken = body.pushToken?.trim() || null;
  
  await env.DB.prepare('UPDATE users SET push_token = ? WHERE id = ?').bind(pushToken, userId).run();
  return json({ success: true });
}

// ─── Circle handlers ──────────────────────────────────────────────────────────

async function listCircles(userId: string, env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT
      c.id, c.name, c.emoji,
      COUNT(cm.user_id) AS member_count,
      json_group_array(cm.user_id) AS member_ids,
      c.vibe, c.type, c.privacy,
      (
        SELECT u.name || ': ' || COALESCE(m.text, m.type)
        FROM messages m JOIN users u ON u.id = m.sender_id
        WHERE m.circle_id = c.id ORDER BY m.created_at DESC LIMIT 1
      ) AS last_message,
      (
        SELECT strftime('%H:%M', m.created_at)
        FROM messages m WHERE m.circle_id = c.id ORDER BY m.created_at DESC LIMIT 1
      ) AS last_message_time,
      0 AS unread_count,
      c.gradient_index, c.upcoming_event, c.memory_highlight, c.invite_token
    FROM circles c
    JOIN circle_members my_mem ON my_mem.circle_id = c.id AND my_mem.user_id = ?
    LEFT JOIN circle_members cm ON cm.circle_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at ASC`
  ).bind(userId).all<CircleRow>();
  return json(results.map(mapCircle));
}

async function getCircle(circleId: string, userId: string, env: Env): Promise<Response> {
  const isMember = await env.DB.prepare(
    'SELECT 1 FROM circle_members WHERE circle_id = ? AND user_id = ?'
  ).bind(circleId, userId).first();
  if (!isMember) return notFound();

  const { results } = await env.DB.prepare(
    `SELECT c.id, c.name, c.emoji,
      COUNT(cm.user_id) AS member_count,
      json_group_array(cm.user_id) AS member_ids,
      c.vibe, c.type, c.privacy,
      NULL AS last_message, NULL AS last_message_time, 0 AS unread_count,
      c.gradient_index, c.upcoming_event, c.memory_highlight, c.invite_token
    FROM circles c
    LEFT JOIN circle_members cm ON cm.circle_id = c.id
    WHERE c.id = ? GROUP BY c.id`
  ).bind(circleId).all<CircleRow>();

  if (results.length === 0) return notFound();

  const members = await env.DB.prepare(
    `SELECT u.id, u.name, u.username, u.email, u.initials, u.avatar_gradient_index, u.bio, NULL AS password_hash
     FROM circle_members cm
     JOIN users u ON u.id = cm.user_id
     WHERE cm.circle_id = ?
     ORDER BY cm.joined_at ASC`
  ).bind(circleId).all<UserRow>();

  return json({
    ...mapCircle(results[0]),
    members: members.results.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      initials: user.initials,
      gradientIndex: user.avatar_gradient_index,
      bio: user.bio,
    })),
  });
}

async function createCircle(request: Request, userId: string, env: Env): Promise<Response> {
  const body = await request.json() as {
    name?: string; emoji?: string; vibe?: string;
    type?: CircleRow['type']; privacy?: CircleRow['privacy']; memberIds?: string[];
  };
  if (!body.name?.trim()) return badRequest('Circle name is required');

  const id = crypto.randomUUID();
  const inviteToken = b64url(crypto.getRandomValues(new Uint8Array(8)).buffer);
  const memberIds = Array.from(new Set([userId, ...(body.memberIds ?? [])]));

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO circles (id, name, emoji, vibe, type, privacy, gradient_index, created_by_user_id, invite_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, body.name.trim(), body.emoji ?? '✨', body.vibe ?? 'new circle',
      body.type ?? 'Custom', body.privacy ?? 'Invite only',
      Math.floor(Math.random() * 6), userId, inviteToken,
    ),
    ...memberIds.map(uid =>
      env.DB.prepare('INSERT OR IGNORE INTO circle_members (circle_id, user_id) VALUES (?, ?)').bind(id, uid)
    ),
  ]);

  return json({ id, inviteToken }, { status: 201 });
}

async function deleteCircle(circleId: string, userId: string, env: Env): Promise<Response> {
  // Only the creator can delete; others can leave
  const circle = await env.DB.prepare(
    'SELECT created_by_user_id FROM circles WHERE id = ?'
  ).bind(circleId).first<{ created_by_user_id: string }>();

  if (!circle) return notFound();

  if (circle.created_by_user_id === userId) {
    await env.DB.prepare('DELETE FROM circles WHERE id = ?').bind(circleId).run();
  } else {
    // Leave the circle
    await env.DB.prepare(
      'DELETE FROM circle_members WHERE circle_id = ? AND user_id = ?'
    ).bind(circleId, userId).run();
  }
  return json({ ok: true });
}

async function addMember(request: Request, circleId: string, userId: string, env: Env): Promise<Response> {
  const body = await request.json() as { username?: string };
  if (!body.username?.trim()) return badRequest('Username is required');

  const username = body.username.trim().toLowerCase().replace(/^@/, '');
  const target = await env.DB.prepare('SELECT id FROM users WHERE username = ?')
    .bind(`@${username}`).first<{ id: string }>();
  if (!target) return json({ message: 'User not found' }, { status: 404 });

  // Ensure requester is a member
  const isMember = await env.DB.prepare(
    'SELECT 1 FROM circle_members WHERE circle_id = ? AND user_id = ?'
  ).bind(circleId, userId).first();
  if (!isMember) return unauthorized();

  await env.DB.prepare(
    'INSERT OR IGNORE INTO circle_members (circle_id, user_id) VALUES (?, ?)'
  ).bind(circleId, target.id).run();
  return json({ ok: true });
}

async function joinByInvite(token: string, userId: string, env: Env): Promise<Response> {
  const circle = await env.DB.prepare(
    'SELECT id FROM circles WHERE invite_token = ?'
  ).bind(token).first<{ id: string }>();
  if (!circle) return notFound();

  await env.DB.prepare(
    'INSERT OR IGNORE INTO circle_members (circle_id, user_id) VALUES (?, ?)'
  ).bind(circle.id, userId).run();
  return json({ circleId: circle.id });
}

// ─── Message handlers ─────────────────────────────────────────────────────────

async function listMessages(circleId: string, userId: string, url: URL, env: Env): Promise<Response> {
  const isMember = await env.DB.prepare(
    'SELECT 1 FROM circle_members WHERE circle_id = ? AND user_id = ?'
  ).bind(circleId, userId).first();
  if (!isMember) return unauthorized();

  const after = url.searchParams.get('after'); // ISO timestamp for polling
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 50), 100);

  const query = after
    ? `SELECT m.id, m.circle_id, m.sender_id, u.name AS sender_name,
         u.initials AS sender_initials, u.avatar_gradient_index AS sender_gradient,
         m.type, m.text, m.voice_duration, m.memory_caption, m.media_id, m.created_at
       FROM messages m JOIN users u ON u.id = m.sender_id
       WHERE m.circle_id = ? AND m.created_at > ?
       ORDER BY m.created_at ASC LIMIT ?`
    : `SELECT m.id, m.circle_id, m.sender_id, u.name AS sender_name,
         u.initials AS sender_initials, u.avatar_gradient_index AS sender_gradient,
         m.type, m.text, m.voice_duration, m.memory_caption, m.media_id, m.created_at
       FROM messages m JOIN users u ON u.id = m.sender_id
       WHERE m.circle_id = ?
       ORDER BY m.created_at DESC LIMIT ?`;

  const bindings = after ? [circleId, after, limit] : [circleId, limit];
  const { results } = await env.DB.prepare(query).bind(...bindings).all<MessageRow>();

  // Always return oldest-first for the client
  const ordered = after ? results : [...results].reverse();
  return json(ordered.map(mapMessage));
}

async function notifyCircleMembers(env: Env, circleId: string, senderId: string, title: string, body: string) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT u.push_token FROM users u JOIN circle_members cm ON u.id = cm.user_id WHERE cm.circle_id = ? AND u.id != ? AND u.push_token IS NOT NULL'
    ).bind(circleId, senderId).all<{ push_token: string }>();
    
    const tokens = results.map(r => r.push_token).filter(Boolean);
    if (tokens.length === 0) return;
    
    const messages = tokens.map(to => ({
      to,
      sound: 'default',
      title,
      body,
    }));
    
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages)
    });
  } catch (e) {
    console.error('Push error:', e);
  }
}

async function sendMessage(request: Request, circleId: string, userId: string, env: Env): Promise<Response> {
  const isMember = await env.DB.prepare(
    'SELECT 1 FROM circle_members WHERE circle_id = ? AND user_id = ?'
  ).bind(circleId, userId).first();
  if (!isMember) return unauthorized();

  const body = await request.json() as {
    type?: string; text?: string; voiceDuration?: string; memoryCaption?: string; mediaId?: string;
  };
  if (!body.type) return badRequest('Message type is required');
  if (body.type === 'text' && !body.text?.trim()) return badRequest('Text is required');

  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO messages (id, circle_id, sender_id, type, text, voice_duration, memory_caption, media_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, circleId, userId, body.type,
    body.text?.trim() ?? null,
    body.voiceDuration ?? null,
    body.memoryCaption ?? null,
    body.mediaId ?? null,
  ).run();

  const row = await env.DB.prepare(
    `SELECT m.id, m.circle_id, m.sender_id, u.name AS sender_name,
       u.initials AS sender_initials, u.avatar_gradient_index AS sender_gradient,
       m.type, m.text, m.voice_duration, m.memory_caption, m.media_id, m.created_at
     FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.id = ?`
  ).bind(id).first<MessageRow>();

  // Send Push Notification
  try {
    const circle = await env.DB.prepare('SELECT name FROM circles WHERE id = ?').bind(circleId).first<{name: string}>();
    const senderName = row?.sender_name ?? 'Someone';
    const circleName = circle?.name ?? 'your circle';
    
    let pushBody = 'Sent a message';
    if (body.type === 'text') pushBody = body.text ?? '';
    else if (body.type === 'memory') pushBody = 'Shared a memory 📷';
    
    await notifyCircleMembers(env, circleId, userId, `${senderName} in ${circleName}`, pushBody);
  } catch (e) {
    console.warn(e);
  }

  return json(row ? mapMessage(row) : { id }, { status: 201 });
}

// ─── Plan handlers ────────────────────────────────────────────────────────────

async function listPlans(circleId: string, userId: string, env: Env): Promise<Response> {
  const isMember = await env.DB.prepare(
    'SELECT 1 FROM circle_members WHERE circle_id = ? AND user_id = ?'
  ).bind(circleId, userId).first();
  if (!isMember) return unauthorized();

  const { results } = await env.DB.prepare(
    `SELECT p.id, p.circle_id, p.title, p.date_label, p.time_label,
       p.location, p.tag, p.created_at,
       COALESCE(json_group_array(pm.user_id), '[]') AS member_ids
     FROM plans p
     LEFT JOIN plan_members pm ON pm.plan_id = p.id
     WHERE p.circle_id = ?
     GROUP BY p.id ORDER BY p.created_at ASC`
  ).bind(circleId).all<PlanRow>();
  return json(results.map(mapPlan));
}

async function createPlan(request: Request, circleId: string, userId: string, env: Env): Promise<Response> {
  const isMember = await env.DB.prepare(
    'SELECT 1 FROM circle_members WHERE circle_id = ? AND user_id = ?'
  ).bind(circleId, userId).first();
  if (!isMember) return unauthorized();

  const body = await request.json() as {
    title?: string; date?: string; time?: string; location?: string; tag?: string;
  };
  if (!body.title?.trim()) return badRequest('Plan title is required');
  if (!body.date?.trim())  return badRequest('Date is required');

  const id = crypto.randomUUID();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO plans (id, circle_id, title, date_label, time_label, location, tag)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, circleId, body.title.trim(), body.date.trim(),
      body.time?.trim() ?? '', body.location?.trim() ?? '', body.tag?.trim() ?? ''),
    env.DB.prepare('INSERT OR IGNORE INTO plan_members (plan_id, user_id) VALUES (?, ?)')
      .bind(id, userId),
  ]);

  try {
    const circle = await env.DB.prepare('SELECT name FROM circles WHERE id = ?').bind(circleId).first<{name: string}>();
    const sender = await env.DB.prepare('SELECT name FROM users WHERE id = ?').bind(userId).first<{name: string}>();
    const senderName = sender?.name ?? 'Someone';
    const circleName = circle?.name ?? 'your circle';
    
    await notifyCircleMembers(env, circleId, userId, `${senderName} in ${circleName}`, `Created a new plan: ${body.title.trim()}`);
  } catch (e) {
    console.warn(e);
  }

  return json({ id }, { status: 201 });
}

async function rsvpPlan(request: Request, planId: string, userId: string, env: Env): Promise<Response> {
  const body = await request.json() as { status?: 'in' | 'out' | 'maybe' };
  const status = body.status;
  if (!['in', 'out', 'maybe'].includes(status ?? '')) return badRequest('status must be in, out, or maybe');

  // Verify user is member of the circle this plan belongs to
  const plan = await env.DB.prepare('SELECT circle_id FROM plans WHERE id = ?')
    .bind(planId).first<{ circle_id: string }>();
  if (!plan) return notFound();

  const isMember = await env.DB.prepare(
    'SELECT 1 FROM circle_members WHERE circle_id = ? AND user_id = ?'
  ).bind(plan.circle_id, userId).first();
  if (!isMember) return unauthorized();

  if (status === 'in') {
    await env.DB.prepare(
      'INSERT OR IGNORE INTO plan_members (plan_id, user_id) VALUES (?, ?)'
    ).bind(planId, userId).run();
  } else {
    await env.DB.prepare('DELETE FROM plan_members WHERE plan_id = ? AND user_id = ?')
      .bind(planId, userId).run();
  }

  await env.DB.prepare(
    `INSERT INTO plan_rsvps (plan_id, user_id, status, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(plan_id, user_id) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at`
  ).bind(planId, userId, status).run();

  return json({ ok: true, status });
}

async function getPlanRsvps(planId: string, userId: string, env: Env): Promise<Response> {
  const plan = await env.DB.prepare('SELECT circle_id FROM plans WHERE id = ?')
    .bind(planId).first<{ circle_id: string }>();
  if (!plan) return notFound();

  const isMember = await env.DB.prepare(
    'SELECT 1 FROM circle_members WHERE circle_id = ? AND user_id = ?'
  ).bind(plan.circle_id, userId).first();
  if (!isMember) return unauthorized();

  const { results } = await env.DB.prepare(
    `SELECT pr.user_id, pr.status, u.name, u.initials, u.avatar_gradient_index AS gradient_index
     FROM plan_rsvps pr JOIN users u ON u.id = pr.user_id
     WHERE pr.plan_id = ?`
  ).bind(planId).all();
  return json(results);
}

// ─── Media handlers ───────────────────────────────────────────────────────────

async function uploadMedia(request: Request, userId: string, env: Env): Promise<Response> {
  const contentType = request.headers.get('Content-Type') ?? 'application/octet-stream';
  const circleId    = request.headers.get('X-Circle-Id');
  const extension   = contentType.split('/')[1]?.split(';')[0] || 'bin';
  const id          = crypto.randomUUID();
  const key         = `${circleId ? `circles/${circleId}` : `users/${userId}`}/${id}.${extension}`;

  await env.MEDIA.put(key, request.body, { httpMetadata: { contentType } });
  await env.DB.prepare(
    `INSERT INTO media (id, owner_user_id, circle_id, r2_key, content_type, size_bytes) VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(id, userId, circleId, key, contentType, Number(request.headers.get('Content-Length')) || null).run();

  return json({ id, key }, { status: 201 });
}

async function getMedia(id: string, env: Env): Promise<Response> {
  const media = await env.DB.prepare('SELECT r2_key, content_type FROM media WHERE id = ?')
    .bind(id).first<{ r2_key: string; content_type: string }>();
  if (!media) return notFound();
  const object = await env.MEDIA.get(media.r2_key);
  if (!object) return notFound();
  return new Response(object.body, {
    headers: {
      'Content-Type': media.content_type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url    = new URL(request.url);
    const path   = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

    try {
      // ── Public ──────────────────────────────────────────────────────────────
      if (method === 'GET'  && path === '/health')          return json({ ok: true });
      if (method === 'POST' && path === '/auth/register')   return register(request, env);
      if (method === 'POST' && path === '/auth/login')      return login(request, env);

      // ── Public invite join (still needs auth to actually join) ──────────────
      const inviteMatch = path.match(/^\/invite\/([^/]+)$/);

      // ── Auth-required routes ─────────────────────────────────────────────────
      const userId = await authenticate(request, env);

      if (method === 'GET'   && path === '/users/me')       return userId ? getMe(userId, env) : unauthorized();
      if (method === 'PATCH' && path === '/users/me')       return userId ? updateMe(request, userId, env) : unauthorized();
      if (method === 'PATCH' && path === '/users/me/push-token') return userId ? updatePushToken(request, userId, env) : unauthorized();
      if (method === 'GET'   && path === '/users/search')   return userId ? searchUsers(url, env) : unauthorized();

      if (!userId) return unauthorized();

      // Invite join
      if (method === 'POST' && inviteMatch)                 return joinByInvite(inviteMatch[1], userId, env);

      // Circles
      if (method === 'GET'  && path === '/circles')         return listCircles(userId, env);
      if (method === 'POST' && path === '/circles')         return createCircle(request, userId, env);

      const circleMatch = path.match(/^\/circles\/([^/]+)$/);
      const circMsgMatch = path.match(/^\/circles\/([^/]+)\/messages$/);
      const circPlanMatch = path.match(/^\/circles\/([^/]+)\/plans$/);
      const circMemberMatch = path.match(/^\/circles\/([^/]+)\/members$/);

      if (circleMatch) {
        const cid = circleMatch[1];
        if (method === 'GET')    return getCircle(cid, userId, env);
        if (method === 'DELETE') return deleteCircle(cid, userId, env);
      }
      if (circMsgMatch) {
        const cid = circMsgMatch[1];
        if (method === 'GET')  return listMessages(cid, userId, url, env);
        if (method === 'POST') return sendMessage(request, cid, userId, env);
      }
      if (circPlanMatch) {
        const cid = circPlanMatch[1];
        if (method === 'GET')  return listPlans(cid, userId, env);
        if (method === 'POST') return createPlan(request, cid, userId, env);
      }
      if (circMemberMatch) {
        const cid = circMemberMatch[1];
        if (method === 'POST') return addMember(request, cid, userId, env);
      }

      // Plans
      const planRsvpMatch = path.match(/^\/plans\/([^/]+)\/rsvp$/);
      const planRsvpGetMatch = path.match(/^\/plans\/([^/]+)\/rsvps$/);
      if (planRsvpMatch) {
        if (method === 'POST') return rsvpPlan(request, planRsvpMatch[1], userId, env);
      }
      if (planRsvpGetMatch) {
        if (method === 'GET') return getPlanRsvps(planRsvpGetMatch[1], userId, env);
      }

      // Media
      if (method === 'POST' && path === '/media')           return uploadMedia(request, userId, env);
      const mediaMatch = path.match(/^\/media\/([^/]+)$/);
      if (method === 'GET' && mediaMatch)                   return getMedia(mediaMatch[1], env);

      return notFound();
    } catch (err) {
      console.error(err);
      return json({ message: 'Internal server error' }, { status: 500 });
    }
  },
};
