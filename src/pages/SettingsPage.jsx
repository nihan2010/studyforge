import { useSettingsContext } from '../context/SettingsContext';
import { useApp } from '../context/AppContext';
import { useAcademic } from '../context/AcademicContext';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useState } from 'react';

export function SettingsPage() {
  const { settings, setSetting, resetSettings } = useSettingsContext();
  const { setData, exportData } = useApp();
  const { profile, setProfile, clearProfile } = useAcademic();
  const { addToast } = useToast();
  const [resetAllOpen, setResetAllOpen] = useState(false);
  const [resetProfileOpen, setResetProfileOpen] = useState(false);
  const [modeSwitchOpen, setModeSwitchOpen] = useState(false);
  const [modeSwitchTarget, setModeSwitchTarget] = useState(null);

  const handleResetAllData = () => {
    setData({ subjects: [] });
    setResetAllOpen(false);
    addToast('All data has been reset');
  };

  const handleResetProfile = () => {
    clearProfile();
    setResetProfileOpen(false);
    addToast('Profile reset. Complete onboarding to set up again.');
  };

  const handleModeSwitch = (target) => {
    setModeSwitchTarget(target);
    setModeSwitchOpen(true);
  };

  const confirmModeSwitch = () => {
    if (modeSwitchTarget === 'custom') {
      setData({ subjects: [] });
      setProfile({
        mode: 'custom',
        className: 'Custom',
        streamName: '',
        language: '',
        createdAt: new Date().toISOString(),
      });
      addToast('Switched to Custom mode');
    } else {
      setData({ subjects: [] });
      clearProfile();
      addToast('Switched to SCERT mode. Complete onboarding to load syllabus.');
    }
    setModeSwitchOpen(false);
    setModeSwitchTarget(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="font-brand text-2xl font-bold text-dark-text tracking-tight mb-6">Settings</h1>

      <div className="space-y-6">
        <section className="bg-dark-card border border-dark-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">Appearance</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <span className="text-dark-text">Dark mode</span>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => setSetting('darkMode', e.target.checked)}
                className="rounded border-dark-border text-dark-accent"
              />
            </label>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <span className="text-dark-text">Animations</span>
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => setSetting('animations', e.target.checked)}
                className="rounded border-dark-border text-dark-accent"
              />
            </label>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <span className="text-dark-text">Performance mode (disable animations)</span>
              <input
                type="checkbox"
                checked={settings.performanceMode}
                onChange={(e) => {
                  setSetting('performanceMode', e.target.checked);
                  if (e.target.checked) setSetting('animations', false);
                }}
                className="rounded border-dark-border text-dark-accent"
              />
            </label>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <span className="text-dark-text">Focus mode (hide analytics)</span>
              <input
                type="checkbox"
                checked={settings.focusMode}
                onChange={(e) => setSetting('focusMode', e.target.checked)}
                className="rounded border-dark-border text-dark-accent"
              />
            </label>
          </div>
        </section>

        <section className="bg-dark-card border border-dark-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">Table</h3>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-dark-text">Compact table mode</span>
            <input
              type="checkbox"
              checked={settings.compactTable}
              onChange={(e) => setSetting('compactTable', e.target.checked)}
              className="rounded border-dark-border text-dark-accent"
            />
          </label>
        </section>

        <section className="bg-dark-card border border-dark-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">Analytics</h3>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-dark-text">Show analytics panel on subject page</span>
            <input
              type="checkbox"
              checked={settings.showAnalyticsPanel}
              onChange={(e) => setSetting('showAnalyticsPanel', e.target.checked)}
              className="rounded border-dark-border text-dark-accent"
            />
          </label>
        </section>

        <section className="bg-dark-card border border-dark-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">Academic Mode</h3>
          <p className="text-sm text-dark-muted mb-3">Current: {profile?.mode === 'custom' ? 'Custom' : 'SCERT'}</p>
          <div className="flex flex-wrap gap-2">
            {profile?.mode !== 'custom' && (
              <button
                type="button"
                onClick={() => handleModeSwitch('custom')}
                className="px-4 py-2 border border-dark-border text-dark-text rounded-lg text-sm hover:bg-dark-bg/50"
              >
                Switch to Custom Mode
              </button>
            )}
            {profile?.mode === 'custom' && (
              <button
                type="button"
                onClick={() => handleModeSwitch('scert')}
                className="px-4 py-2 border border-dark-border text-dark-text rounded-lg text-sm hover:bg-dark-bg/50"
              >
                Switch to SCERT Mode
              </button>
            )}
          </div>
        </section>

        <section className="bg-dark-card border border-dark-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">Academic Profile</h3>
          <button
            type="button"
            onClick={() => setResetProfileOpen(true)}
            className="px-4 py-2 border border-amber-500/50 text-amber-400 rounded-lg text-sm hover:bg-amber-500/10"
          >
            Reset Academic Profile
          </button>
          <p className="text-xs text-dark-muted mt-2">You will see onboarding again and can regenerate syllabus.</p>
        </section>

        <section className="bg-dark-card border border-dark-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">Data</h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([exportData()], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'syllabus-tracker-export.json';
                a.click();
                URL.revokeObjectURL(url);
                addToast('Data exported');
              }}
              className="px-4 py-2 border border-dark-border text-dark-text rounded-lg text-sm hover:bg-dark-bg/50"
            >
              Export data
            </button>
            <button
              type="button"
              onClick={() => resetSettings()}
              className="px-4 py-2 border border-dark-border text-dark-muted rounded-lg text-sm hover:text-dark-text"
            >
              Reset settings to default
            </button>
            <button
              type="button"
              onClick={() => setResetAllOpen(true)}
              className="px-4 py-2 border border-red-500/50 text-red-400 rounded-lg text-sm hover:bg-red-500/10"
            >
              Reset all data
            </button>
          </div>
        </section>
      </div>

      {resetAllOpen && (
        <ConfirmModal
          open
          title="Reset all data?"
          message="This will permanently delete all subjects and chapters. This cannot be undone."
          confirmLabel="Reset all"
          danger
          onConfirm={handleResetAllData}
          onCancel={() => setResetAllOpen(false)}
        />
      )}

      {resetProfileOpen && (
        <ConfirmModal
          open
          title="Reset academic profile?"
          message="You will see the onboarding flow again. Your current subjects and data will remain until you complete onboarding (then they will be replaced by the new syllabus)."
          confirmLabel="Reset profile"
          danger
          onConfirm={handleResetProfile}
          onCancel={() => setResetProfileOpen(false)}
        />
      )}

      {modeSwitchOpen && (
        <ConfirmModal
          open
          title="Switch academic mode?"
          message="This will reset all subjects and chapters. You cannot undo this."
          confirmLabel="Switch"
          danger
          onConfirm={confirmModeSwitch}
          onCancel={() => { setModeSwitchOpen(false); setModeSwitchTarget(null); }}
        />
      )}
    </div>
  );
}
