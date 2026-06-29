import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getCircles } from '../data/api';
import { Circle } from '../data/mockData';

const hasApi = Boolean(process.env.EXPO_PUBLIC_API_URL);
let cachedCircles: Circle[] = [];
const listeners = new Set<(circles: Circle[]) => void>();

function publish(circles: Circle[]) {
  cachedCircles = circles;
  listeners.forEach((listener) => listener(circles));
}

export function useCircles() {
  const [circles, setCircles] = useState<Circle[]>(cachedCircles);
  const [isLoading, setIsLoading] = useState(hasApi && cachedCircles.length === 0);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!hasApi) return;
    setIsLoading(true);
    try {
      const data = await getCircles();
      publish(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load circles'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    listeners.add(setCircles);
    return () => {
      listeners.delete(setCircles);
    };
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { circles, isLoading, error, refresh: load };
}
