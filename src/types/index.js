/**
 * @typedef {Object} Chapter
 * @property {string} id
 * @property {string} title
 * @property {string} [type] Displayed chapter type badge (e.g. "Prose", "Poem")
 * @property {Record<string, boolean>} fields Dynamic completion fields keyed by column id
 * @property {boolean} [highPriority]
 */

/**
 * @typedef {Object} SubjectColumn
 * @property {string} id Stable column identifier (used as key in Chapter.fields)
 * @property {string} label Display name for the column
 */

/**
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} name
 * @property {SubjectColumn[]} columns
 * @property {Chapter[]} chapters
 * @property {string} [lastUpdated] ISO date string
 * @property {string|null} [examDate] ISO date string or null
 */

/**
 * @typedef {Object} AppData
 * @property {Subject[]} subjects
 */

export const STORAGE_KEY = 'study-syllabus-tracker-data';
export const SETTINGS_STORAGE_KEY = 'study-syllabus-tracker-settings';
export const BACKUP_REMINDER_KEY = 'study-syllabus-tracker-last-backup-reminder';
export const PROFILE_STORAGE_KEY = 'study-syllabus-tracker-profile';
export const ACTIVITY_STORAGE_KEY = 'study-syllabus-tracker-activity';

export const DEFAULT_SUBJECT_NAMES = [
  'Maths',
  'Computer Science',
  'Chemistry',
  'Physics',
  'English',
  'Malayalam',
];

// BUILTIN_COLUMNS removed to support fully dynamic columns
export const DEFAULT_COLUMNS = [
  { id: 'revised', label: 'Revised' },
  { id: 'pyqs', label: 'PYQs Done' },
  { id: 'exams', label: 'Exams Attended' },
  { id: 'notes', label: 'Notes Completed' },
];
