INSERT OR IGNORE INTO users (id, name, username, initials, avatar_gradient_index, bio) VALUES
  ('u1', 'Maya', '@maya', 'M', 0, 'Keeping my people close.'),
  ('u2', 'Amani', '@amani', 'A', 1, NULL),
  ('u3', 'Brian', '@brian', 'B', 2, NULL),
  ('u4', 'Wanja', '@wanja', 'W', 3, NULL),
  ('u5', 'Njeri', '@njeri', 'N', 4, NULL),
  ('u6', 'Tasha', '@tasha', 'T', 5, NULL),
  ('u7', 'Kevin', '@kevin', 'K', 6, NULL),
  ('u8', 'Imani', '@imani', 'I', 7, NULL);

INSERT OR IGNORE INTO circles (
  id, name, emoji, vibe, type, privacy, gradient_index,
  upcoming_event, memory_highlight, created_by_user_id
) VALUES
  ('c1', 'Besties', '❤️', 'chaotic', 'Friends', 'Invite only', 0, 'Beach Hangout · Sat', '1 yr ago: Diani trip', 'u1'),
  ('c2', 'Campus Crew', '🎓', 'always grinding', 'Campus', 'Approval required', 1, 'Movie Night · Fri', NULL, 'u1'),
  ('c3', 'Family', '🏠', 'love & loyalty', 'Family', 'Invite only', 2, 'Wanja''s Birthday · Sun', '5 yrs of family lunches', 'u1'),
  ('c4', 'Creators', '✨', 'build mode', 'Creators', 'Approval required', 3, NULL, 'First collab: 2 yrs ago', 'u1'),
  ('c5', 'Study Squad', '📚', 'locked in', 'Campus', 'Approval required', 4, NULL, NULL, 'u1'),
  ('c6', 'Weekend Plans', '🌿', 'outside', 'Friends', 'Invite only', 5, NULL, 'Karura hike · last month', 'u1');

INSERT OR IGNORE INTO circle_members (circle_id, user_id) VALUES
  ('c1', 'u1'), ('c1', 'u2'), ('c1', 'u3'), ('c1', 'u4'), ('c1', 'u5'), ('c1', 'u6'),
  ('c2', 'u1'), ('c2', 'u2'), ('c2', 'u3'), ('c2', 'u4'), ('c2', 'u5'), ('c2', 'u6'), ('c2', 'u7'), ('c2', 'u8'),
  ('c3', 'u1'), ('c3', 'u2'), ('c3', 'u3'), ('c3', 'u4'), ('c3', 'u5'), ('c3', 'u6'), ('c3', 'u7'),
  ('c4', 'u1'), ('c4', 'u2'), ('c4', 'u3'), ('c4', 'u4'), ('c4', 'u5'), ('c4', 'u6'), ('c4', 'u7'), ('c4', 'u8'),
  ('c5', 'u1'), ('c5', 'u2'), ('c5', 'u3'), ('c5', 'u4'), ('c5', 'u5'), ('c5', 'u6'), ('c5', 'u7'), ('c5', 'u8'),
  ('c6', 'u1'), ('c6', 'u2'), ('c6', 'u3'), ('c6', 'u4'), ('c6', 'u5'), ('c6', 'u6');

INSERT OR IGNORE INTO messages (id, circle_id, sender_id, type, text, created_at) VALUES
  ('m1', 'c1', 'u2', 'text', 'Guys! Who''s free this weekend?', '2026-06-29 10:15:00'),
  ('m2', 'c1', 'u1', 'text', 'I''m free! Let''s do brunch', '2026-06-29 10:20:00'),
  ('m3', 'c1', 'u4', 'text', 'Yesss! Somewhere new?', '2026-06-29 10:22:00');
