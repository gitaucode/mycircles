import { useCallback, useEffect, useRef, useState } from 'react';
import { getAuthToken } from '../data/authStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const POLL_INTERVAL_MS = 5000;

export type ChatMessage = {
  id: string;
  circleId: string;
  senderId: string;
  senderName: string;
  senderInitials: string;
  senderGradient: number;
  type: 'text' | 'voice' | 'poll' | 'memory';
  text?: string;
  voiceDuration?: string;
  memoryCaption?: string;
  timestamp: string;
};

async function fetchMessages(
  circleId: string,
  after?: string,
): Promise<ChatMessage[]> {
  if (!API_URL) return [];
  const token = await getAuthToken();
  const qs = after ? `?after=${encodeURIComponent(after)}` : '';
  const res = await fetch(`${API_URL}/circles/${circleId}/messages${qs}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) return [];
  return res.json();
}

async function postMessage(
  circleId: string,
  text: string,
): Promise<ChatMessage | null> {
  if (!API_URL) return null;
  const token = await getAuthToken();
  const res = await fetch(`${API_URL}/circles/${circleId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type: 'text', text }),
  });
  if (!res.ok) return null;
  return res.json();
}

export function useMessages(circleId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const lastTimestampRef = useRef<string | undefined>(undefined);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchMessages(circleId).then((msgs) => {
      if (!isMounted) return;
      setMessages(msgs);
      if (msgs.length > 0) {
        lastTimestampRef.current = msgs[msgs.length - 1].timestamp;
      }
      setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, [circleId]);

  // Polling for new messages
  useEffect(() => {
    pollTimer.current = setInterval(async () => {
      const newMsgs = await fetchMessages(circleId, lastTimestampRef.current);
      if (newMsgs.length > 0) {
        setMessages((prev) => [...prev, ...newMsgs]);
        lastTimestampRef.current = newMsgs[newMsgs.length - 1].timestamp;
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [circleId]);

  const sendMessage = useCallback(async (text: string): Promise<boolean> => {
    const msg = await postMessage(circleId, text);
    if (!msg) return false;
    setMessages((prev) => [...prev, msg]);
    lastTimestampRef.current = msg.timestamp;
    return true;
  }, [circleId]);

  return { messages, isLoading, sendMessage };
}
