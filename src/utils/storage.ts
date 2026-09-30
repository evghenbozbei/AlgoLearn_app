import type { UserProgress } from '../types';
import { clampQuizScore } from './quizScoring';

const PROGRESS_KEY = 'algolearn_python_progress_v1';

export function createInitialProgress(): UserProgress {
  return {
    completedLessons: [],
    bookmarkedLessons: [],
    completedBugs: [],
    quizScores: {},
    currentStreak: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    sequentialMode: true
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && id.trim().length > 0))];
}

function isValidDate(value: unknown, today: string): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value > today) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function normalizeProgress(value: unknown): UserProgress {
  const initial = createInitialProgress();
  if (!isRecord(value)) return initial;

  const validDate = isValidDate(value.lastActiveDate, initial.lastActiveDate);
  const quizScores = isRecord(value.quizScores)
    ? Object.fromEntries(Object.entries(value.quizScores).filter(
        ([, score]) => typeof score === 'number' && Number.isSafeInteger(score) && score >= 0
      ).map(([chapterId, score]) => [chapterId, clampQuizScore(chapterId, score as number)])) as Record<string, number>
    : {};

  // Build a new object field by field; never trust the shape of stored JSON.
  return {
    completedLessons: normalizeIds(value.completedLessons),
    bookmarkedLessons: normalizeIds(value.bookmarkedLessons),
    completedBugs: normalizeIds(value.completedBugs),
    quizScores,
    currentStreak: validDate && typeof value.currentStreak === 'number'
      && Number.isSafeInteger(value.currentStreak) && value.currentStreak > 0
      ? value.currentStreak : initial.currentStreak,
    lastActiveDate: validDate ? value.lastActiveDate as string : initial.lastActiveDate,
    sequentialMode: typeof value.sequentialMode === 'boolean' ? value.sequentialMode : initial.sequentialMode
  };
}

export function loadUserProgress(): UserProgress {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (data) {
      const parsed = normalizeProgress(JSON.parse(data));
      // Check streak
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.lastActiveDate !== today) {
        // simple streak check
        const lastDate = new Date(parsed.lastActiveDate || 0);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          parsed.currentStreak = Math.min(parsed.currentStreak + 1, Number.MAX_SAFE_INTEGER);
        } else if (diffDays > 1) {
          parsed.currentStreak = 1;
        }
        parsed.lastActiveDate = today;
      }
      // Persist repairs even when the user was already active today.
      saveUserProgress(parsed);
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load progress', e);
  }

  const initial = createInitialProgress();
  saveUserProgress(initial);
  return initial;
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}
