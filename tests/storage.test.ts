import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { createInitialProgress, loadUserProgress } from '../src/utils/storage';
import { QUIZ_QUESTIONS } from '../src/data/quizzes';

const key = 'algolearn_python_progress_v1';
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
let values: Map<string, string>;

beforeEach(() => {
  values = new Map();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (name: string) => values.get(name) ?? null,
      setItem: (name: string, value: string) => { values.set(name, value); }
    }
  });
});

afterEach(() => {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else Reflect.deleteProperty(globalThis, 'localStorage');
});

function daysAgo(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

test('missing storage creates and persists a complete default progress', () => {
  const progress = loadUserProgress();
  assert.deepEqual(progress, createInitialProgress());
  assert.deepEqual(JSON.parse(values.get(key)!), progress);
});

test('invalid JSON and non-object roots recover without crashing consumers', (t) => {
  t.mock.method(console, 'error', () => {});
  for (const raw of ['{', '{}', 'null', '[]', '42', 'true', '"text"']) {
    values.set(key, raw);
    const progress = loadUserProgress();
    assert.deepEqual(progress, createInitialProgress(), raw);
    assert.equal(progress.completedLessons.includes('lesson-1'), false);
    assert.equal(progress.bookmarkedLessons.length, 0);
    assert.equal(progress.completedBugs.includes('bug-1'), false);
    assert.deepEqual(JSON.parse(values.get(key)!), progress);
  }
});

test('partial legacy progress retains valid fields and fills missing fields', () => {
  values.set(key, JSON.stringify({ completedLessons: ['lesson-1'], quizScores: { 'ch-2': 2 } }));
  assert.deepEqual(loadUserProgress(), {
    ...createInitialProgress(), completedLessons: ['lesson-1'], quizScores: { 'ch-2': 2 }
  });
});

test('valid current progress survives loading unchanged, including sequentialMode=false', () => {
  const progress = {
    ...createInitialProgress(), completedLessons: ['lesson-1'], bookmarkedLessons: ['lesson-2'],
    completedBugs: ['bug-1'], quizScores: { all: 0, 'ch-1': 1 }, currentStreak: 8, sequentialMode: false
  };
  values.set(key, JSON.stringify(progress));
  assert.deepEqual(loadUserProgress(), progress);
});

test('mixed arrays and scores are repaired while valid entries are preserved', () => {
  values.set(key, JSON.stringify({
    ...createInitialProgress(),
    completedLessons: ['lesson-1', null, 2, {}, '', ' ', 'lesson-1'],
    bookmarkedLessons: 'lesson-2', completedBugs: { id: 'bug-1' },
    quizScores: { all: 0, valid: 3, negative: -1, fractional: 1.5, text: '2', null: null, huge: 1e100 },
    currentStreak: '5', sequentialMode: 'false', unexpected: true
  }));
  const progress = loadUserProgress();
  assert.deepEqual(progress, {
    ...createInitialProgress(), completedLessons: ['lesson-1'], quizScores: { all: 0, valid: 3 }
  });
  assert.deepEqual(JSON.parse(values.get(key)!), progress);
});

test('malformed score containers and invalid streaks are replaced with defaults', () => {
  for (const quizScores of [null, [], 'scores', 3]) {
    for (const currentStreak of [null, -1, 0, 1.5, 1e100]) {
      values.set(key, JSON.stringify({ ...createInitialProgress(), quizScores, currentStreak }));
      assert.deepEqual(loadUserProgress(), createInitialProgress());
    }
  }
});

test('invalid, impossible and future dates reset the streak without losing lessons', () => {
  for (const lastActiveDate of [null, {}, 'bad', '2025-02-30', '2025-13-01', daysAgo(-1)]) {
    values.set(key, JSON.stringify({
      ...createInitialProgress(), lastActiveDate, currentStreak: 8, completedLessons: ['lesson-1']
    }));
    assert.deepEqual(loadUserProgress(), { ...createInitialProgress(), completedLessons: ['lesson-1'] });
  }
});

test('yesterday increments the streak only once across repeated loads', () => {
  values.set(key, JSON.stringify({ ...createInitialProgress(), lastActiveDate: daysAgo(1), currentStreak: 8 }));
  assert.equal(loadUserProgress().currentStreak, 9);
  assert.equal(loadUserProgress().currentStreak, 9);
});

test('a gap of multiple days resets the streak', () => {
  values.set(key, JSON.stringify({ ...createInitialProgress(), lastActiveDate: daysAgo(3), currentStreak: 8 }));
  assert.equal(loadUserProgress().currentStreak, 1);
});

test('unavailable storage falls back to defaults', (t) => {
  t.mock.method(console, 'error', () => {});
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('Storage access denied'); }
  });
  assert.deepEqual(loadUserProgress(), createInitialProgress());
});

test('a failed repair write still returns recovered progress', (t) => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(localStorage, 'setItem', () => { throw new Error('Quota exceeded'); });
  values.set(key, JSON.stringify({ completedLessons: ['lesson-1'] }));
  assert.deepEqual(loadUserProgress(), { ...createInitialProgress(), completedLessons: ['lesson-1'] });
});

test('reset defaults do not share mutable collections with previous progress', () => {
  const first = createInitialProgress();
  first.completedLessons.push('lesson-1');
  first.bookmarkedLessons.push('lesson-2');
  first.completedBugs.push('bug-1');
  first.quizScores.all = 3;
  const reset = createInitialProgress();
  assert.deepEqual(reset.completedLessons, []);
  assert.deepEqual(reset.bookmarkedLessons, []);
  assert.deepEqual(reset.completedBugs, []);
  assert.deepEqual(reset.quizScores, {});
  assert.equal(reset.sequentialMode, true);
});

test('legacy quiz scores above the question count are repaired and persisted', () => {
  const max = QUIZ_QUESTIONS.length;
  values.set(key, JSON.stringify({ ...createInitialProgress(), quizScores: { all: max + 1, 'ch-1': 2, 'ch-2': 1 } }));
  const expected = { all: max, 'ch-1': 1, 'ch-2': 1 };
  assert.deepEqual(loadUserProgress().quizScores, expected);
  assert.deepEqual(JSON.parse(values.get(key)!).quizScores, expected);
  assert.deepEqual(loadUserProgress().quizScores, expected);
});
