import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Logo } from './Logo';
import { BackupReminder } from './BackupReminder';
import { Footer } from './Footer';
import { useApp } from '../context/AppContext';
import { useSettingsContext } from '../context/SettingsContext';

export function Layout() {
  const { data, exportData } = useApp();
  const { settings } = useSettingsContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (settings.animations) document.body.classList.remove('no-animations');
    else document.body.classList.add('no-animations');
  }, [settings.animations]);

  const handleBackupExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'syllabus-tracker-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex">
      <BackupReminder onExport={handleBackupExport} />
      <Sidebar subjects={data?.subjects || []} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden fixed top-4 left-4 right-4 z-40 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-dark-card border border-dark-border text-dark-text"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <Logo variant="compact" className="text-sm" />
        </div>
        <main className="flex-1 overflow-auto pt-14 lg:pt-0 flex flex-col min-h-0">
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
