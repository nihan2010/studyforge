import { useState, useEffect, useCallback } from 'react';
import { PROFILE_STORAGE_KEY } from '../types';

const DEFAULT_PROFILE = null;

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p?.mode === 'custom') return p;
    if (!p?.class || !p?.stream || !p?.language) return null;
    return p;
  } catch {
    return null;
  }
}

function saveProfile(profile) {
  try {
    if (profile) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function useAcademicProfile() {
  const [profile, setProfileState] = useState(loadProfile);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const setProfile = useCallback((newProfile) => {
    setProfileState(newProfile ? { ...newProfile, createdAt: newProfile.createdAt || new Date().toISOString() } : null);
  }, []);

  const clearProfile = useCallback(() => {
    setProfileState(null);
  }, []);

  const hasProfile = profile != null;

  return { profile, setProfile, clearProfile, hasProfile };
}
