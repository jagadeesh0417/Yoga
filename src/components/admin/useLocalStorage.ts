'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T[]) {
  const [data, setData] = useState<T[]>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [key, data, loaded]);

  const add = useCallback((item: T) => {
    setData((prev) => [...prev, item]);
  }, []);

  const update = useCallback((index: number, item: T) => {
    setData((prev) => {
      const next = [...prev];
      next[index] = item;
      return next;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return { data, setData, add, update, remove, loaded };
}
