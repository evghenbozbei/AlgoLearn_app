import type { Lesson } from '../types';
import { CHAPTERS } from '../data/chapters';

// The curriculum is static. Build its order and ID index once, not per card/render.
const allLessons: readonly Lesson[] = Object.freeze(CHAPTERS.flatMap((chapter) => chapter.lessons));
const lessonIndexes = new Map(allLessons.map((lesson, index) => [lesson.id, index]));
type CompletedLessons = readonly string[] | ReadonlySet<string>;

function asCompletedSet(completedLessons: CompletedLessons): ReadonlySet<string> {
  return 'has' in completedLessons ? completedLessons : new Set(completedLessons);
}

function isUnlockedAt(index: number, completed: ReadonlySet<string>): boolean {
  return index === 0 || completed.has(allLessons[index].id) || completed.has(allLessons[index - 1].id);
}

export function getAllLessons(): readonly Lesson[] {
  return allLessons;
}

export function getLessonById(lessonId: string): Lesson | undefined {
  const index = lessonIndexes.get(lessonId);
  return index === undefined ? undefined : allLessons[index];
}

export function isLessonUnlocked(
  lessonId: string,
  completedLessons: CompletedLessons,
  sequentialMode: boolean = true
): boolean {
  const index = lessonIndexes.get(lessonId);
  if (index === undefined) return false;
  return !sequentialMode || isUnlockedAt(index, asCompletedSet(completedLessons));
}

export function getPreviousLesson(lessonId: string): Lesson | null {
  const index = lessonIndexes.get(lessonId);
  return index !== undefined && index > 0 ? allLessons[index - 1] : null;
}

export function getNextLesson(lessonId: string): Lesson | null {
  const index = lessonIndexes.get(lessonId);
  return index === undefined ? null : allLessons[index + 1] ?? null;
}

export function getFirstIncompleteLesson(completedLessons: CompletedLessons): Lesson {
  const completed = asCompletedSet(completedLessons);
  return allLessons.find((lesson) => !completed.has(lesson.id)) || allLessons[0];
}

export function getUnlockedLessonsCount(
  completedLessons: CompletedLessons,
  sequentialMode: boolean = true
): number {
  if (!sequentialMode) return allLessons.length;
  const completed = asCompletedSet(completedLessons);
  let count = 0;
  for (let index = 0; index < allLessons.length; index++) {
    if (isUnlockedAt(index, completed)) count++;
  }
  return count;
}
