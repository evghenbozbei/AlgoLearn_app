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

  const filteredQuestions =
    selectedChapterId === 'all'
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
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border shadow-sm transition-colors"
      >
        <div className="flex items-center gap-2 text-indigo-500 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle size={15} />
          <span>Проверка знаний</span>
        </div>
        <h1
          style={{ color: 'var(--text-primary)' }}
          className="text-xl font-bold mt-1"
        >
          Интерактивный квиз
        </h1>
        <p
          style={{ color: 'var(--text-muted)' }}
          className="text-xs mt-1"
        >
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
          style={{
            backgroundColor: selectedChapterId === 'all' ? undefined : 'var(--card-bg)',
            borderColor: selectedChapterId === 'all' ? undefined : 'var(--card-border)',
            color: selectedChapterId === 'all' ? undefined : 'var(--text-secondary)'
          }}
          className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all border ${
            selectedChapterId === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
              : 'hover:opacity-90'
          }`}
        >
          🌟 Все темы ({QUIZ_QUESTIONS.length})
        </button>
        {CHAPTERS.map((ch) => {
          const count = QUIZ_QUESTIONS.filter((q) => q.chapterId === ch.id).length;
          if (count === 0) return null;
          const isSelected = selectedChapterId === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChapterId(ch.id);
                handleRestart();
              }}
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
              {ch.icon} Глава {ch.number} ({count})
            </button>
          );
        })}
      </div>

      {/* Quiz Card */}
      {!isFinished ? (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          }}
          className="p-4 sm:p-5 rounded-2xl border space-y-4 shadow-md transition-colors"
        >
          {/* Progress Bar */}
          <div className="flex items-center justify-between text-xs pb-1">
            <span style={{ color: 'var(--text-muted)' }}>
              Вопрос {currentQuestionIndex + 1} из {filteredQuestions.length}
            </span>
            <span className="font-mono text-emerald-500 font-bold">
              Счет: {score}
            </span>
          </div>
          <div
            style={{ backgroundColor: 'var(--card-subtle-bg)' }}
            className="w-full h-1.5 rounded-full overflow-hidden"
          >
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
              <span
                style={{
                  backgroundColor: 'var(--accent-indigo-bg)',
                  color: 'var(--accent-indigo-text)',
                  borderColor: 'var(--accent-indigo-border)'
                }}
                className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mb-2 border"
              >
                {question.roleTag === 'qa'
                  ? '🧪 QA Focus'
                  : question.roleTag === 'devops'
                  ? '🛠 DevOps Focus'
                  : '👨‍💻 Dev Focus'}
              </span>
            )}
            <h2
              style={{ color: 'var(--text-primary)' }}
              className="text-sm sm:text-base font-bold leading-snug"
            >
              {question.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {question.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isCorrect = idx === question.correctIndex;

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={selectedOption !== null}
                  style={{
                    backgroundColor:
                      selectedOption === null
                        ? 'var(--card-subtle-bg)'
                        : isCorrect
                        ? 'var(--accent-emerald-bg)'
                        : isChosen
                        ? 'var(--accent-rose-bg)'
                        : 'var(--card-subtle-bg)',
                    borderColor:
                      selectedOption === null
                        ? 'var(--card-border)'
                        : isCorrect
                        ? 'var(--accent-emerald-border)'
                        : isChosen
                        ? 'var(--accent-rose-border)'
                        : 'var(--card-border)',
                    color:
                      selectedOption === null
                        ? 'var(--text-primary)'
                        : isCorrect
                        ? 'var(--accent-emerald-text)'
                        : isChosen
                        ? 'var(--accent-rose-text)'
                        : 'var(--text-faint)'
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${
                    selectedOption !== null && !isCorrect && !isChosen ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      style={{ borderColor: 'var(--card-border)' }}
                      className="w-5 h-5 rounded-full border flex items-center justify-center font-mono text-[11px] font-semibold shrink-0"
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {selectedOption !== null && (
                    <div className="shrink-0">
                      {isCorrect && <CheckCircle2 size={16} className="text-emerald-500" />}
                      {isChosen && !isCorrect && <XCircle size={16} className="text-rose-500" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {selectedOption !== null && (
            <div
              style={{
                backgroundColor:
                  selectedOption === question.correctIndex
                    ? 'var(--accent-emerald-bg)'
                    : 'var(--accent-rose-bg)',
                borderColor:
                  selectedOption === question.correctIndex
                    ? 'var(--accent-emerald-border)'
                    : 'var(--accent-rose-border)',
                color:
                  selectedOption === question.correctIndex
                    ? 'var(--accent-emerald-text)'
                    : 'var(--accent-rose-text)'
              }}
              className="p-3 rounded-xl text-xs leading-relaxed border"
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
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          }}
          className="p-6 rounded-2xl border text-center space-y-4 shadow-xl animate-fadeIn"
        >
          <div
            style={{
              backgroundColor: 'var(--accent-indigo-bg)',
              borderColor: 'var(--accent-indigo-border)',
              color: 'var(--accent-indigo-text)'
            }}
            className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto"
          >
            <Award size={32} />
          </div>
          <h2
            style={{ color: 'var(--text-primary)' }}
            className="text-xl font-bold"
          >
            Квиз завершен!
          </h2>
          <p
            style={{ color: 'var(--text-secondary)' }}
            className="text-sm"
          >
            Ваш результат:{' '}
            <strong className="text-emerald-500 font-mono text-base">{score}</strong> из{' '}
            <strong
              style={{ color: 'var(--text-primary)' }}
              className="font-mono text-base"
            >
              {filteredQuestions.length}
            </strong>{' '}
            правильных ответов ({Math.round((score / filteredQuestions.length) * 100)}%)
          </p>

          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              style={{
                backgroundColor: 'var(--card-subtle-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-secondary)'
              }}
              className="px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all hover:opacity-90"
            >
              <RotateCcw size={14} />
              <span>Пройти еще раз</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20"
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
