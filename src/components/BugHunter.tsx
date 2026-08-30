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
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/50 border border-rose-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <Bug size={15} />
            <span>Режим QA & Code Review</span>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
            Решено: {progress.completedBugs.length} / {BUG_CHALLENGES.length}
          </span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Найди баг в алгоритме</h1>
        <p className="text-xs text-slate-300 mt-1">
          Анализируйте код с типичными ошибками новичков: off-by-one, бесконечная рекурсия, мутации списков и падения стека.
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
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium flex items-center gap-1.5 transition-all ${
                isCurrent
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-rose-400'
                  : solved
                  ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/60'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {solved ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Bug size={13} />}
              <span>Задача #{idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Scenario Box */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>{bug.title}</span>
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {bug.difficulty === 'easy' ? 'Легкая' : 'Средняя'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
          <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-100 block mb-0.5">Сценарий падения:</strong>
            {bug.scenario}
          </div>
        </div>

        {/* Buggy Code Snippet */}
        <div className="pt-1">
          <span className="text-xs font-semibold text-slate-400 block mb-1">
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
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider px-1">
          В чем заключается причина бага и как его исправить?
        </h3>

        {bug.options.map((opt, idx) => {
          const isSelected = selectedOptionIndex === idx;
          let btnStyle = 'bg-slate-900/90 border-slate-800 hover:bg-slate-800 text-slate-200';

          if (isSelected) {
            if (opt.isCorrect) {
              btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
            } else {
              btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
            }
          }

          return (
            <div key={idx} className="space-y-1.5">
              <button
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 active:scale-[0.99] ${btnStyle}`}
              >
                <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 font-medium">{opt.text}</div>
                {isSelected && (
                  <div>
                    {opt.isCorrect ? (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    ) : (
                      <XCircle size={16} className="text-rose-400" />
                    )}
                  </div>
                )}
              </button>

              {/* Explanation on select */}
              {isSelected && (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed border ${
                    opt.isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-800 text-rose-300'
                  }`}
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
          className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Lightbulb size={14} />
          <span>{showSolution ? 'Скрыть исправленный код' : 'Показать исправленный код и вывод'}</span>
        </button>

        {showSolution && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 animate-fadeIn">
            <span className="text-xs font-semibold text-emerald-400 block">
              Исправленная версия (Fixed):
            </span>
            <PythonCodeViewer code={bug.fixedCode} title="fixed_solution.py" />
            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
              <strong>Главный вывод:</strong> {bug.takeaway}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <button
          onClick={handlePrevChallenge}
          disabled={selectedBugIndex === 0}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-medium transition-all"
        >
          ◀ Предыдущий баг
        </button>

        <button
          onClick={handleNextChallenge}
          disabled={selectedBugIndex === BUG_CHALLENGES.length - 1}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <span>Следующий баг</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
