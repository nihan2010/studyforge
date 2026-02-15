import { createContext, useContext } from 'react';
import { useAcademicProfile } from '../hooks/useAcademicProfile';

const AcademicContext = createContext(null);

export function AcademicProvider({ children }) {
  const value = useAcademicProfile();
  return <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>;
}

export function useAcademic() {
  const ctx = useContext(AcademicContext);
  if (!ctx) throw new Error('useAcademic must be used within AcademicProvider');
  return ctx;
}
