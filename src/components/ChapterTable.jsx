import { useState, useCallback, useRef, useEffect } from 'react';
import { BUILTIN_COLUMNS } from '../types';
import { getChapterProgress } from '../utils/progress';
import { ConfirmModal } from './ui/ConfirmModal';

function StarIcon({ filled }) {
  return (
    <svg className="w-4 h-4" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

export function ChapterTable({
  subject,
  filteredChapters,
  onUpdateChapter,
  onDeleteChapter,
  onAddChapter,
  onReorderChapters,
  onBulkUpdate,
  onBulkDelete,
  onAddCustomColumn,
  onRenameCustomColumn,
  onRemoveCustomColumn,
  onToast,
  compact = false,
}) {
  const customColumns = subject.customColumns || [];
  const allColumns = [...BUILTIN_COLUMNS, ...customColumns.map((c) => ({ key: c.id, label: c.label, customId: c.id }))];
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [removeColumnTarget, setRemoveColumnTarget] = useState(null);
  const selectAllRef = useRef(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedIds.size > 0 && selectedIds.size < filteredChapters.length;
    }
  }, [selectedIds.size, filteredChapters.length]);

  useEffect(() => {
    const handler = () => {
      if (selectedIds.size > 0) setBulkDeleteConfirm(true);
    };
    window.addEventListener('syllabus-delete-selected', handler);
    return () => window.removeEventListener('syllabus-delete-selected', handler);
  }, [selectedIds.size]);

  const handleToggle = useCallback((chapterId, field, value) => {
    onUpdateChapter(subject.id, chapterId, { [field]: value });
  }, [subject.id, onUpdateChapter]);

  const handleCustomToggle = useCallback((chapterId, columnId, value) => {
    const ch = subject.chapters.find((c) => c.id === chapterId);
    onUpdateChapter(subject.id, chapterId, {
      customFields: { ...(ch?.customFields || {}), [columnId]: value },
    });
  }, [subject.id, subject.chapters, onUpdateChapter]);

  const handleChapterNameChange = useCallback((chapterId, name) => {
    onUpdateChapter(subject.id, chapterId, { chapterName: name });
  }, [subject.id, onUpdateChapter]);

  const handlePriorityToggle = useCallback((chapterId, highPriority) => {
    onUpdateChapter(subject.id, chapterId, { highPriority });
  }, [subject.id, onUpdateChapter]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredChapters.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredChapters.map((c) => c.id)));
  }, [filteredChapters, selectedIds.size]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleBulkMarkRevised = useCallback(() => {
    if (selectedIds.size === 0) return;
    onBulkUpdate(subject.id, [...selectedIds], { revised: true });
    clearSelection();
  }, [subject.id, selectedIds, onBulkUpdate, clearSelection]);

  const handleBulkMarkPyq = useCallback(() => {
    if (selectedIds.size === 0) return;
    onBulkUpdate(subject.id, [...selectedIds], { pyqDone: true });
    clearSelection();
  }, [subject.id, selectedIds, onBulkUpdate, clearSelection]);

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedIds.size === 0) return;
    setBulkDeleteConfirm(true);
  }, [selectedIds.size]);

  const handleBulkDeleteConfirm = useCallback(() => {
    onBulkDelete(subject.id, [...selectedIds]);
    clearSelection();
    setBulkDeleteConfirm(false);
  }, [subject.id, selectedIds, onBulkDelete, clearSelection]);

  const handleDragStart = useCallback((e, chapterId) => {
    setDraggedId(chapterId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', chapterId);
  }, []);

  const handleDragOver = useCallback((e, chapterId) => {
    e.preventDefault();
    if (chapterId !== draggedId) setDragOverId(chapterId);
  }, [draggedId]);

  const handleDragLeave = useCallback(() => setDragOverId(null), []);

  const handleDrop = useCallback((e, targetChapterId) => {
    e.preventDefault();
    setDragOverId(null);
    setDraggedId(null);
    const sourceId = e.dataTransfer.getData('text/plain');
    if (!sourceId || sourceId === targetChapterId) return;
    const visibleIds = filteredChapters.map((c) => c.id);
    const sourceIdx = visibleIds.indexOf(sourceId);
    const targetIdx = visibleIds.indexOf(targetChapterId);
    if (sourceIdx === -1 || targetIdx === -1) return;
    const newVisibleOrder = [...visibleIds];
    newVisibleOrder.splice(sourceIdx, 1);
    newVisibleOrder.splice(targetIdx, 0, sourceId);
    const otherIds = (subject.chapters || []).map((c) => c.id).filter((id) => !visibleIds.includes(id));
    onReorderChapters(subject.id, [...newVisibleOrder, ...otherIds]);
  }, [filteredChapters, subject.chapters, subject.id, onReorderChapters]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const py = compact ? 'py-1.5' : 'py-2';
  const px = compact ? 'px-3' : 'px-4';

  return (
    <div className="border border-dark-border rounded-lg overflow-hidden bg-dark-card">
      {selectedIds.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-dark-bg/50 border-b border-dark-border text-sm">
          <span className="text-dark-muted">{selectedIds.size} selected</span>
          <button type="button" onClick={handleBulkMarkRevised} className="px-3 py-1.5 border border-dark-border rounded-md text-dark-text hover:bg-dark-card">
            Mark Revised
          </button>
          <button type="button" onClick={handleBulkMarkPyq} className="px-3 py-1.5 border border-dark-border rounded-md text-dark-text hover:bg-dark-card">
            Mark PYQs Done
          </button>
          <button type="button" onClick={handleBulkDeleteClick} className="px-3 py-1.5 border border-red-500/50 text-red-400 rounded-md hover:bg-red-500/10">
            Delete selected
          </button>
          <button type="button" onClick={clearSelection} className="px-3 py-1.5 text-dark-muted hover:text-dark-text">
            Clear
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-border bg-dark-bg/50">
              <th className={`text-left ${py} ${px} w-8`}>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={filteredChapters.length > 0 && selectedIds.size === filteredChapters.length}
                  onChange={toggleSelectAll}
                  className="rounded border-dark-border text-dark-accent"
                />
              </th>
              <th className={`text-left ${py} ${px} font-medium text-dark-muted w-8`}>#</th>
              <th className={`text-left ${py} ${px} font-medium text-dark-text min-w-[160px]`}>Chapter Name</th>
              <th className={`text-left ${py} ${px} font-medium text-dark-muted w-20`}>Progress</th>
              <th className={`text-left ${py} ${px} font-medium text-dark-muted w-10`} title="High Priority">★</th>
              {allColumns.map((col) => (
                <th key={col.key} className={`text-left ${py} ${px} font-medium text-dark-muted whitespace-nowrap`}>
                  {col.customId ? (
                    <span className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          const l = prompt('Rename column:', col.label);
                          if (!l?.trim()) return;
                          const dup = allColumns.some((c) => c.label.toLowerCase() === l.trim().toLowerCase() && c.key !== col.key);
                          if (dup) {
                            onToast?.('Duplicate column name');
                            return;
                          }
                          onRenameCustomColumn(subject.id, col.customId, l.trim());
                        }}
                        className="hover:text-dark-text text-left"
                      >
                        {col.label}
                      </button>
                      {onRemoveCustomColumn && (
                        <button
                          type="button"
                          onClick={() => setRemoveColumnTarget({ columnId: col.customId, label: col.label })}
                          className="text-dark-muted hover:text-red-400 p-0.5"
                          title="Remove column"
                          aria-label="Remove column"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              <th className={`w-12 ${py} px-2`} />
            </tr>
          </thead>
          <tbody>
            {filteredChapters.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length + 5} className={`${py} ${px} text-center text-dark-muted text-sm`}>
                  No chapters match the current filters.
                </td>
              </tr>
            ) : (
              filteredChapters.map((chapter, idx) => {
                const progress = getChapterProgress(chapter, subject);
                const isDragging = draggedId === chapter.id;
                const isDragOver = dragOverId === chapter.id;
                return (
                  <tr
                    key={chapter.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, chapter.id)}
                    onDragOver={(e) => handleDragOver(e, chapter.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, chapter.id)}
                    onDragEnd={handleDragEnd}
                    className={`border-b border-dark-border/80 hover:bg-dark-bg/30 transition-colors ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'bg-dark-accent/10' : ''}`}
                  >
                    <td className={`${py} ${px}`}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(chapter.id)}
                        onChange={() => toggleSelect(chapter.id)}
                        className="rounded border-dark-border text-dark-accent"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className={`${py} ${px} text-dark-muted`}>{idx + 1}</td>
                    <td className={`${py} ${px}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="text"
                          value={chapter.chapterName}
                          onChange={(e) => handleChapterNameChange(chapter.id, e.target.value)}
                          className="flex-1 min-w-0 bg-transparent border-none text-dark-text focus:outline-none focus:ring-0 p-0"
                        />
                        {chapter.type && (
                          <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-dark-border/80 text-dark-muted font-medium">
                            {chapter.type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`${py} ${px}`}>
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <div className="flex-1 h-1.5 bg-dark-border rounded-full overflow-hidden max-w-[60px]">
                          <div
                            className="h-full bg-dark-accent rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-dark-muted w-8">{progress}%</span>
                      </div>
                    </td>
                    <td className={`${py} ${px}`}>
                      <button
                        type="button"
                        onClick={() => handlePriorityToggle(chapter.id, !chapter.highPriority)}
                        className={`p-0.5 rounded ${chapter.highPriority ? 'text-amber-400' : 'text-dark-muted hover:text-dark-text'}`}
                        title={chapter.highPriority ? 'High priority' : 'Mark high priority'}
                      >
                        <StarIcon filled={!!chapter.highPriority} />
                      </button>
                    </td>
                    {allColumns.map((col) => (
                      <td key={col.key} className={`${py} ${px}`}>
                        {col.customId ? (
                          <input
                            type="checkbox"
                            checked={!!chapter.customFields?.[col.customId]}
                            onChange={(e) => handleCustomToggle(chapter.id, col.customId, e.target.checked)}
                            className="rounded border-dark-border text-dark-accent"
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={!!chapter[col.key]}
                            onChange={(e) => handleToggle(chapter.id, col.key, e.target.checked)}
                            className="rounded border-dark-border text-dark-accent"
                          />
                        )}
                      </td>
                    ))}
                    <td className={`${py} px-2`}>
                      <button
                        type="button"
                        onClick={() => onDeleteChapter(subject.id, chapter.id)}
                        className="text-dark-muted hover:text-red-400 transition-colors p-1"
                        aria-label="Delete chapter"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className={`p-3 border-t border-dark-border flex flex-wrap gap-2 ${compact ? 'py-2' : ''}`}>
        <button type="button" onClick={onAddChapter} className="px-3 py-1.5 text-sm border border-dark-border text-dark-muted hover:text-dark-text hover:bg-dark-bg/50 rounded-md transition-colors">
          + Add Chapter
        </button>
        <button
          type="button"
          onClick={() => {
            const label = prompt('New column name:');
            if (!label?.trim()) return;
            const dup = allColumns.some((c) => c.label.toLowerCase() === label.trim().toLowerCase());
            if (dup) {
              onToast?.('Duplicate column name');
              return;
            }
            onAddCustomColumn(subject.id, label.trim());
          }}
          className="px-3 py-1.5 text-sm border border-dark-border text-dark-muted hover:text-dark-text hover:bg-dark-bg/50 rounded-md transition-colors"
        >
          + Add Column
        </button>
      </div>

      {bulkDeleteConfirm && (
        <ConfirmModal
          open
          title="Delete selected chapters?"
          message={`${selectedIds.size} chapter(s) will be permanently deleted.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleBulkDeleteConfirm}
          onCancel={() => setBulkDeleteConfirm(false)}
        />
      )}

      {removeColumnTarget && (
        <ConfirmModal
          open
          title="Remove column?"
          message={`Remove "${removeColumnTarget.label}" from all chapters? This cannot be undone.`}
          confirmLabel="Remove"
          danger
          onConfirm={() => {
            onRemoveCustomColumn?.(subject.id, removeColumnTarget.columnId);
            setRemoveColumnTarget(null);
          }}
          onCancel={() => setRemoveColumnTarget(null)}
        />
      )}
    </div>
  );
}
