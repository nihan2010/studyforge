import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getSubjectStats, getHeat, getWeakestMetric, daysRemaining, chaptersPerDayToFinish } from '../utils/progress';

function CircularProgress({ value, label, size = 80 }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-dark-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-dark-accent transition-all duration-500"
        />
      </svg>
      <span className="text-lg font-bold text-dark-text mt-2">{value}%</span>
      <span className="text-xs text-dark-muted">{label}</span>
    </div>
  );
}

const HEAT_CONFIG = {
  cold: { label: 'Cold', color: 'text-red-400', bg: 'bg-red-500/20' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  active: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
};

export function ProgressPanel({ subject, allSubjects = [] }) {
  const stats = useMemo(() => getSubjectStats(subject), [subject]);
  const heat = useMemo(() => getHeat(subject.lastUpdated), [subject.lastUpdated]);
  const subjectWeakest = useMemo(() => getWeakestMetric([subject]), [subject]);
  const daysLeft = useMemo(() => daysRemaining(subject.examDate), [subject.examDate]);
  const chaptersPerDay = useMemo(() => chaptersPerDayToFinish(subject), [subject]);

  const barData = useMemo(() => {
    return [
      { name: 'Revised', value: stats.revisedPct, fill: '#3b82f6' },
      { name: 'PYQs', value: stats.pyqPct, fill: '#3b82f6' },
      { name: 'Exams', value: stats.examsPct, fill: '#3b82f6' },
      { name: 'Notes', value: stats.notesPct, fill: '#3b82f6' },
    ];
  }, [stats.revisedPct, stats.pyqPct, stats.examsPct, stats.notesPct]);

  const heatStyle = HEAT_CONFIG[heat] || HEAT_CONFIG.cold;

  return (
    <div className="space-y-6">
      <div className="bg-dark-card border border-dark-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider">
            Overall Completion
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${heatStyle.bg} ${heatStyle.color}`} title={`Last updated: ${subject.lastUpdated || '—'}`}>
            {heat === 'active' ? '🟢' : heat === 'medium' ? '🟡' : '🔴'} {heatStyle.label}
          </span>
        </div>
        <div className="flex justify-center">
          <CircularProgress value={stats.overall} label="Overall" size={120} />
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg p-5">
        <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">
          Stats
        </h3>
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between">
            <span className="text-dark-muted">Total Chapters</span>
            <span className="font-semibold text-dark-text">{stats.total}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-dark-muted">Chapters Revised %</span>
            <span className="font-semibold text-dark-text">{stats.revisedPct}%</span>
          </li>
          <li className="flex justify-between">
            <span className="text-dark-muted">PYQs Completion %</span>
            <span className="font-semibold text-dark-text">{stats.pyqPct}%</span>
          </li>
          <li className="flex justify-between">
            <span className="text-dark-muted">Exams Attended %</span>
            <span className="font-semibold text-dark-text">{stats.examsPct}%</span>
          </li>
          <li className="flex justify-between">
            <span className="text-dark-muted">Notes Completion %</span>
            <span className="font-semibold text-dark-text">{stats.notesPct}%</span>
          </li>
          <li className="flex justify-between pt-2 border-t border-dark-border/50">
            <span className="text-dark-muted">Study Score (weighted)</span>
            <span className="font-semibold text-dark-text">{stats.studyScore ?? 0}%</span>
          </li>
        </ul>
      </div>

      {subject.examDate && daysLeft != null && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">Deadline</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-dark-muted">Days remaining</span>
              <span className="font-semibold text-dark-text">{daysLeft > 0 ? daysLeft : 'Passed'}</span>
            </p>
            {daysLeft > 0 && chaptersPerDay != null && (
              <p className="flex justify-between">
                <span className="text-dark-muted">Chapters/day to finish</span>
                <span className="font-semibold text-dark-text">{chaptersPerDay}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {subjectWeakest && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-5">
          <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-2">Insight</h3>
          <p className="text-sm text-dark-muted">
            Your weakest area: <span className="text-dark-text font-medium">{subjectWeakest.label}</span> ({subjectWeakest.value}%)
          </p>
        </div>
      )}

      <div className="bg-dark-card border border-dark-border rounded-lg p-5">
        <h3 className="text-sm font-medium text-dark-muted uppercase tracking-wider mb-4">
          Weekly Progress
        </h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <XAxis dataKey="name" tick={{ fill: '#6b6b6b', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b6b6b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: 8 }}
                labelStyle={{ color: '#e5e5e5' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Bar dataKey="value" radius={4}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
