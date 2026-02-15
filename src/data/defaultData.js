import { DEFAULT_SUBJECT_NAMES, STORAGE_KEY } from '../types';
import { getSyllabusForProfile } from './syllabusData';

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createChapter(overrides = {}) {
  return {
    id: generateId(),
    chapterName: 'New Chapter',
    type: undefined,
    revised: false,
    pyqDone: false,
    examsAttended: false,
    notesCompleted: false,
    highPriority: false,
    customFields: {},
    ...overrides,
  };
}

export function createSubject(name, overrides = {}) {
  return {
    id: generateId(),
    name,
    chapters: [],
    customColumns: [],
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
        chapters: chapters.map((ch) =>
          createChapter(
            typeof ch === 'string' ? { chapterName: ch } : { chapterName: ch.chapterName, type: ch.type }
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
  return {
    ...s,
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
