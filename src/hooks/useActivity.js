import { useState, useEffect, useCallback } from 'react';
import { ACTIVITY_STORAGE_KEY } from '../types';

function loadActivity() {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return typeof data === 'object' && data !== null ? data : {};
  } catch {
    return {};
  }
}

function saveActivity(activity) {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activity));
  } catch (e) {
    console.error('Failed to save activity', e);
  }
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function useActivity() {
  const [activity, setActivityState] = useState(loadActivity);

  useEffect(() => {
    saveActivity(activity);
  }, [activity]);

  const recordActivity = useCallback(() => {
    const key = todayKey();
    setActivityState((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  }, []);

  const getActivityGrid = useCallback((weeks = 12, daysPerWeek = 7) => {
    const grid = [];
    const today = new Date();
    for (let w = 0; w < weeks; w++) {
      const row = [];
      for (let d = 0; d < daysPerWeek; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + (6 - d)));
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        row.push({ key, count: activity[key] || 0, isToday: key === todayKey() });
      }
      grid.push(row);
    }
    return grid;
  }, [activity]);

  return { activity, recordActivity, getActivityGrid, todayKey };
}
