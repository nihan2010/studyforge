import { BUILTIN_COLUMNS } from '../types';

/** Returns 0-100 progress for a single chapter based on checked fields / total fields */
export function getChapterProgress(chapter, subject) {
  const customCols = subject.customColumns || [];
  const total = BUILTIN_COLUMNS.length + customCols.length;
  if (total === 0) return 0;
  let checked = 0;
  BUILTIN_COLUMNS.forEach((col) => {
    if (chapter[col.key]) checked++;
  });
  customCols.forEach((col) => {
    if (chapter.customFields?.[col.id]) checked++;
  });
  return Math.round((checked / total) * 100);
}

/** Heat: 'cold' | 'medium' | 'active' based on lastUpdated */
export function getHeat(lastUpdated) {
  if (!lastUpdated) return 'cold';
  const updated = new Date(lastUpdated);
  const now = new Date();
  const diffDays = (now - updated) / (1000 * 60 * 60 * 24);
  if (diffDays >= 3) return 'cold';
  if (diffDays >= 1) return 'medium';
  return 'active';
}

/** Weakest metric across all subjects: { subjectName, metric, label, value } */
export function getWeakestMetric(subjects) {
  let weakest = null;
  let minPct = 101;
  const metrics = [
    { key: 'revisedPct', label: 'Revised' },
    { key: 'pyqPct', label: 'PYQs' },
    { key: 'examsPct', label: 'Exams Attended' },
    { key: 'notesPct', label: 'Notes' },
  ];
  subjects.forEach((s) => {
    const stats = getSubjectStats(s);
    metrics.forEach((m) => {
      const v = stats[m.key];
      if (stats.total > 0 && v < minPct) {
        minPct = v;
        weakest = { subjectName: s.name, subjectId: s.id, metric: m.key, label: m.label, value: v };
      }
    });
  });
  return weakest;
}

/** Days until exam date (can be negative if past) */
export function daysRemaining(examDate) {
  if (!examDate) return null;
  const exam = new Date(examDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  return Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
}

/** Chapters per day needed to complete 100% by exam date */
export function chaptersPerDayToFinish(subject) {
  const days = daysRemaining(subject.examDate);
  if (days == null || days <= 0) return null;
  const stats = getSubjectStats(subject);
  const totalChecks = stats.total * 4; // simplified: 4 main fields
  const remaining = totalChecks - (stats.revised + stats.pyqDone + stats.examsAttended + stats.notesCompleted);
  if (remaining <= 0) return 0;
  const chaptersRemaining = subject.chapters?.length ?? 0;
  return chaptersRemaining > 0 ? (remaining / 4 / days).toFixed(1) : null;
}

export function getSubjectStats(subject) {
  const chapters = subject.chapters || [];
  const customColumns = subject.customColumns || [];
  const total = chapters.length;

  const revised = chapters.filter((c) => c.revised).length;
  const pyqDone = chapters.filter((c) => c.pyqDone).length;
  const examsAttended = chapters.filter((c) => c.examsAttended).length;
  const notesCompleted = chapters.filter((c) => c.notesCompleted).length;

  const customCounts = {};
  customColumns.forEach((col) => {
    customCounts[col.id] = chapters.filter((c) => c.customFields?.[col.id]).length;
  });

  const builtinChecks = revised + pyqDone + examsAttended + notesCompleted;
  const customChecks = customColumns.reduce(
    (sum, col) => sum + (customCounts[col.id] || 0),
    0
  );
  const totalPossible = total * (BUILTIN_COLUMNS.length + customColumns.length);
  const overall =
    totalPossible === 0
      ? 0
      : Math.round(((builtinChecks + customChecks) / totalPossible) * 100);

  const weightedMax = total * (1 + 1.5 + 2 + 1);
  const studyScore = weightedMax === 0 ? 0 : Math.round(((revised * 1 + pyqDone * 1.5 + examsAttended * 2 + notesCompleted * 1) / weightedMax) * 100);

  return {
    total,
    revisedPct: total === 0 ? 0 : Math.round((revised / total) * 100),
    pyqPct: total === 0 ? 0 : Math.round((pyqDone / total) * 100),
    examsPct: total === 0 ? 0 : Math.round((examsAttended / total) * 100),
    notesPct: total === 0 ? 0 : Math.round((notesCompleted / total) * 100),
    customCounts,
    overall,
    revised,
    pyqDone,
    examsAttended,
    notesCompleted,
    studyScore,
  };
}

export function getGlobalStats(subjects) {
  let totalChapters = 0;
  let totalChecked = 0;
  let totalPossible = 0;
  let totalPyqs = 0;
  const subjectCompletions = [];

  subjects.forEach((s) => {
    const chapters = s.chapters || [];
    const customCols = s.customColumns || [];
    const perChapter = 4 + customCols.length;
    totalChapters += chapters.length;
    chapters.forEach((ch) => {
      totalPossible += perChapter;
      if (ch.revised) totalChecked++;
      if (ch.pyqDone) {
        totalChecked++;
        totalPyqs++;
      }
      if (ch.examsAttended) totalChecked++;
      if (ch.notesCompleted) totalChecked++;
      customCols.forEach((col) => {
        if (ch.customFields?.[col.id]) totalChecked++;
      });
    });
    const overall = getSubjectStats(s).overall;
    subjectCompletions.push({ id: s.id, name: s.name, overall });
  });

  const syllabusPct =
    totalPossible === 0 ? 0 : Math.round((totalChecked / totalPossible) * 100);

  const sorted = [...subjectCompletions].sort((a, b) => b.overall - a.overall);
  const mostCompleted = sorted[0];
  const leastCompleted = sorted[sorted.length - 1];

  return {
    totalChapters,
    totalChecked,
    totalPossible,
    totalPyqs,
    syllabusPct,
    mostCompleted: mostCompleted || null,
    leastCompleted: leastCompleted || null,
  };
}
