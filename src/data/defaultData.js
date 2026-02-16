import { DEFAULT_SUBJECT_NAMES, STORAGE_KEY } from '../types';
import { getSyllabusForProfile } from './syllabusData';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const DEFAULT_COLUMNS = [
  { id: 'revised', label: 'Revised' },
  { id: 'pyqs', label: 'PYQs Done' },
  { id: 'exams', label: 'Exams Attended' },
  { id: 'notes', label: 'Notes Completed' },
];

export function buildEmptyFields(columns = []) {
  return Object.fromEntries(columns.map((c) => [c.id, false]));
}

export function createChapter(overrides = {}, columns = DEFAULT_COLUMNS) {
  return {
    id: generateId(),
    title: 'New Chapter',
    type: undefined,
    fields: buildEmptyFields(columns),
    highPriority: false,
    ...overrides,
  };
}

export function createSubject(name, overrides = {}) {
  const columns = overrides.columns && Array.isArray(overrides.columns) && overrides.columns.length > 0
    ? overrides.columns
    : DEFAULT_COLUMNS;

  return {
    id: generateId(),
    name,
    columns,
    chapters: [],
    lastUpdated: new Date().toISOString(),
    examDate: null,
    ...overrides,
  };
}

export function getDefaultData() {
  return {
    subjects: DEFAULT_SUBJECT_NAMES.map((name) => createSubject(name)),
  };
}

/**
 * Generate subjects and chapters from SCERT syllabus. Prevents duplicate by returning
 * fresh subject IDs and chapter IDs each time (caller should replace data).
 */
export function generateSubjectsFromSyllabus(classKey, streamKey, language) {
  try {
    const list = getSyllabusForProfile(classKey, streamKey, language);
    return list.map(({ name, chapters }) =>
      createSubject(name, {
        columns: DEFAULT_COLUMNS,
        chapters: chapters.map((ch) =>
          createChapter(
            typeof ch === 'string'
              ? { title: ch }
              : { title: ch.chapterName, type: ch.type },
            DEFAULT_COLUMNS
          )
        ),
      })
    );
  } catch (e) {
    console.error('Syllabus generation failed', e);
    return [];
  }
}

function migrateSubject(s) {
  const legacyCustomColumns = s.customColumns || [];
  let columns = s.columns;

  if (!columns || !Array.isArray(columns) || columns.length === 0) {
    // Start from default dynamic columns
    columns = [...DEFAULT_COLUMNS];
    // Append any existing custom columns as dynamic columns
    legacyCustomColumns.forEach((col) => {
      if (col && col.id && !columns.some((c) => c.id === col.id)) {
        columns.push({ id: col.id, label: col.label || 'Custom' });
      }
    });
  }

  const chapters = (s.chapters || []).map((ch) => {
    // Start with existing fields or empty object
    const existingFields = ch.fields || {};
    const fields = { ...existingFields };

    columns.forEach((col) => {
      // If field exists in ch.fields, keep it.
      // If not, check legacy root property.
      // If neither, default to false (only if not already set).
      if (fields[col.id] === undefined) {
        let legacyVal = undefined;
        switch (col.id) {
          case 'revised': legacyVal = ch.revised; break;
          case 'pyqs': legacyVal = ch.pyqDone ?? ch.pyqs; break;
          case 'exams': legacyVal = ch.examsAttended ?? ch.exams; break;
          case 'notes': legacyVal = ch.notesCompleted ?? ch.notes; break;
          default: legacyVal = ch.customFields?.[col.id]; break;
        }
        fields[col.id] = legacyVal !== undefined ? !!legacyVal : false;
      }
    });

    return {
      id: ch.id || generateId(),
      title: ch.title || ch.chapterName || 'Untitled',
      type: ch.type,
      fields,
      highPriority: !!ch.highPriority,
    };
  });

  return {
    id: s.id || generateId(),
    name: s.name || 'Untitled Subject',
    columns,
    chapters,
    lastUpdated: s.lastUpdated || new Date().toISOString(),
    examDate: s.examDate ?? null,
  };
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.subjects)) return null;
    data.subjects = data.subjects.map(migrateSubject);
    return data;
  } catch {
    return null;
  }
}

export function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export { generateId };
