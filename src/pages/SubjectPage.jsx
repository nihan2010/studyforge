import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChapterTable } from '../components/ChapterTable';
import { ProgressPanel } from '../components/ProgressPanel';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useSettingsContext } from '../context/SettingsContext';
import { getSubjectStats } from '../utils/progress';

export function SubjectPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const {
    data,
    updateSubject,
    addChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
    bulkUpdateChapters,
    bulkDeleteChapters,
    setExamDate,
    addCustomColumn,
    renameCustomColumn,
    removeCustomColumn,
    deleteSubject,
    resetSubjectProgress,
  } = useApp();
  const { addToast } = useToast();
  const { settings } = useSettingsContext();

  const [search, setSearch] = useState('');
  const [filterIncomplete, setFilterIncomplete] = useState(false);
  const [filterHighPriority, setFilterHighPriority] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [deleteChapterTarget, setDeleteChapterTarget] = useState(null);
  const [deleteSubjectConfirm, setDeleteSubjectConfirm] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showExamDate, setShowExamDate] = useState(false);
  const [examDateInput, setExamDateInput] = useState('');

  const subject = useMemo(
    () => data?.subjects?.find((s) => s.id === subjectId),
    [data?.subjects, subjectId]
  );

  const filteredChapters = useMemo(() => {
    if (!subject?.chapters) return [];
    let list = [...subject.chapters];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.chapterName.toLowerCase().includes(q));
    }
    if (filterIncomplete) {
      list = list.filter(
        (c) =>
          !c.revised ||
          !c.pyqDone ||
          !c.examsAttended ||
          !c.notesCompleted ||
          Object.values(c.customFields || {}).some((v) => !v)
      );
    }
    if (filterHighPriority) {
      list = list.filter((c) => c.highPriority);
    }
    return list;
  }, [subject?.chapters, search, filterIncomplete, filterHighPriority]);

  const handleRenameSubject = () => {
    const name = renameValue.trim();
    if (name && subject) {
      updateSubject(subject.id, { name });
      setRenameValue('');
      setShowRename(false);
      addToast('Subject renamed');
    }
  };

  const handleSetExamDate = () => {
    if (!subject) return;
    const val = examDateInput.trim();
    setExamDate(subject.id, val || null);
    setShowExamDate(false);
    setExamDateInput(subject.examDate || '');
    if (val) addToast('Exam date set');
  };

  useEffect(() => {
    if (!subject) return;
    const handleKeyDown = (e) => {
      const tag = e.target?.tagName?.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        addChapter(subject.id);
        addToast('Chapter added');
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        const label = prompt('New column name:');
        if (label?.trim()) {
          addCustomColumn(subject.id, label.trim());
          addToast('Column added');
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('syllabus-delete-selected'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subject?.id, addChapter, addCustomColumn, addToast]);

  if (!subject) {
    return (
      <div className="p-8 text-center text-dark-muted">
        Subject not found. <button onClick={() => navigate('/')} className="text-dark-accent hover:underline">Go to Dashboard</button>
      </div>
    );
  }

  const stats = getSubjectStats(subject);
  const isComplete = stats.overall >= 100 && stats.total > 0;

  return (
    <div className="p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-dark-text truncate">{subject.name}</h2>
            {isComplete && (
              <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
                100% Complete
              </span>
            )}
            <button
              onClick={() => { setRenameValue(subject.name); setShowRename(true); }}
              className="text-sm text-dark-muted hover:text-dark-text"
            >
              Rename
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setExamDateInput(subject.examDate || ''); setShowExamDate(true); }}
              className="px-3 py-1.5 text-sm border border-dark-border text-dark-muted hover:text-dark-text rounded-md"
            >
              {subject.examDate ? 'Edit exam date' : 'Set exam date'}
            </button>
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="px-3 py-1.5 text-sm border border-dark-border text-dark-muted hover:text-dark-text rounded-md"
            >
              Reset Progress
            </button>
            <button
              type="button"
              onClick={() => setDeleteSubjectConfirm(true)}
              className="px-3 py-1.5 text-sm border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-md"
            >
              Delete Subject
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="search"
            placeholder="Search chapters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-dark-accent"
          />
          <label className="flex items-center gap-2 text-sm text-dark-muted cursor-pointer">
            <input
              type="checkbox"
              checked={filterIncomplete}
              onChange={(e) => setFilterIncomplete(e.target.checked)}
              className="rounded border-dark-border text-dark-accent"
            />
            Incomplete only
          </label>
          <label className="flex items-center gap-2 text-sm text-dark-muted cursor-pointer">
            <input
              type="checkbox"
              checked={filterHighPriority}
              onChange={(e) => setFilterHighPriority(e.target.checked)}
              className="rounded border-dark-border text-dark-accent"
            />
            High priority
          </label>
        </div>

        {subject.chapters?.length === 0 ? (
          <div className="border border-dark-border rounded-lg bg-dark-card p-12 text-center">
            <p className="text-dark-muted mb-4">No chapters yet. Add one to start tracking.</p>
            <button
              type="button"
              onClick={() => { addChapter(subject.id); addToast('Chapter added'); }}
              className="px-4 py-2 bg-dark-accent text-white rounded-lg text-sm font-medium"
            >
              Add Chapter
            </button>
          </div>
        ) : (
          <ChapterTable
            subject={subject}
            filteredChapters={filteredChapters}
            onUpdateChapter={updateChapter}
            onDeleteChapter={(sid, cid) => setDeleteChapterTarget({ subjectId: sid, chapterId: cid })}
            onAddChapter={() => { addChapter(subject.id); addToast('Chapter added'); }}
            onReorderChapters={reorderChapters}
            onBulkUpdate={bulkUpdateChapters}
            onBulkDelete={(sid, ids) => { bulkDeleteChapters(sid, ids); addToast(`${ids.length} chapter(s) deleted`); }}
            onAddCustomColumn={(sid, label) => { addCustomColumn(sid, label); addToast('Column added'); }}
            onRenameCustomColumn={renameCustomColumn}
            onRemoveCustomColumn={(sid, colId) => { removeCustomColumn(sid, colId); addToast('Column removed'); }}
            onToast={addToast}
            compact={settings.compactTable}
          />
        )}
      </div>

      {settings.showAnalyticsPanel && !settings.focusMode && (
        <aside className="w-full lg:w-72 shrink-0">
          <ProgressPanel subject={subject} />
        </aside>
      )}

      <Modal open={showRename} onClose={() => { setShowRename(false); setRenameValue(''); }} title="Rename Subject">
        <input
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRenameSubject()}
          className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent"
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => { setShowRename(false); setRenameValue(''); }} className="px-4 py-2 text-dark-muted hover:text-dark-text">Cancel</button>
          <button type="button" onClick={handleRenameSubject} className="px-4 py-2 bg-dark-accent text-white rounded-lg font-medium">Save</button>
        </div>
      </Modal>

      <Modal open={showExamDate} onClose={() => { setShowExamDate(false); }} title={subject.examDate ? 'Edit exam date' : 'Set exam date'}>
        <input
          type="date"
          value={examDateInput}
          onChange={(e) => setExamDateInput(e.target.value)}
          className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-dark-accent"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={() => setShowExamDate(false)} className="px-4 py-2 text-dark-muted hover:text-dark-text">Cancel</button>
          <button type="button" onClick={handleSetExamDate} className="px-4 py-2 bg-dark-accent text-white rounded-lg font-medium">Save</button>
        </div>
      </Modal>

      {deleteChapterTarget && (
        <ConfirmModal
          open
          title="Delete chapter?"
          message="This cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteChapter(deleteChapterTarget.subjectId, deleteChapterTarget.chapterId);
            setDeleteChapterTarget(null);
            addToast('Chapter deleted');
          }}
          onCancel={() => setDeleteChapterTarget(null)}
        />
      )}

      {deleteSubjectConfirm && (
        <ConfirmModal
          open
          title="Delete subject?"
          message={`Permanently delete "${subject.name}" and all its chapters?`}
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteSubject(subject.id);
            setDeleteSubjectConfirm(false);
            addToast('Subject deleted');
            navigate('/');
          }}
          onCancel={() => setDeleteSubjectConfirm(false)}
        />
      )}

      {resetConfirm && (
        <ConfirmModal
          open
          title="Reset progress?"
          message="All checkboxes for this subject will be unchecked. Chapter names and structure will remain."
          confirmLabel="Reset"
          danger
          onConfirm={() => {
            resetSubjectProgress(subject.id);
            setResetConfirm(false);
            addToast('Progress reset');
          }}
          onCancel={() => setResetConfirm(false)}
        />
      )}
    </div>
  );
}
