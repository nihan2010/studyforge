import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useActivityContext } from './ActivityContext';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const storage = useLocalStorage();
  const { recordActivity } = useActivityContext();
  const value = useMemo(() => ({
    ...storage,
    addChapter: (...args) => {
      storage.addChapter(...args);
      recordActivity();
    },
    updateChapter: (...args) => {
      storage.updateChapter(...args);
      recordActivity();
    },
    bulkUpdateChapters: (...args) => {
      storage.bulkUpdateChapters(...args);
      recordActivity();
    },
  }), [storage, recordActivity]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
