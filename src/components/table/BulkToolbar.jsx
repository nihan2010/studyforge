import { memo } from 'react';

export const BulkToolbar = memo(({
    selectedCount,
    columns,
    onBulkUpdate,
    onBulkDelete,
    onClearSelection,
    subjectId,
    selectedIds,
    setBulkDeleteConfirm,
}) => {
    if (selectedCount === 0) return null;

    const handleBulkAction = (action, value) => {
        // action is columnId, value is boolean
        onBulkUpdate(subjectId, [...selectedIds], (chapter) => ({
            ...chapter,
            fields: { ...(chapter.fields || {}), [action]: value }
        }));
        onClearSelection();
    };

    const handleMarkAllComplete = () => {
        onBulkUpdate(subjectId, [...selectedIds], (chapter) => {
            const newFields = { ...(chapter.fields || {}) };
            columns.forEach(col => newFields[col.id] = true);
            return { ...chapter, fields: newFields };
        });
        onClearSelection();
    };

    const handleResetAll = () => {
        onBulkUpdate(subjectId, [...selectedIds], (chapter) => {
            const newFields = { ...(chapter.fields || {}) };
            columns.forEach(col => newFields[col.id] = false);
            return { ...chapter, fields: newFields };
        });
        onClearSelection();
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-dark-bg/50 border-b border-dark-border text-sm animate-fade-in">
            <span className="text-dark-muted font-medium mr-2">{selectedCount} selected</span>

            <div className="flex gap-1 overflow-x-auto pb-1 max-w-[60vw] no-scrollbar">
                <button
                    onClick={handleMarkAllComplete}
                    className="whitespace-nowrap px-3 py-1.5 border border-emerald-500/30 text-emerald-400 rounded-md hover:bg-emerald-500/10 transition-colors text-xs"
                >
                    ✓ All Complete
                </button>
                <button
                    onClick={handleResetAll}
                    className="whitespace-nowrap px-3 py-1.5 border border-dark-border text-dark-muted rounded-md hover:bg-dark-card transition-colors text-xs"
                >
                    ↺ Reset
                </button>

                <div className="w-px h-6 bg-dark-border mx-1 self-center"></div>

                {columns.map(col => (
                    <div key={col.id} className="flex rounded-md border border-dark-border overflow-hidden shrink-0">
                        <button
                            onClick={() => handleBulkAction(col.id, true)}
                            className="px-2 py-1.5 hover:bg-dark-card text-dark-text text-xs border-r border-dark-border/50 transition-colors"
                            title={`Mark all as ${col.label}`}
                        >
                            + {col.label}
                        </button>
                        <button
                            onClick={() => handleBulkAction(col.id, false)}
                            className="px-2 py-1.5 hover:bg-dark-card text-dark-muted hover:text-red-400 text-xs transition-colors"
                            title={`Unmark all ${col.label}`}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex-1"></div>

            <button
                type="button"
                onClick={() => setBulkDeleteConfirm(true)}
                className="whitespace-nowrap px-3 py-1.5 border border-red-500/50 text-red-400 rounded-md hover:bg-red-500/10 transition-colors ml-auto"
            >
                Delete Selected
            </button>
            <button
                type="button"
                onClick={onClearSelection}
                className="whitespace-nowrap px-3 py-1.5 text-dark-muted hover:text-dark-text transition-colors"
            >
                Cancel
            </button>
        </div>
    );
});
