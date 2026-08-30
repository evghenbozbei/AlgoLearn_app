import { Lesson } from '../types';
import { CHAPTERS } from '../data/chapters';

export function getAllLessons(): Lesson[] {
  return CHAPTERS.flatMap((c) => c.lessons);
}

export function isLessonUnlocked(
  lessonId: string,
  completedLessons: string[],
  sequentialMode: boolean = true
): boolean {
  if (!sequentialMode) return true;

  const all = getAllLessons();
  const index = all.findIndex((l) => l.id === lessonId);
  if (index <= 0) return true; // First lesson is always unlocked

  // If already completed, it's unlocked
  if (completedLessons.includes(lessonId)) return true;

  // It is unlocked if the immediate previous lesson in curriculum was completed
  const prevLesson = all[index - 1];
  return completedLessons.includes(prevLesson.id);
}

export function getPreviousLesson(lessonId: string): Lesson | null {
  const all = getAllLessons();
  const index = all.findIndex((l) => l.id === lessonId);
  if (index > 0) {
    return all[index - 1];
  }
  return null;
}

export function getNextLesson(lessonId: string): Lesson | null {
  const all = getAllLessons();
  const index = all.findIndex((l) => l.id === lessonId);
  if (index >= 0 && index < all.length - 1) {
    return all[index + 1];
  }
  return null;
}

export function getFirstIncompleteLesson(completedLessons: string[]): Lesson {
  const all = getAllLessons();
  const firstIncomplete = all.find((l) => !completedLessons.includes(l.id));
  return firstIncomplete || all[0];
}

export function getUnlockedLessonsCount(
  completedLessons: string[],
  sequentialMode: boolean = true
): number {
  if (!sequentialMode) return getAllLessons().length;
  const all = getAllLessons();
  return all.filter((l) => isLessonUnlocked(l.id, completedLessons, sequentialMode)).length;
}
