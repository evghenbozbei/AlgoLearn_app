import React, { useState, useMemo } from 'react';
import { Sliders, RefreshCw, Play, CheckCircle, HelpCircle } from 'lucide-react';
import { Visualizer } from './Visualizer';
import { PythonCodeViewer } from './PythonCodeViewer';
import {
  generateLinearSearchSteps,
  generateBinarySearchSteps,
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps
} from '../utils/stepGenerators';

type AlgorithmKey = 'linear' | 'binary' | 'bubble' | 'selection' | 'insertion';

export const Sandbox: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmKey>('binary');
  const [customInput, setCustomInput] = useState<string>('5, 12, 18, 23, 45, 67, 89');
  const [searchTarget, setSearchTarget] = useState<number>(45);
  const [activeCodeLine, setActiveCodeLine] = useState<number | undefined>(undefined);

  // Parse input array safely
  const parsedArray = useMemo(() => {
    try {
      const nums = customInput
        .split(/[,\s]+/)
        .map((x) => parseInt(x.trim(), 10))
        .filter((n) => !isNaN(n));
      if (nums.length === 0) return [10, 20, 30, 40, 50];
      return nums.slice(0, 10); // cap to 10 for optimal mobile UI
    } catch {
      return [10, 20, 30, 40, 50];
    }
  }, [customInput]);

  // Ensure binary search has sorted array
  const preparedArray = useMemo(() => {
    if (selectedAlgo === 'binary') {
      return [...parsedArray].sort((a, b) => a - b);
    }
    return parsedArray;
  }, [parsedArray, selectedAlgo]);

  const generateRandomArray = () => {
    const len = 6;
    const randNums = Array.from({ length: len }, () => Math.floor(Math.random() * 90) + 10);
    if (selectedAlgo === 'binary') {
      randNums.sort((a, b) => a - b);
      setSearchTarget(randNums[Math.floor(Math.random() * randNums.length)]);
    }
    setCustomInput(randNums.join(', '));
  };

  // Generate steps based on selected algorithm
  const steps = useMemo(() => {
    switch (selectedAlgo) {
      case 'linear':
        return generateLinearSearchSteps(preparedArray, searchTarget);
      case 'binary':
        return generateBinarySearchSteps(preparedArray, searchTarget);
      case 'bubble':
        return generateBubbleSortSteps(preparedArray);
      case 'selection':
        return generateSelectionSortSteps(preparedArray);
      case 'insertion':
        return generateInsertionSortSteps(preparedArray);
      default:
        return generateBinarySearchSteps(preparedArray, searchTarget);
    }
  }, [selectedAlgo, preparedArray, searchTarget]);

  // Algorithm info definitions
  const algoDetails: {
    [key in AlgorithmKey]: { name: string; time: string; space: string; code: string; desc: string };
  } = {
    linear: {
      name: 'Линейный поиск (Linear Search)',
      time: 'O(n)',
      space: 'O(1)',
      desc: 'Последовательный перебор элементов от начала до конца.',
      code: `def linear_search(arr: list[int], target: int) -> int:
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`
    },
    binary: {
      name: 'Бинарный поиск (Binary Search)',
      time: 'O(log n)',
      space: 'O(1)',
      desc: 'Деление отсортированного отрезка пополам на каждом шаге.',
      code: `def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
    },
    bubble: {
      name: 'Пузырьковая сортировка (Bubble Sort)',
      time: 'O(n²)',
      space: 'O(1)',
      desc: 'Попарное сравнение соседних элементов и подъем больших чисел вправо.',
      code: `def bubble_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr`
    },
    selection: {
      name: 'Сортировка выбором (Selection Sort)',
      time: 'O(n²)',
      space: 'O(1)',
      desc: 'Поиск минимума в правой части и перемещение его в начало.',
      code: `def selection_sort(arr: list[int]) -> list[int]:
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
    },
    insertion: {
      name: 'Сортировка вставками (Insertion Sort)',
      time: 'O(n²)',
      space: 'O(1)',
      desc: 'Построение отсортированной части по одному элементу.',
      code: `def insertion_sort(arr: list[int]) -> list[int]:
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
    }
  };

  const currentAlgo = algoDetails[selectedAlgo];

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border shadow-sm transition-colors"
      >
        <div className="flex items-center gap-2 text-indigo-500 text-xs font-semibold mb-1 uppercase tracking-wider">
          <Sliders size={14} />
          <span>Интерактивная песочница</span>
        </div>
        <h1
          style={{ color: 'var(--text-primary)' }}
          className="text-xl font-bold"
        >
          Algorithm Sandbox
        </h1>
        <p
          style={{ color: 'var(--text-muted)' }}
          className="text-xs mt-1"
        >
          Введите свои числа, выберите алгоритм и управляйте пошаговой анимацией с замерами операций.
        </p>
      </div>

      {/* Algorithm Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { key: 'binary', label: '🌲 Бинарный поиск' },
          { key: 'linear', label: '🔍 Линейный поиск' },
          { key: 'bubble', label: '🫧 Bubble Sort' },
          { key: 'selection', label: '🎯 Selection Sort' },
          { key: 'insertion', label: '🃏 Insertion Sort' }
        ].map((item) => {
          const isSelected = selectedAlgo === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setSelectedAlgo(item.key as AlgorithmKey)}
              style={{
                backgroundColor: isSelected ? undefined : 'var(--card-bg)',
                borderColor: isSelected ? undefined : 'var(--card-border)',
                color: isSelected ? undefined : 'var(--text-secondary)'
              }}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                  : 'hover:opacity-90'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Inputs Configuration Card */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border space-y-3 shadow-sm transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label
            style={{ color: 'var(--text-secondary)' }}
            className="text-xs font-semibold"
          >
            Входной массив чисел (через запятую):
          </label>
          <button
            onClick={generateRandomArray}
            className="flex items-center gap-1 text-[11px] text-indigo-500 hover:opacity-80 font-medium self-start sm:self-auto"
          >
            <RefreshCw size={12} />
            <span>Случайный массив</span>
          </button>
        </div>

        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: 'var(--input-border)',
            color: 'var(--input-fg)'
          }}
          className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
          placeholder="например: 4, 12, 28, 35, 60"
        />

        {(selectedAlgo === 'linear' || selectedAlgo === 'binary') && (
          <div className="flex items-center gap-3 pt-1">
            <label
              style={{ color: 'var(--text-secondary)' }}
              className="text-xs font-semibold whitespace-nowrap"
            >
              Искомый элемент (target):
            </label>
            <input
              type="number"
              value={searchTarget}
              onChange={(e) => setSearchTarget(parseInt(e.target.value, 10) || 0)}
              style={{
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--input-border)',
                color: 'var(--input-fg)'
              }}
              className="w-24 px-3 py-1.5 rounded-lg border text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {selectedAlgo === 'binary' && (
          <div
            style={{
              backgroundColor: 'var(--accent-amber-bg)',
              borderColor: 'var(--accent-amber-border)',
              color: 'var(--accent-amber-text)'
            }}
            className="text-[11px] flex items-center gap-1.5 p-2 rounded-lg border"
          >
            <HelpCircle size={13} className="shrink-0" />
            <span>Массив автоматически отсортирован по возрастанию для бинарного поиска.</span>
          </div>
        )}
      </div>

      {/* Visualizer Frame */}
      <Visualizer
        key={`${selectedAlgo}-${customInput}-${searchTarget}`}
        steps={steps}
        type={selectedAlgo === 'binary' || selectedAlgo === 'linear' ? 'array-search' : 'array-sort'}
        title={currentAlgo.name}
        onStepChange={(idx) => {
          const currentStep = steps[idx];
          if (currentStep && currentStep.codeLine) {
            setActiveCodeLine(currentStep.codeLine);
          }
        }}
      />

      {/* Python Code Synchronized Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span style={{ color: 'var(--text-secondary)' }}>Синхронизированный Python-код:</span>
          <span className="font-mono text-indigo-500 font-semibold">
            Время: {currentAlgo.time} | Память: {currentAlgo.space}
          </span>
        </div>
        <PythonCodeViewer
          code={currentAlgo.code}
          activeLine={activeCodeLine}
          title={`${currentAlgo.name} (Python)`}
        />
      </div>
    </div>
  );
};
