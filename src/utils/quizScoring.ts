import { QUIZ_QUESTIONS } from '../data/quizzes';

const questionCounts = new Map<string, number>([['all', QUIZ_QUESTIONS.length]]);
for (const question of QUIZ_QUESTIONS) {
  questionCounts.set(question.chapterId, (questionCounts.get(question.chapterId) ?? 0) + 1);
}

export function clampQuizScore(chapterId: string, score: number): number {
  // Preserve scores for old/unknown chapters; their question count is unavailable.
  const maximum = questionCounts.get(chapterId);
  return maximum === undefined ? score : Math.min(score, maximum);
}
