import { useMemo } from 'react';
import { useActivityContext } from '../context/ActivityContext';

export function ActivityGrid({ weeks = 12 }) {
  const { getActivityGrid } = useActivityContext();
  const grid = useMemo(() => getActivityGrid(weeks, 7), [getActivityGrid, weeks]);
  const maxCount = useMemo(() => Math.max(1, ...grid.flat().map((c) => c.count)), [grid]);

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-4">
      <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-3">Daily activity</h3>
      <div className="flex gap-0.5 overflow-x-auto pb-1">
        {grid.map((row, wi) => (
          <div key={wi} className="flex flex-col gap-0.5 shrink-0">
            {row.map((cell) => (
              <div
                key={cell.key}
                className={`w-2.5 h-2.5 rounded-sm transition-colors ${
                  cell.isToday ? 'ring-1 ring-dark-accent ring-offset-1 ring-offset-dark-card' : ''
                } ${
                  cell.count === 0
                    ? 'bg-dark-border/50'
                    : cell.count <= maxCount * 0.25
                    ? 'bg-dark-accent/40'
                    : cell.count <= maxCount * 0.5
                    ? 'bg-dark-accent/60'
                    : cell.count <= maxCount * 0.75
                    ? 'bg-dark-accent/80'
                    : 'bg-dark-accent'
                }`}
                title={`${cell.key}: ${cell.count} update(s)`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs text-dark-muted mt-2">Less → More</p>
    </div>
  );
}
