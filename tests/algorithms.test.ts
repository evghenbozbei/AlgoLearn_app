import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ALGORITHMS, type AlgorithmKey } from '../src/data/algorithms';
import { CHAPTERS } from '../src/data/chapters';
import { definePythonCode } from '../src/data/pythonCode';
import type { VisualStep } from '../src/types';

function highlighted(key: AlgorithmKey, step: VisualStep): string {
  assert.ok(step.codeLine && step.codeLine > 0);
  const line = ALGORITHMS[key].code.split('\n')[step.codeLine - 1];
  assert.ok(line?.trim(), `${key}: missing line ${step.codeLine}`);
  return line.trim();
}

test('shared lessons use exactly the same Python source as the sandbox', () => {
  const ids: Record<AlgorithmKey, string> = {
    linear: 'l-3-1', binary: 'l-3-2', bubble: 'l-4-1', selection: 'l-4-2', insertion: 'l-4-3'
  };
  for (const [key, id] of Object.entries(ids)) {
    const lesson = CHAPTERS.flatMap(chapter => chapter.lessons).find(lesson => lesson.id === id)!;
    assert.equal(lesson.pythonCode, ALGORITHMS[key].code);
    assert.ok(!lesson.pythonCode.includes('@step:'));
    for (const step of lesson.generateSteps!(lesson.initialData)) highlighted(key as AlgorithmKey, step);
  }
});

test('linear search highlights comparison and the actual return statements', () => {
  for (const target of [2, 99]) {
    const steps = ALGORITHMS.linear.generateSteps([1, 2], target);
    for (const step of steps.filter(step => step.currentAction === 'compare')) {
      assert.equal(highlighted('linear', step), 'if arr[i] == target:');
    }
    assert.equal(highlighted('linear', steps.at(-1)!), target === 2 ? 'return i' : 'return -1');
  }
});

test('binary search highlights boundary assignments and found/missing returns', () => {
  for (const [target, assignment] of [[1, 'right = mid - 1'], [5, 'left = mid + 1']] as const) {
    const steps = ALGORITHMS.binary.generateSteps([1, 3, 5], target);
    assert.equal(highlighted('binary', steps.find(step => step.currentAction === 'step')!), assignment);
    assert.equal(highlighted('binary', steps.at(-1)!), 'return mid');
  }
  const absent = ALGORITHMS.binary.generateSteps([1, 3, 5], 99);
  assert.equal(highlighted('binary', absent.at(-1)!), 'return -1');
});

test('bubble and selection swaps highlight the assignment, not a loop', () => {
  for (const key of ['bubble', 'selection'] as const) {
    const steps = ALGORITHMS[key].generateSteps([2, 1]);
    const swap = steps.find(step => step.currentAction === 'swap')!;
    assert.deepEqual(swap.array, [1, 2]);
    assert.equal(highlighted(key, swap), key === 'bubble'
      ? 'arr[j], arr[j + 1] = arr[j + 1], arr[j]'
      : 'arr[i], arr[min_idx] = arr[min_idx], arr[i]');
  }
  const sorted = ALGORITHMS.bubble.generateSteps([1, 2]);
  assert.equal(highlighted('bubble', sorted.at(-1)!), 'break');
});

test('insertion sort highlights shift, insertion and final return', () => {
  const steps = ALGORITHMS.insertion.generateSteps([2, 1]);
  assert.equal(highlighted('insertion', steps.find(step => step.currentAction === 'swap')!), 'arr[j + 1] = arr[j]');
  assert.equal(highlighted('insertion', steps.at(-2)!), 'arr[j + 1] = key');
  assert.equal(highlighted('insertion', steps.at(-1)!), 'return arr');
  assert.deepEqual(steps.at(-1)!.array, [1, 2]);
});

test('adding comments or blank lines automatically moves the associated highlight', () => {
  const original = definePythonCode('def sample():\n    return 1 # @step:done');
  const edited = definePythonCode('# Explanation\n\ndef sample():\n    return 1 # @step:done');
  assert.equal(original.line('done'), 2);
  assert.equal(edited.line('done'), 4);
  assert.equal(edited.code.split('\n')[edited.line('done') - 1], '    return 1');
  assert.throws(() => edited.line('missing'), /Unknown Python step/);
  assert.throws(() => definePythonCode('a # @step:same\nb # @step:same'), /Duplicate Python step/);
});
