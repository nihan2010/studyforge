import { useState, useEffect } from 'react';
import { BACKUP_REMINDER_KEY } from '../types';
import { Modal } from './ui/Modal';

const REMINDER_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function BackupReminder({ onExport }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const last = localStorage.getItem(BACKUP_REMINDER_KEY);
      const lastTime = last ? parseInt(last, 10) : 0;
      if (lastTime === 0) {
        localStorage.setItem(BACKUP_REMINDER_KEY, String(Date.now()));
        return;
      }
      if (Date.now() - lastTime >= REMINDER_INTERVAL_MS) setShow(true);
    } catch {
      setShow(false);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(BACKUP_REMINDER_KEY, String(Date.now()));
    } catch (_) {}
    setShow(false);
  };

  const handleExport = () => {
    onExport();
    dismiss();
  };

  if (!show) return null;

  return (
    <Modal open={show} onClose={dismiss} title="Weekly backup reminder">
      <p className="text-sm text-dark-muted mb-4">
        Consider exporting your data as a backup. Your progress is stored only in this browser.
      </p>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={dismiss} className="px-4 py-2 text-dark-muted hover:text-dark-text">
          Later
        </button>
        <button type="button" onClick={handleExport} className="px-4 py-2 bg-dark-accent text-white rounded-lg font-medium">
          Export now
        </button>
      </div>
    </Modal>
  );
}
