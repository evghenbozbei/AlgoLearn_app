import React, { useState, useMemo, useCallback } from 'react';
import { Sliders, RefreshCw, Play, CheckCircle, HelpCircle } from 'lucide-react';
import { Visualizer } from './Visualizer';
import { PythonCodeViewer } from './PythonCodeViewer';
import {
  parseSandboxArray, parseSandboxInteger, MAX_ARRAY_INPUT_LENGTH,
  MAX_INTEGER_INPUT_LENGTH, ARRAY_LENGTH_ERROR, INTEGER_ERROR
} from '../utils/sandboxInput';
import { ALGORITHMS, type AlgorithmKey } from '../data/algorithms';

export const Sandbox: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmKey>('binary');
  const [customInput, setCustomInput] = useState<string>('5, 12, 18, 23, 45, 67, 89');
  const [targetInput, setTargetInput] = useState('45');
  const [arrayLengthError, setArrayLengthError] = useState<string | undefined>();
  const [targetLengthError, setTargetLengthError] = useState<string | undefined>();
  const [activeCodeLine, setActiveCodeLine] = useState<number | undefined>(undefined);

  const parsedArray = useMemo(() => parseSandboxArray(customInput), [customInput]);
  const parsedTarget = useMemo(() => parseSandboxInteger(targetInput), [targetInput]);
  const isSearch = selectedAlgo === 'linear' || selectedAlgo === 'binary';
  const searchTarget = isSearch ? parsedTarget.value : undefined;
  const arrayError = arrayLengthError || parsedArray.error;
  const targetError = targetLengthError || parsedTarget.error;
  const inputError = arrayError || (isSearch ? targetError : undefined);

  const handleArrayInput = (value: string) => {
    if (value.length > MAX_ARRAY_INPUT_LENGTH) {
      setArrayLengthError(ARRAY_LENGTH_ERROR);
      return;
    }
    setArrayLengthError(undefined);
    setCustomInput(value);
  };

  const handleTargetInput = (value: string) => {
    if (value.length > MAX_INTEGER_INPUT_LENGTH) {
      setTargetLengthError(INTEGER_ERROR);
      return;
    }
    setTargetLengthError(undefined);
    setTargetInput(value);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>, limit: number, onInput: (value: string) => void, onTooLong: () => void) => {
    const input = event.currentTarget;
    const pasted = event.clipboardData.getData('text');
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    event.preventDefault();
    if (input.value.length - (end - start) + pasted.length > limit) {
      onTooLong();
      return;
    }
    onInput(input.value.slice(0, start) + pasted + input.value.slice(end));
  };

  // Ensure binary search has sorted array
  const preparedArray = useMemo(() => {
    if (!parsedArray.value) return [];
    if (selectedAlgo === 'binary') {
      return [...parsedArray.value].sort((a, b) => a - b);
    }
    return parsedArray.value;
  }, [parsedArray, selectedAlgo]);

  const generateRandomArray = () => {
    const len = 6;
    const randNums = Array.from({ length: len }, () => Math.floor(Math.random() * 90) + 10);
    if (selectedAlgo === 'binary') {
      randNums.sort((a, b) => a - b);
      setTargetInput(String(randNums[Math.floor(Math.random() * randNums.length)]));
      setTargetLengthError(undefined);
    }
    setCustomInput(randNums.join(', '));
    setArrayLengthError(undefined);
  };

  // Generate steps based on selected algorithm
  const steps = useMemo(() => {
    if (inputError) return [];
    return ALGORITHMS[selectedAlgo].generateSteps(preparedArray, searchTarget);
  }, [selectedAlgo, preparedArray, searchTarget, inputError]);

  const handleStepChange = useCallback((idx: number) => {
    setActiveCodeLine(steps[idx]?.codeLine);
  }, [steps]);

  const currentAlgo = ALGORITHMS[selectedAlgo];

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
            htmlFor="sandbox-array"
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
          id="sandbox-array"
          type="text"
          maxLength={MAX_ARRAY_INPUT_LENGTH}
          aria-invalid={!!arrayError}
          aria-describedby="sandbox-array-help"
          value={customInput}
          onChange={(e) => handleArrayInput(e.target.value)}
          onPaste={(e) => handlePaste(e, MAX_ARRAY_INPUT_LENGTH, handleArrayInput, () => setArrayLengthError(ARRAY_LENGTH_ERROR))}
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: 'var(--input-border)',
            color: 'var(--input-fg)'
          }}
          className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
          placeholder="например: 4, 12, 28, 35, 60"
        />
        <p id="sandbox-array-help" role={arrayError ? 'alert' : undefined} className="text-xs" style={{ color: arrayError ? 'var(--accent-rose-text)' : 'var(--text-muted)' }}>
          {arrayError || 'До 10 целых чисел через запятую или пробел; не более 256 символов.'}
        </p>

        {(selectedAlgo === 'linear' || selectedAlgo === 'binary') && (
          <div className="flex items-center gap-3 pt-1">
            <label
              htmlFor="sandbox-target"
              style={{ color: 'var(--text-secondary)' }}
              className="text-xs font-semibold whitespace-nowrap"
            >
              Искомый элемент (target):
            </label>
            <input
              id="sandbox-target"
              type="text"
              inputMode="numeric"
              maxLength={MAX_INTEGER_INPUT_LENGTH}
              aria-invalid={!!targetError}
              aria-describedby={targetError ? 'sandbox-target-error' : undefined}
              value={targetInput}
              onChange={(e) => handleTargetInput(e.target.value)}
              onPaste={(e) => handlePaste(e, MAX_INTEGER_INPUT_LENGTH, handleTargetInput, () => setTargetLengthError(INTEGER_ERROR))}
              style={{
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--input-border)',
                color: 'var(--input-fg)'
              }}
              className="w-24 px-3 py-1.5 rounded-lg border text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
        {isSearch && targetError && (
          <p id="sandbox-target-error" role="alert" className="text-xs" style={{ color: 'var(--accent-rose-text)' }}>{targetError}</p>
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
      {!inputError && <Visualizer
        key={`${selectedAlgo}-${customInput}-${searchTarget}`}
        steps={steps}
        type={selectedAlgo === 'binary' || selectedAlgo === 'linear' ? 'array-search' : 'array-sort'}
        title={currentAlgo.name}
        onStepChange={handleStepChange}
      />}

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
          activeLine={inputError ? undefined : activeCodeLine}
          title={`${currentAlgo.name} (Python)`}
        />
      </div>
    </div>
  );
};
