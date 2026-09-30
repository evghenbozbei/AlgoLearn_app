import { PYTHON_CODE } from './pythonCode';
import {
  generateLinearSearchSteps, generateBinarySearchSteps, generateBubbleSortSteps,
  generateSelectionSortSteps, generateInsertionSortSteps
} from '../utils/stepGenerators';

// Shared by the lessons and sandbox, including the code used by the generators.
export const ALGORITHMS = {
  linear: {
    name: 'Линейный поиск (Linear Search)', time: 'O(n)', space: 'O(1)',
    code: PYTHON_CODE.linear.code, generateSteps: generateLinearSearchSteps
  },
  binary: {
    name: 'Бинарный поиск (Binary Search)', time: 'O(log n)', space: 'O(1)',
    code: PYTHON_CODE.binary.code, generateSteps: generateBinarySearchSteps
  },
  bubble: {
    name: 'Пузырьковая сортировка (Bubble Sort)', time: 'O(n²)', space: 'O(1)',
    code: PYTHON_CODE.bubble.code, generateSteps: generateBubbleSortSteps
  },
  selection: {
    name: 'Сортировка выбором (Selection Sort)', time: 'O(n²)', space: 'O(1)',
    code: PYTHON_CODE.selection.code, generateSteps: generateSelectionSortSteps
  },
  insertion: {
    name: 'Сортировка вставками (Insertion Sort)', time: 'O(n²)', space: 'O(1)',
    code: PYTHON_CODE.insertion.code, generateSteps: generateInsertionSortSteps
  }
};

export type AlgorithmKey = keyof typeof ALGORITHMS;
