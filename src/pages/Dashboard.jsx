import { useState, useMemo } from 'react';
import { SubjectCard } from '../components/SubjectCard';
import { ActivityGrid } from '../components/ActivityGrid';
import { getGlobalStats, getWeakestMetric } from '../utils/progress';
import { getQuoteOfTheDay } from '../data/quotes';
import { useApp } from '../context/AppContext';
import { useAcademic } from '../context/AcademicContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/ui/Modal';

export function Dashboard() {
  const { data, addSubject, exportData, importData } = useApp();
  const { profile } = useAcademic();
  const { addToast } = useToast();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  const subjects = data?.subjects || [];
  const filteredSubjects = useMemo(() => {
    if (!globalSearch.trim()) return subjects;
    const q = globalSearch.trim().toLowerCase();
    return subjects.filter((s) => s.name.toLowerCase().includes(q));
  }, [subjects, globalSearch]);
  const stats = getGlobalStats(subjects);
  const weakestMetric = useMemo(() => getWeakestMetric(subjects), [subjects]);

  const handleAddSubject = () => {
    const name = newSubjectName.trim();
    if (name) {
      addSubject(name);
      setNewSubjectName('');
      setShowAdd(false);
      addToast('Subject created');
    }
  };

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'syllabus-tracker-export.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Data exported');
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (parsed?.subjects?.length) {
        importData(parsed);
        setImportText('');
        setImportOpen(false);
        addToast('Data imported');
      } else {
        addToast('Invalid or empty data', 'error');
      }
    } catch (_) {
      addToast('Invalid JSON', 'error');
    }
  };

  const isEmpty = subjects.length === 0;
  const quote = useMemo(() => getQuoteOfTheDay(), []);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {!isEmpty && (
        <p className="text-sm text-dark-muted italic mb-6 border-l-2 border-dark-accent/50 pl-4">"{quote}"</p>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-brand text-2xl font-bold text-dark-text tracking-tight">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-dark-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Add Subject
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-dark-border text-dark-text rounded-lg text-sm hover:bg-dark-card transition-colors"
          >
            Export JSON
          </button>
          <button
            onClick={() => setImportOpen(true)}
            className="px-4 py-2 border border-dark-border text-dark-text rounded-lg text-sm hover:bg-dark-card transition-colors"
          >
            Import JSON
          </button>
        </div>
      </div>

      {!isEmpty && (
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search subjects..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent"
          />
        </div>
      )}

      {/* Global stats */}
      {!isEmpty && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-sm text-dark-muted">Total Syllabus Completion</p>
          <p className="text-2xl font-bold text-dark-text mt-1">{stats.syllabusPct}%</p>
          <div className="h-1.5 bg-dark-border rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-dark-accent rounded-full transition-all duration-300"
              style={{ width: `${stats.syllabusPct}%` }}
            />
          </div>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-sm text-dark-muted">Total Chapters</p>
          <p className="text-2xl font-bold text-dark-text mt-1">{stats.totalChapters}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-sm text-dark-muted">Total PYQs Completed</p>
          <p className="text-2xl font-bold text-dark-text mt-1">{stats.totalPyqs}</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <p className="text-sm text-dark-muted">Most Completed</p>
          <p className="text-lg font-semibold text-dark-text mt-1 truncate">
            {stats.mostCompleted ? `${stats.mostCompleted.name} (${stats.mostCompleted.overall}%)` : '—'}
          </p>
        </div>
      </div>
      )}
      {!isEmpty && stats.leastCompleted && subjects.length > 1 && (
        <div className="mb-4 text-sm text-dark-muted">
          Least completed: <span className="text-dark-text font-medium">{stats.leastCompleted.name}</span> ({stats.leastCompleted.overall}%)
        </div>
      )}
      {!isEmpty && weakestMetric && (
        <div className="mb-6 p-4 rounded-lg bg-dark-card border border-dark-border text-sm">
          <span className="text-dark-muted">Your weakest area: </span>
          <span className="text-dark-text font-medium">{weakestMetric.label} in {weakestMetric.subjectName}</span>
          <span className="text-dark-muted"> ({weakestMetric.value}%)</span>
        </div>
      )}

      {!isEmpty && (
        <div className="mb-6">
          <ActivityGrid weeks={12} />
        </div>
      )}

      {/* Empty state */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
          <p className="text-dark-muted mb-6 max-w-sm">
            {profile?.mode === 'custom' ? 'Create your first subject to start tracking.' : 'No subjects yet. Create one to start tracking your syllabus.'}
          </p>
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="px-6 py-3 bg-dark-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Create Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}

      {filteredSubjects.length === 0 && !isEmpty && (
        <p className="text-center text-dark-muted py-8">No subjects match your search.</p>
      )}

      <Modal open={showAdd} onClose={() => { setShowAdd(false); setNewSubjectName(''); }} title="Add Subject">
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
          placeholder="Subject name"
          className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => { setShowAdd(false); setNewSubjectName(''); }}
            className="px-4 py-2 text-dark-muted hover:text-dark-text"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddSubject}
            className="px-4 py-2 bg-dark-accent text-white rounded-lg font-medium"
          >
            Add
          </button>
        </div>
      </Modal>

      <Modal open={importOpen} onClose={() => { setImportOpen(false); setImportText(''); }} title="Import JSON" className="max-w-lg">
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder="Paste exported JSON here..."
          className="w-full h-40 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent resize-none font-mono text-sm"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => { setImportOpen(false); setImportText(''); }}
            className="px-4 py-2 text-dark-muted hover:text-dark-text"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="px-4 py-2 bg-dark-accent text-white rounded-lg font-medium"
          >
            Import
          </button>
        </div>
      </Modal>

    </div>
  );
}
