export function ColumnHeader({ col, onRename, onRemove, canRemove }) {
    return (
        <th className="text-left py-2 px-3 font-medium text-dark-muted whitespace-nowrap group/col min-w-[80px]">
            <div className="flex items-center gap-1 justify-between">
                <button
                    type="button"
                    onClick={() => onRename(col)}
                    className="hover:text-dark-text text-left truncate max-w-[100px]"
                    title="Click to rename"
                >
                    {col.label}
                </button>
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(col)}
                        className="text-dark-border group-hover/col:text-dark-muted hover:!text-red-400 p-0.5 opacity-0 group-hover/col:opacity-100 transition-all"
                        title="Remove column"
                        aria-label="Remove column"
                    >
                        ×
                    </button>
                )}
            </div>
        </th>
    );
}
