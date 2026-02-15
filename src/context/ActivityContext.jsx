import { createContext, useContext } from 'react';
import { useActivity } from '../hooks/useActivity';

const ActivityContext = createContext(null);

export function ActivityProvider({ children }) {
  const value = useActivity();
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivityContext() {
  const ctx = useContext(ActivityContext);
  return ctx || { recordActivity: () => {}, getActivityGrid: () => [], activity: {} };
}
