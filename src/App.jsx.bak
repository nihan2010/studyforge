import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { AcademicProvider, useAcademic } from './context/AcademicContext';
import { ActivityProvider } from './context/ActivityContext';
import { Layout } from './components/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { SubjectPage } from './pages/SubjectPage';
import { SettingsPage } from './pages/SettingsPage';

const INITIAL_LOAD_MS = 400;

function AppContent() {
  const { hasProfile } = useAcademic();
  if (!hasProfile) return <Onboarding />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="subject/:subjectId" element={<SubjectPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), INITIAL_LOAD_MS);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <SettingsProvider>
      <AcademicProvider>
        <ActivityProvider>
          <AppProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </AppProvider>
        </ActivityProvider>
      </AcademicProvider>
    </SettingsProvider>
  );
}
