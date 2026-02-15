import { useState, useEffect, useCallback } from 'react';
import {
  getDefaultData,
  loadFromStorage,
  saveToStorage,
  createSubject,
  createChapter,
  generateId,
} from '../data/defaultData';

export function useLocalStorage() {
  const [data, setDataState] = useState(() => {
    const stored = loadFromStorage();
    return stored || getDefaultData();
  });

  useEffect(() => {
    saveToStorage(data);
  }, [data]);

  const setData = useCallback((updater) => {
    setDataState((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const addSubject = useCallback((name) => {
    setDataState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, createSubject(name)],
    }));
  }, []);

  const setExamDate = useCallback((subjectId, examDate) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId ? { ...s, examDate, lastUpdated: new Date().toISOString() } : s
      ),
    }));
  }, []);

  const reorderChapters = useCallback((subjectId, chapterIds) => {
    setDataState((prev) => {
      const sub = prev.subjects.find((s) => s.id === subjectId);
      if (!sub) return prev;
      const orderMap = new Map(chapterIds.map((id, i) => [id, i]));
      const sorted = [...sub.chapters].sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
      return {
        ...prev,
        subjects: prev.subjects.map((s) =>
          s.id === subjectId
            ? { ...s, chapters: sorted, lastUpdated: new Date().toISOString() }
            : s
        ),
      };
    });
  }, []);

  const bulkUpdateChapters = useCallback((subjectId, chapterIds, updates) => {
    const idSet = new Set(chapterIds);
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              lastUpdated: new Date().toISOString(),
              chapters: s.chapters.map((c) =>
                idSet.has(c.id) ? { ...c, ...updates } : c
              ),
            }
          : s
      ),
    }));
  }, []);

  const bulkDeleteChapters = useCallback((subjectId, chapterIds) => {
    const idSet = new Set(chapterIds);
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              lastUpdated: new Date().toISOString(),
              chapters: s.chapters.filter((c) => !idSet.has(c.id)),
            }
          : s
      ),
    }));
  }, []);

  const touchSubject = useCallback((subjectId) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId ? { ...s, lastUpdated: new Date().toISOString() } : s
      ),
    }));
  }, []);

  const updateSubject = useCallback((subjectId, updates) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId ? { ...s, ...updates, lastUpdated: new Date().toISOString() } : s
      ),
    }));
  }, []);

  const deleteSubject = useCallback((subjectId) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== subjectId),
    }));
  }, []);

  const addChapter = useCallback((subjectId, chapterOverrides = {}) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              lastUpdated: new Date().toISOString(),
              chapters: [...s.chapters, createChapter(chapterOverrides)],
            }
          : s
      ),
    }));
  }, []);

  const updateChapter = useCallback((subjectId, chapterId, updates) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              lastUpdated: new Date().toISOString(),
              chapters: s.chapters.map((c) =>
                c.id === chapterId ? { ...c, ...updates } : c
              ),
            }
          : s
      ),
    }));
  }, []);

  const deleteChapter = useCallback((subjectId, chapterId) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              lastUpdated: new Date().toISOString(),
              chapters: s.chapters.filter((c) => c.id !== chapterId),
            }
          : s
      ),
    }));
  }, []);

  const addCustomColumn = useCallback((subjectId, label) => {
    const id = generateId();
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => {
        if (s.id !== subjectId) return s;
        const customColumns = [...(s.customColumns || []), { id, label }];
        const chapters = s.chapters.map((c) => ({
          ...c,
          customFields: { ...(c.customFields || {}), [id]: false },
        }));
        return { ...s, customColumns, chapters, lastUpdated: new Date().toISOString() };
      }),
    }));
  }, []);

  const renameCustomColumn = useCallback((subjectId, columnId, newLabel) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              lastUpdated: new Date().toISOString(),
              customColumns: (s.customColumns || []).map((col) =>
                col.id === columnId ? { ...col, label: newLabel } : col
              ),
            }
          : s
      ),
    }));
  }, []);

  const removeCustomColumn = useCallback((subjectId, columnId) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => {
        if (s.id !== subjectId) return s;
        const customColumns = (s.customColumns || []).filter((c) => c.id !== columnId);
        const chapters = s.chapters.map((c) => {
          const { [columnId]: _, ...rest } = c.customFields || {};
          return { ...c, customFields: rest };
        });
        return { ...s, customColumns, chapters };
      }),
    }));
  }, []);

  const resetSubjectProgress = useCallback((subjectId) => {
    setDataState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => {
        if (s.id !== subjectId) return s;
        return {
          ...s,
          lastUpdated: new Date().toISOString(),
          chapters: s.chapters.map((ch) => ({
            ...ch,
            revised: false,
            pyqDone: false,
            examsAttended: false,
            notesCompleted: false,
            customFields: Object.fromEntries(
              Object.keys(ch.customFields || {}).map((k) => [k, false])
            ),
          })),
        };
      }),
    }));
  }, []);

  const importData = useCallback((imported) => {
    if (imported?.subjects?.length) setDataState(imported);
  }, []);

  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  return {
    data,
    setData,
    addSubject,
    updateSubject,
    deleteSubject,
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
    resetSubjectProgress,
    importData,
    exportData,
  };
}
