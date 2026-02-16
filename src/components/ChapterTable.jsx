import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { getChapterProgress } from '../utils/progress';
import { ConfirmModal } from './ui/ConfirmModal';
import { ChapterRow } from './table/ChapterRow';
import { BulkToolbar } from './table/BulkToolbar';
import { ColumnHeader } from './table/ColumnHeader';
import { DEFAULT_COLUMNS } from '../types';

function StarIcon({ filled }) {
  return (
    <svg className={`w-4 h-4 transition-colors duration-200 ${filled ? 'text-amber-400' : 'text-dark-muted group-hover:text-dark-text'}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
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
  // Use subject.columns as the single source of truth. Fallback to DEFAULT only if empty initially (which shouldn't happen with proper migration)
  const columns = useMemo(() => subject.columns || DEFAULT_COLUMNS, [subject.columns]);

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

  const handleRenameColumn = (col) => {
    const l = prompt('Rename column:', col.label);
    if (!l?.trim()) return;
    const dup = columns.some((c) => c.label.toLowerCase() === l.trim().toLowerCase() && c.id !== col.id);
    if (dup) {
      onToast?.('Duplicate column name');
      return;
    }
    onRenameCustomColumn(subject.id, col.id, l.trim());
  };

  const handleRemoveColumn = (col) => {
    setRemoveColumnTarget({ columnId: col.id, label: col.label });
  };

  const handleAddNewColumn = () => {
    const label = prompt('New column name:');
    if (!label?.trim()) return;
    const dup = columns.some((c) => c.label.toLowerCase() === label.trim().toLowerCase());
    if (dup) {
      onToast?.('Duplicate column name');
      return;
    }
    onAddCustomColumn(subject.id, label.trim());
  };

  const py = compact ? 'py-1.5' : 'py-2';
  const px = compact ? 'px-3' : 'px-4';

  return (
    <div className="border border-dark-border rounded-lg bg-dark-card animate-fade-in flex flex-col h-full overflow-hidden">
      <BulkToolbar
        selectedCount={selectedIds.size}
        columns={columns}
        onBulkUpdate={onBulkUpdate}
        onBulkDelete={onBulkDelete}
        onClearSelection={clearSelection}
        subjectId={subject.id}
        selectedIds={selectedIds}
        setBulkDeleteConfirm={setBulkDeleteConfirm}
      />

      <div className="flex-1 overflow-auto">
        <table className="min-w-full table-fixed border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-dark-card shadow-sm">
            <tr className="border-b border-dark-border">
              <th className={`text-left ${py} ${px} w-10 text-center`}>
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={filteredChapters.length > 0 && selectedIds.size === filteredChapters.length}
                  onChange={toggleSelectAll}
                  className="rounded border-dark-border text-dark-accent cursor-pointer align-middle"
                />
              </th>
              <th className={`text-left ${py} ${px} font-medium text-dark-muted w-12 text-center`}>#</th>
              <th className={`text-left ${py} ${px} font-medium text-dark-text w-[300px]`}>Chapter Name & Type</th>
              <th className={`text-right ${py} ${px} font-medium text-dark-muted w-28`}>Progress</th>
              <th className={`text-center ${py} ${px} font-medium text-dark-muted w-12`} title="High Priority">★</th>

              {columns.map((col) => (
                <ColumnHeader
                  key={col.id}
                  col={col}
                  onRename={handleRenameColumn}
                  onRemove={handleRemoveColumn}
                  canRemove={columns.length > 1} // Prevent removing last column
                />
              ))}

              <th className={`w-12 ${py} px-2`} />
            </tr>
          </thead>
          <tbody>
            {filteredChapters.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 6} className={`${py} ${px} text-center text-dark-muted text-sm`}>
                  No chapters match the current filters.
                </td>
              </tr>
            ) : (
              filteredChapters.map((chapter, idx) => (
                <ChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  subjectId={subject.id}
                  index={idx}
                  columns={columns}
                  isSelected={selectedIds.has(chapter.id)}
                  onToggleSelect={toggleSelect}
                  onUpdateChapter={onUpdateChapter}
                  onDeleteChapter={onDeleteChapter}
                  py={py}
                  px={px}
                  isDragging={draggedId === chapter.id}
                  isDragOver={dragOverId === chapter.id}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  getChapterProgress={getChapterProgress}
                  StarIcon={StarIcon}
                />
              ))
            )}
          </tbody>
          <tfoot className="bg-dark-bg/30 border-t border-dark-border sticky bottom-0 z-10">
            <tr>
              <td colSpan={5}></td>
              <td colSpan={columns.length + 1} className="p-2 text-right">
                <button
                  type="button"
                  onClick={handleAddNewColumn}
                  className="text-xs inline-flex items-center gap-1 text-dark-muted hover:text-dark-accent transition-colors px-2 py-1 rounded hover:bg-dark-bg/50"
                >
                  + Add New Tracker Column
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={`p-3 border-t border-dark-border flex flex-wrap gap-2 shrink-0 bg-dark-card ${compact ? 'py-2' : ''}`}>
        <button type="button" onClick={onAddChapter} className="flex items-center gap-2 px-3 py-1.5 text-sm border border-dark-border text-dark-muted hover:text-dark-text hover:bg-dark-bg/50 rounded-md transition-colors">
          <span className="text-lg leading-none">+</span> Add Chapter
        </button>
      </div>

      {bulkDeleteConfirm && (
        <ConfirmModal
          open
          title="Delete selected chapters?"
          message={`${selectedIds.size} chapter(s) will be permanently deleted.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            onBulkDelete(subject.id, [...selectedIds]);
            clearSelection();
            setBulkDeleteConfirm(false);
          }}
          onCancel={() => setBulkDeleteConfirm(false)}
        />
      )}

      {removeColumnTarget && (
        <ConfirmModal
          open
          title="Remove column?"
          message={`Are you sure you want to remove the "${removeColumnTarget.label}" column? All data associated with this column will be lost.`}
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
