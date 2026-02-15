import { useState, useEffect, useCallback } from 'react';
import { SETTINGS_STORAGE_KEY } from '../types';

const DEFAULT_SETTINGS = {
  animations: true,
  compactTable: false,
  showAnalyticsPanel: true,
  darkMode: true,
  focusMode: false,
  performanceMode: false,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function useSettings() {
  const [settings, setSettingsState] = useState(loadSettings);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const setSetting = useCallback((key, value) => {
    setSettingsState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
  }, []);

  return { settings, setSetting, resetSettings };
}
