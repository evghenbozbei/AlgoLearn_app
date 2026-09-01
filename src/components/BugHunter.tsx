import React, { useState } from 'react';
import { Bug, CheckCircle2, XCircle, Lightbulb, ChevronRight, RefreshCw, Trophy, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BUG_CHALLENGES } from '../data/bugChallenges';
import { PythonCodeViewer } from './PythonCodeViewer';
import { UserProgress } from '../types';

interface BugHunterProps {
  progress: UserProgress;
  onCompleteBug: (bugId: string) => void;
}

export const BugHunter: React.FC<BugHunterProps> = ({ progress, onCompleteBug }) => {
  const [selectedBugIndex, setSelectedBugIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const bug = BUG_CHALLENGES[selectedBugIndex];
  const isCompleted = progress.completedBugs.includes(bug.id);

  const handleSelectOption = (idx: number) => {
    setSelectedOptionIndex(idx);
    const option = bug.options[idx];
    if (option.isCorrect) {
      onCompleteBug(bug.id);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNextChallenge = () => {
    if (selectedBugIndex < BUG_CHALLENGES.length - 1) {
      setSelectedBugIndex(selectedBugIndex + 1);
      setSelectedOptionIndex(null);
      setShowSolution(false);
    }
  };

  const handlePrevChallenge = () => {
    if (selectedBugIndex > 0) {
      setSelectedBugIndex(selectedBugIndex - 1);
      setSelectedOptionIndex(null);
      setShowSolution(false);
    }
  };

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500 text-xs font-semibold uppercase tracking-wider">
            <Bug size={15} />
            <span>Режим QA & Code Review</span>
          </div>
          <span
            style={{
              backgroundColor: 'var(--card-subtle-bg)',
              color: 'var(--text-secondary)',
              borderColor: 'var(--card-border)'
            }}
            className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border"
          >
            Решено: {progress.completedBugs.length} / {BUG_CHALLENGES.length}
          </span>
        </div>
        <h1
          style={{ color: 'var(--text-primary)' }}
          className="text-xl font-bold mt-1"
        >
          Найди баг в алгоритме
        </h1>
        <p
          style={{ color: 'var(--text-muted)' }}
          className="text-xs mt-1"
        >
          Анализируйте код с типичными ошибками: off-by-one, бесконечная рекурсия, мутации списков и падения стека.
        </p>
      </div>

      {/* Challenge Selector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {BUG_CHALLENGES.map((b, idx) => {
          const solved = progress.completedBugs.includes(b.id);
          const isCurrent = idx === selectedBugIndex;

          return (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBugIndex(idx);
                setSelectedOptionIndex(null);
                setShowSolution(false);
              }}
              style={{
                backgroundColor: isCurrent
                  ? undefined
                  : solved
                  ? 'var(--accent-emerald-bg)'
                  : 'var(--card-bg)',
                borderColor: isCurrent
                  ? undefined
                  : solved
                  ? 'var(--accent-emerald-border)'
                  : 'var(--card-border)',
                color: isCurrent
                  ? undefined
                  : solved
                  ? 'var(--accent-emerald-text)'
                  : 'var(--text-secondary)'
              }}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium flex items-center gap-1.5 transition-all border ${
                isCurrent
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                  : 'hover:opacity-90'
              }`}
            >
              {solved ? (
                <CheckCircle2 size={13} className="text-emerald-500" />
              ) : (
                <Bug size={13} className="text-rose-500" />
              )}
              <span>Задача #{idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Scenario Box */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border space-y-2 shadow-sm transition-colors"
      >
        <div className="flex items-center justify-between">
          <h2
            style={{ color: 'var(--text-primary)' }}
            className="text-base font-bold flex items-center gap-2"
          >
            <span>{bug.title}</span>
          </h2>
          <span
            style={{
              backgroundColor: 'var(--accent-rose-bg)',
              color: 'var(--accent-rose-text)',
              borderColor: 'var(--accent-rose-border)'
            }}
            className="text-[11px] px-2 py-0.5 rounded font-mono font-semibold border"
          >
            {bug.difficulty === 'easy' ? 'Легкая' : 'Средняя'}
          </span>
        </div>

        <div
          style={{
            backgroundColor: 'var(--card-subtle-bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-secondary)'
          }}
          className="p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5"
        >
          <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong style={{ color: 'var(--text-primary)' }} className="block mb-0.5">
              Сценарий падения:
            </strong>
            {bug.scenario}
          </div>
        </div>

        {/* Buggy Code Snippet */}
        <div className="pt-1">
          <span
            style={{ color: 'var(--text-muted)' }}
            className="text-xs font-semibold block mb-1"
          >
            Проблемный код на Python:
          </span>
          <PythonCodeViewer
            code={bug.buggyCode}
            highlightedLines={bug.correctLineNumber ? [bug.correctLineNumber] : []}
            title="buggy_script.py"
          />
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-2.5">
        <h3
          style={{ color: 'var(--text-secondary)' }}
          className="text-xs font-bold uppercase tracking-wider px-1"
        >
          В чем заключается причина бага и как его исправить?
        </h3>

        {bug.options.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;

          return (
            <div key={idx} className="space-y-1.5">
              <button
                onClick={() => handleSelectOption(idx)}
                style={{
                  backgroundColor:
                    selectedOptionIndex === null
                      ? 'var(--card-bg)'
                      : isSelected
                      ? opt.isCorrect
                        ? 'var(--accent-emerald-bg)'
                        : 'var(--accent-rose-bg)'
                      : 'var(--card-bg)',
                  borderColor:
                    selectedOptionIndex === null
                      ? 'var(--card-border)'
                      : isSelected
                      ? opt.isCorrect
                        ? 'var(--accent-emerald-border)'
                        : 'var(--accent-rose-border)'
                      : 'var(--card-border)',
                  color:
                    selectedOptionIndex === null
                      ? 'var(--text-primary)'
                      : isSelected
                      ? opt.isCorrect
                        ? 'var(--accent-emerald-text)'
                        : 'var(--accent-rose-text)'
                      : 'var(--text-faint)'
                }}
                className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 active:scale-[0.99] shadow-sm ${
                  selectedOptionIndex !== null && !isSelected ? 'opacity-60' : ''
                }`}
              >
                <div
                  style={{
                    borderColor: 'var(--card-border)',
                    color: 'var(--text-secondary)'
                  }}
                  className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-mono text-[11px] font-bold mt-0.5"
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 font-medium">{opt.text}</div>
                {isSelected && (
                  <div>
                    {opt.isCorrect ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      <XCircle size={16} className="text-rose-500" />
                    )}
                  </div>
                )}
              </button>

              {/* Explanation on select */}
              {isSelected && (
                <div
                  style={{
                    backgroundColor: opt.isCorrect ? 'var(--accent-emerald-bg)' : 'var(--accent-rose-bg)',
                    borderColor: opt.isCorrect ? 'var(--accent-emerald-border)' : 'var(--accent-rose-border)',
                    color: opt.isCorrect ? 'var(--accent-emerald-text)' : 'var(--accent-rose-text)'
                  }}
                  className="p-3 rounded-xl text-xs leading-relaxed border"
                >
                  <p className="font-semibold mb-1">
                    {opt.isCorrect ? '✅ Верно!' : '❌ Не совсем:'}
                  </p>
                  <p>{opt.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed Code Accordion */}
      <div className="pt-2">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 text-xs font-semibold text-indigo-500 hover:opacity-80 transition-colors"
        >
          <Lightbulb size={14} />
          <span>{showSolution ? 'Скрыть исправленный код' : 'Показать исправленный код и вывод'}</span>
        </button>

        {showSolution && (
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
            className="mt-3 p-3.5 rounded-xl border space-y-2 animate-fadeIn shadow-sm"
          >
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
              Исправленная версия (Fixed):
            </span>
            <PythonCodeViewer code={bug.fixedCode} title="fixed_solution.py" />
            <div
              style={{
                backgroundColor: 'var(--accent-indigo-bg)',
                borderColor: 'var(--accent-indigo-border)',
                color: 'var(--accent-indigo-text)'
              }}
              className="p-3 rounded-lg border text-xs"
            >
              <strong>Главный вывод:</strong> {bug.takeaway}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div
        style={{ borderColor: 'var(--card-border)' }}
        className="flex items-center justify-between pt-3 border-t"
      >
        <button
          onClick={handlePrevChallenge}
          disabled={selectedBugIndex === 0}
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-secondary)'
          }}
          className="px-3.5 py-2 rounded-xl border disabled:opacity-30 text-xs font-medium transition-all hover:opacity-90"
        >
          ◀ Предыдущий баг
        </button>

        <button
          onClick={handleNextChallenge}
          disabled={selectedBugIndex === BUG_CHALLENGES.length - 1}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
        >
          <span>Следующий баг</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
