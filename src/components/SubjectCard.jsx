import { Link } from 'react-router-dom';
import { getSubjectStats } from '../utils/progress';

export function SubjectCard({ subject }) {
  const totalChapters = (subject.chapters || []).length;
  const { overall: completion } = getSubjectStats(subject);
  const isComplete = completion >= 100 && totalChapters > 0;

  return (
    <Link
      to={`/subject/${subject.id}`}
      className="block bg-dark-card border border-dark-border rounded-lg p-5 hover:border-dark-accent/50 transition-all duration-200 animate-slide-up group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-dark-text truncate group-hover:text-dark-accent transition-colors">
            {subject.name}
          </h3>
          <p className="text-sm text-dark-muted mt-0.5">
            {totalChapters} chapter{totalChapters !== 1 ? 's' : ''}
          </p>
        </div>
        {isComplete && (
          <span className="shrink-0 text-xs font-medium px-2 py-1 rounded bg-emerald-500/20 text-emerald-400">
            Complete
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-dark-muted mb-1">
          <span>Progress</span>
          <span className="font-medium text-dark-text">{completion}%</span>
        </div>
        <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
          <div
            className="h-full bg-dark-accent rounded-full transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
