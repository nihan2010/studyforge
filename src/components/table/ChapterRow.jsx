import { memo, useCallback } from 'react';

export const ChapterRow = memo(({
    chapter,
    subjectId,
    index,
    columns,
    isSelected,
    onToggleSelect,
    onUpdateChapter,
    onDeleteChapter,
    py,
    px,
    isDragging,
    isDragOver,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    getChapterProgress,
    StarIcon,
}) => {
    const progress = getChapterProgress(chapter, { columns });

    const handleToggle = (colId, value) => {
        const newFields = { ...(chapter.fields || {}), [colId]: value };
        onUpdateChapter(subjectId, chapter.id, { fields: newFields });
    };

    const handleTypeChange = (value) => {
        const newType = value === 'custom' ? (prompt('Enter custom type:') || chapter.type) : value;
        onUpdateChapter(subjectId, chapter.id, { type: newType });
    };

    return (
        <tr
            draggable
            onDragStart={(e) => onDragStart(e, chapter.id)}
            onDragOver={(e) => onDragOver(e, chapter.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, chapter.id)}
            onDragEnd={onDragEnd}
            className={`
        transition-colors duration-200 ease-in-out group bg-dark-card
        ${isDragging ? 'opacity-50' : 'hover:bg-dark-bg/30'} 
        ${isDragOver ? 'bg-dark-accent/10' : ''}
      `}
        >
            <td className={`${py} ${px}`}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(chapter.id)}
                    className="rounded border-dark-border text-dark-accent transition-transform duration-150 active:scale-90 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                />
            </td>
            <td className={`${py} ${px} text-dark-muted`}>{index + 1}</td>
            <td className={`${py} ${px}`}>
                <div className="flex items-center gap-2 min-w-0">
                    <input
                        type="text"
                        value={chapter.title || ''}
                        onChange={(e) => onUpdateChapter(subjectId, chapter.id, { title: e.target.value })}
                        className="flex-1 min-w-0 bg-transparent border-none text-dark-text focus:outline-none focus:ring-0 p-0 placeholder-dark-muted/50 font-medium"
                        placeholder="Untitled Chapter"
                    />
                    <div className="relative group/type shrink-0">
                        <select
                            value={['Poem', 'Prose', 'Drama', 'Skill'].includes(chapter.type) ? chapter.type : 'custom'}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="appearance-none bg-dark-border/50 text-[10px] px-2 py-0.5 rounded text-dark-muted font-medium hover:bg-dark-border cursor-pointer focus:outline-none border-none pr-4"
                        >
                            <option value="Poem">Poem</option>
                            <option value="Prose">Prose</option>
                            <option value="Drama">Drama</option>
                            <option value="Skill">Skill</option>
                            <option value="custom">{!['Poem', 'Prose', 'Drama', 'Skill'].includes(chapter.type) && chapter.type ? chapter.type : 'Custom'}</option>
                        </select>
                    </div>
                </div>
            </td>
            <td className={`${py} ${px}`}>
                <div className="flex items-center gap-2 min-w-[80px]">
                    <div className="flex-1 h-1.5 bg-dark-border rounded-full overflow-hidden max-w-[60px]">
                        <div
                            className="h-full bg-dark-accent rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-xs text-dark-muted w-8 text-right">{progress}%</span>
                </div>
            </td>
            <td className={`${py} ${px}`}>
                <button
                    type="button"
                    onClick={() => onUpdateChapter(subjectId, chapter.id, { highPriority: !chapter.highPriority })}
                    className="p-1 rounded hover:bg-dark-bg/50 transition-colors"
                    title={chapter.highPriority ? 'High priority' : 'Mark high priority'}
                >
                    <StarIcon filled={!!chapter.highPriority} />
                </button>
            </td>
            {columns.map((col) => (
                <td key={col.id} className={`${py} ${px} text-center`}>
                    <input
                        type="checkbox"
                        checked={!!chapter.fields?.[col.id]}
                        onChange={(e) => handleToggle(col.id, e.target.checked)}
                        className="rounded border-dark-border text-dark-accent transition-transform duration-150 active:scale-90 cursor-pointer"
                    />
                </td>
            ))}
            <td className={`${py} px-2`}>
                <button
                    type="button"
                    onClick={() => onDeleteChapter(subjectId, chapter.id)}
                    className="text-dark-muted hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                    aria-label="Delete chapter"
                >
                    ×
                </button>
            </td>
        </tr>
    );
}, (prev, next) => {
    return (
        prev.chapter === next.chapter &&
        prev.isSelected === next.isSelected &&
        prev.index === next.index &&
        prev.isDragging === next.isDragging &&
        prev.isDragOver === next.isDragOver &&
        prev.columns === next.columns
    );
});
