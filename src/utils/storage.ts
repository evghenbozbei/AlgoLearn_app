import { UserProgress } from '../types';

const PROGRESS_KEY = 'algolearn_python_progress_v1';

export function loadUserProgress(): UserProgress {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.sequentialMode === undefined) {
        parsed.sequentialMode = true;
      }
      // Check streak
      const today = new Date().toISOString().slice(0, 10);
      if (parsed.lastActiveDate !== today) {
        // simple streak check
        const lastDate = new Date(parsed.lastActiveDate || 0);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          parsed.currentStreak = (parsed.currentStreak || 1) + 1;
        } else if (diffDays > 1) {
          parsed.currentStreak = 1;
        }
        parsed.lastActiveDate = today;
        saveUserProgress(parsed);
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load progress', e);
  }

  const initial: UserProgress = {
    completedLessons: [], // Start fresh so lesson 1 is unlocked and completes to unlock lesson 2
    bookmarkedLessons: [],
    completedBugs: [],
    quizScores: {},
    currentStreak: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    sequentialMode: true
  };
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
