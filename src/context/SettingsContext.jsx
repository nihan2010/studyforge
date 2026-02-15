import { createContext, useContext } from 'react';
import { useSettings } from '../hooks/useSettings';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const value = useSettings();
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) return { settings: {}, setSetting: () => {}, resetSettings: () => {} };
  return ctx;
}
