import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { CHAPTERS } from '../data/chapters';

interface QuizViewProps {
  onSaveScore: (chapterId: string, score: number) => void;
  onClose?: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onSaveScore, onClose }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const filteredQuestions = selectedChapterId === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter((q) => q.chapterId === selectedChapterId);

  const question = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return; // prevent re-selection
    setSelectedOption(idx);
    if (idx === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      onSaveScore(selectedChapterId, score + (selectedOption === question.correctIndex ? 1 : 0));
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 border border-blue-500/30">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle size={15} />
          <span>Проверка знаний</span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Интерактивный квиз</h1>
        <p className="text-xs text-slate-300 mt-1">
          Быстрые вопросы по всем главам: сложность Big-O, структуры данных, рекурсия и DevOps/QA специфика.
        </p>
      </div>

      {/* Chapter Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          onClick={() => {
            setSelectedChapterId('all');
            handleRestart();
          }}
          className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
            selectedChapterId === 'all'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
          }`}
        >
          🌟 Все темы ({QUIZ_QUESTIONS.length})
        </button>
        {CHAPTERS.map((ch) => {
          const count = QUIZ_QUESTIONS.filter((q) => q.chapterId === ch.id).length;
          if (count === 0) return null;
          return (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChapterId(ch.id);
                handleRestart();
              }}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                selectedChapterId === ch.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {ch.icon} Глава {ch.number} ({count})
            </button>
          );
        })}
      </div>

      {/* Quiz Card */}
      {!isFinished ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span>
              Вопрос {currentQuestionIndex + 1} из {filteredQuestions.length}
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              Счет: {score}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`
              }}
            />
          </div>

          {/* Question Text */}
          <div className="pt-2">
            {question.roleTag && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mb-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {question.roleTag === 'qa'
                  ? '🧪 QA Focus'
                  : question.roleTag === 'devops'
                  ? '🛠 DevOps Focus'
                  : '👨‍💻 Dev Focus'}
              </span>
            )}
            <h2 className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {question.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;
              let style = 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/80 text-slate-200';

              if (selectedOption !== null) {
                if (isCorrect) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
                } else if (isChosen) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
                } else {
                  style = 'bg-slate-950/30 border-slate-800/50 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${style}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center font-mono text-[11px] font-semibold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {selectedOption !== null && (
                    <div className="shrink-0">
                      {isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                      {isChosen && !isCorrect && <XCircle size={16} className="text-rose-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {selectedOption !== null && (
            <div
              className={`p-3 rounded-xl text-xs leading-relaxed border ${
                selectedOption === question.correctIndex
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
              }`}
            >
              <span className="font-bold block mb-1">
                {selectedOption === question.correctIndex ? '🎉 Верно!' : '❌ Объяснение:'}
              </span>
              <p>{question.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {selectedOption !== null && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <span>
                  {currentQuestionIndex < filteredQuestions.length - 1
                    ? 'Следующий вопрос'
                    : 'Завершить квиз'}
                </span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Result Screen */
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
            <Award size={32} />
          </div>
          <h2 className="text-xl font-bold text-white">Квиз завершен!</h2>
          <p className="text-sm text-slate-300">
            Ваш результат: <strong className="text-emerald-400 font-mono text-base">{score}</strong> из{' '}
            <strong className="font-mono text-base">{filteredQuestions.length}</strong> правильных ответов (
            {Math.round((score / filteredQuestions.length) * 100)}%)
          </p>

          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <RotateCcw size={14} />
              <span>Пройти еще раз</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
              >
                Вернуться к урокам
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
