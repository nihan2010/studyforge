/**
 * @typedef {Object} Chapter
 * @property {string} id
 * @property {string} chapterName
 * @property {boolean} revised
 * @property {boolean} pyqDone
 * @property {boolean} examsAttended
 * @property {boolean} notesCompleted
 * @property {boolean} [highPriority]
 * @property {Record<string, boolean>} [customFields]
 */

/**
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} name
 * @property {Chapter[]} chapters
 * @property {{ id: string, label: string }[]} [customColumns]
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

export const BUILTIN_COLUMNS = [
  { key: 'revised', label: 'Revised' },
  { key: 'pyqDone', label: 'PYQs Done' },
  { key: 'examsAttended', label: 'Exams Attended' },
  { key: 'notesCompleted', label: 'Notes Completed' },
];
