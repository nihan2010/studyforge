/**
 * Syllabus API: reads from read-only master. Never mutates master data.
 * User data is a copy; deleting chapters only affects user state.
 */
import { getMasterSyllabusForProfile, SYLLABUS_MASTER } from './syllabusMasterData';

export const SYLLABUS = SYLLABUS_MASTER;

export function getSyllabusForProfile(classKey, streamKey, language) {
  return getMasterSyllabusForProfile(classKey, streamKey, language);
}

export const CLASS_OPTIONS = [
  { value: 'plusOne', label: 'Plus One' },
  { value: 'plusTwo', label: 'Plus Two' },
  { value: 'custom', label: 'Custom' },
];

export const STREAM_OPTIONS = [
  { value: 'computerScience', label: 'Computer Science' },
  { value: 'bioScience', label: 'Bio Science' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'humanities', label: 'Humanities' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'arabic', label: 'Arabic' },
];
