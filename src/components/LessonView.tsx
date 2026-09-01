import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  Code2,
  Users,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Lock,
  Unlock,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, UserProgress } from '../types';
import { CHAPTERS } from '../data/chapters';
import { Visualizer } from './Visualizer';
import { PythonCodeViewer } from './PythonCodeViewer';
import { isLessonUnlocked, getNextLesson, getPreviousLesson } from '../utils/progression';

interface LessonViewProps {
  lesson: Lesson;
  progress: UserProgress;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  onCompleteLesson: (lessonId: string) => void;
}

type TabType = 'theory' | 'visualizer' | 'roles' | 'check';

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  progress,
  onBack,
  onSelectLesson,
  onToggleBookmark,
  onCompleteLesson
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('visualizer');
  const [activeCodeLine, setActiveCodeLine] = useState<number | undefined>(undefined);
  const [quickCheckAnswer, setQuickCheckAnswer] = useState<number | null>(null);
  const [selectedRoleTab, setSelectedRoleTab] = useState<'all' | 'dev' | 'qa' | 'devops'>('all');
  const [justCompletedToast, setJustCompletedToast] = useState<boolean>(false);

  const sequentialMode = progress.sequentialMode !== false;
  const isCompleted = progress.completedLessons.includes(lesson.id);
  const isBookmarked = progress.bookmarkedLessons.includes(lesson.id);

  // Find next/prev lessons
  const prevLesson = getPreviousLesson(lesson.id);
  const nextLesson = getNextLesson(lesson.id);

  // Next lesson is unlocked if it's already in completed OR if this current lesson is completed OR sequential mode is disabled
  const isNextUnlocked = nextLesson
    ? !sequentialMode || isCompleted || progress.completedLessons.includes(nextLesson.id)
    : false;

  // Generate visualization steps
  const steps = lesson.generateSteps
    ? lesson.generateSteps(lesson.initialData)
    : [
        {
          id: 0,
          description: 'Инициализация алгоритма...',
          array: (lesson.initialData as number[]) || [1, 2, 3],
          currentAction: 'init'
        }
      ];

  const handleCompleteClick = () => {
    onCompleteLesson(lesson.id);
    setJustCompletedToast(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleQuickCheck = (idx: number) => {
    setQuickCheckAnswer(idx);
    if (idx === lesson.quickCheck.correctIndex) {
      onCompleteLesson(lesson.id);
      setJustCompletedToast(true);
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={onBack}
          id="lesson-back-btn"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
            color: 'var(--text-secondary)'
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors hover:opacity-90 active:scale-95 shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>К списку глав</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(lesson.id)}
            id="lesson-bookmark-btn"
            style={{
              backgroundColor: isBookmarked ? 'var(--accent-amber-bg)' : 'var(--card-bg)',
              borderColor: isBookmarked ? 'var(--accent-amber-border)' : 'var(--card-border)',
              color: isBookmarked ? 'var(--accent-amber-text)' : 'var(--text-muted)'
            }}
            className="p-2 rounded-xl border transition-all text-xs shadow-sm hover:opacity-90"
            title="Добавить в закладки"
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>

          <button
            onClick={handleCompleteClick}
            id="lesson-complete-btn"
            style={{
              backgroundColor: isCompleted ? 'var(--accent-emerald-bg)' : undefined,
              borderColor: isCompleted ? 'var(--accent-emerald-border)' : undefined,
              color: isCompleted ? 'var(--accent-emerald-text)' : undefined
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 shadow-sm ${
              isCompleted
                ? ''
                : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <CheckCircle2 size={14} />
            <span>{isCompleted ? 'Пройдено' : 'Завершить урок'}</span>
          </button>
        </div>
      </div>

      {/* Just Completed Banner */}
      {(justCompletedToast || isCompleted) && nextLesson && (
        <div
          style={{
            backgroundColor: 'var(--accent-emerald-bg)',
            borderColor: 'var(--accent-emerald-border)'
          }}
          className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 animate-fadeIn shadow-sm"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--accent-emerald-border)'
              }}
              className="w-8 h-8 rounded-full text-emerald-500 flex items-center justify-center shrink-0 border"
            >
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Урок пройден • Открыт следующий шаг
              </div>
              <div
                style={{ color: 'var(--text-primary)' }}
                className="text-xs font-bold truncate"
              >
                {nextLesson.title}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectLesson(nextLesson.id)}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <span>Вперед</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Lesson Meta Header */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border space-y-2 shadow-sm transition-colors"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            style={{
              backgroundColor: 'var(--accent-indigo-bg)',
              color: 'var(--accent-indigo-text)',
              borderColor: 'var(--accent-indigo-border)'
            }}
            className="px-2 py-0.5 rounded-md font-mono font-semibold border"
          >
            Время: {lesson.timeComplexity}
          </span>
          <span
            style={{
              backgroundColor: 'var(--accent-purple-bg)',
              color: 'var(--accent-purple-text)',
              borderColor: 'var(--accent-purple-border)'
            }}
            className="px-2 py-0.5 rounded-md font-mono font-semibold border"
          >
            Память: {lesson.spaceComplexity}
          </span>
          <span
            style={{ color: 'var(--text-muted)' }}
            className="flex items-center gap-1 text-[11px] ml-auto"
          >
            <Clock size={12} />
            <span>{lesson.duration}</span>
          </span>
        </div>

        <h1
          style={{ color: 'var(--text-primary)' }}
          className="text-lg sm:text-xl font-bold leading-tight"
        >
          {lesson.title}
        </h1>
        <p
          style={{ color: 'var(--text-muted)' }}
          className="text-xs sm:text-sm"
        >
          {lesson.shortDesc}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{ borderColor: 'var(--card-border)' }}
        className="flex border-b overflow-x-auto text-xs font-medium no-scrollbar"
      >
        {[
          { key: 'visualizer', label: '🎬 Симулятор & Код', icon: Code2 },
          { key: 'theory', label: '📖 Теория & Аналогия', icon: BookOpen },
          { key: 'roles', label: '💡 Для твоей роли', icon: Users },
          { key: 'check', label: '❓ Проверка', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              style={{
                borderColor: isActive ? 'var(--accent-indigo-border)' : 'transparent',
                color: isActive ? 'var(--accent-indigo-text)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--accent-indigo-bg)' : 'transparent'
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors rounded-t-lg"
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Visualizer & Code */}
      {activeTab === 'visualizer' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Visualizer */}
          <Visualizer
            steps={steps}
            type={lesson.visualizerType}
            title={lesson.title}
            onStepChange={(stepIdx) => {
              const currentStep = steps[stepIdx];
              if (currentStep && currentStep.codeLine) {
                setActiveCodeLine(currentStep.codeLine);
              }
            }}
          />

          {/* Code Viewer */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs px-1">
              <span style={{ color: 'var(--text-secondary)' }}>Реализация на Python:</span>
              <span className="text-[11px] text-indigo-500 font-medium">
                Строка подсвечивается по шагам 👆
              </span>
            </div>
            <PythonCodeViewer
              code={lesson.pythonCode}
              activeLine={activeCodeLine}
              title={`${lesson.title} (Python 3.12)`}
            />
          </div>

          {/* Explanation Callout */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)'
            }}
            className="p-3.5 rounded-xl border text-xs leading-relaxed shadow-sm"
          >
            <strong style={{ color: 'var(--text-primary)' }} className="block mb-1">
              Разбор логики:
            </strong>
            {lesson.codeExplanation}
          </div>
        </div>
      )}

      {/* Tab 2: Theory & Analogy */}
      {activeTab === 'theory' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Real world analogy card */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--accent-amber-border)'
            }}
            className="p-4 rounded-2xl border space-y-2 shadow-sm"
          >
            <div className="flex items-center gap-2 text-amber-500 text-xs font-semibold uppercase">
              <Sparkles size={14} />
              <span>Аналогия из жизни:</span>
            </div>
            <p
              style={{ color: 'var(--text-primary)' }}
              className="text-xs sm:text-sm leading-relaxed font-sans italic"
            >
              «{lesson.theory.analogy}»
            </p>
          </div>

          {/* Introduction */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
            className="p-4 rounded-2xl border space-y-3 shadow-sm"
          >
            <h3
              style={{ color: 'var(--text-primary)' }}
              className="text-sm font-bold"
            >
              В чем суть:
            </h3>
            <p
              style={{ color: 'var(--text-secondary)' }}
              className="text-xs sm:text-sm leading-relaxed"
            >
              {lesson.theory.intro}
            </p>
          </div>

          {/* Key points */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
            className="p-4 rounded-2xl border space-y-3 shadow-sm"
          >
            <h3
              style={{ color: 'var(--text-primary)' }}
              className="text-sm font-bold"
            >
              Ключевые моменты:
            </h3>
            <ul
              style={{ color: 'var(--text-secondary)' }}
              className="space-y-2 text-xs sm:text-sm"
            >
              {lesson.theory.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* When to use */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
            className="p-4 rounded-2xl border space-y-3 shadow-sm"
          >
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Где это применяется:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lesson.theory.whenToUse.map((use, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--card-subtle-bg)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text-secondary)'
                  }}
                  className="p-2.5 rounded-xl border text-xs flex items-center gap-2"
                >
                  <Zap size={14} className="text-emerald-500 shrink-0" />
                  <span>{use}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Role Tips */}
      {activeTab === 'roles' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Role Filter Chips */}
          <div className="flex gap-2 text-xs">
            {[
              { key: 'all', label: 'Все роли' },
              { key: 'qa', label: '🧪 Тестировщику (QA)' },
              { key: 'devops', label: '🛠 DevOps инженеру' },
              { key: 'dev', label: '👨‍💻 Разработчику' }
            ].map((r) => (
              <button
                key={r.key}
                onClick={() => setSelectedRoleTab(r.key as any)}
                style={{
                  backgroundColor: selectedRoleTab === r.key ? undefined : 'var(--card-bg)',
                  borderColor: selectedRoleTab === r.key ? undefined : 'var(--card-border)',
                  color: selectedRoleTab === r.key ? undefined : 'var(--text-secondary)'
                }}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all border ${
                  selectedRoleTab === r.key
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'hover:opacity-90'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Role Cards */}
          <div className="space-y-3">
            {lesson.roleTips
              .filter((t) => selectedRoleTab === 'all' || t.role === selectedRoleTab)
              .map((tip, idx) => {
                let badgeStyle = {
                  backgroundColor: 'var(--accent-indigo-bg)',
                  color: 'var(--accent-indigo-text)',
                  borderColor: 'var(--accent-indigo-border)'
                };
                let iconName = '👨‍💻 Dev';
                if (tip.role === 'qa') {
                  badgeStyle = {
                    backgroundColor: 'var(--accent-rose-bg)',
                    color: 'var(--accent-rose-text)',
                    borderColor: 'var(--accent-rose-border)'
                  };
                  iconName = '🧪 QA / Тестирование';
                } else if (tip.role === 'devops') {
                  badgeStyle = {
                    backgroundColor: 'var(--accent-emerald-bg)',
                    color: 'var(--accent-emerald-text)',
                    borderColor: 'var(--accent-emerald-border)'
                  };
                  iconName = '🛠 DevOps / Инфраструктура';
                }

                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--card-border)'
                    }}
                    className="p-4 rounded-2xl border space-y-2 shadow-sm transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        style={badgeStyle}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border"
                      >
                        {iconName}
                      </span>
                    </div>
                    <h4
                      style={{ color: 'var(--text-primary)' }}
                      className="text-sm font-bold"
                    >
                      {tip.title}
                    </h4>
                    <p
                      style={{ color: 'var(--text-secondary)' }}
                      className="text-xs leading-relaxed"
                    >
                      {tip.content}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab 4: Quick Check */}
      {activeTab === 'check' && (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          }}
          className="p-4 sm:p-5 rounded-2xl border space-y-4 animate-fadeIn shadow-sm"
        >
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle size={15} />
            <span>Быстрая проверка понимания</span>
          </div>

          <h3
            style={{ color: 'var(--text-primary)' }}
            className="text-sm sm:text-base font-bold leading-snug"
          >
            {lesson.quickCheck.question}
          </h3>

          <div className="space-y-2 pt-2">
            {lesson.quickCheck.options.map((option, idx) => {
              const isSelected = quickCheckAnswer === idx;
              const isCorrect = idx === lesson.quickCheck.correctIndex;

              return (
                <button
                  key={idx}
                  onClick={() => handleQuickCheck(idx)}
                  disabled={quickCheckAnswer !== null}
                  style={{
                    backgroundColor:
                      quickCheckAnswer === null
                        ? 'var(--card-subtle-bg)'
                        : isCorrect
                        ? 'var(--accent-emerald-bg)'
                        : isSelected
                        ? 'var(--accent-rose-bg)'
                        : 'var(--card-subtle-bg)',
                    borderColor:
                      quickCheckAnswer === null
                        ? 'var(--card-border)'
                        : isCorrect
                        ? 'var(--accent-emerald-border)'
                        : isSelected
                        ? 'var(--accent-rose-border)'
                        : 'var(--card-border)',
                    color:
                      quickCheckAnswer === null
                        ? 'var(--text-primary)'
                        : isCorrect
                        ? 'var(--accent-emerald-text)'
                        : isSelected
                        ? 'var(--accent-rose-text)'
                        : 'var(--text-faint)'
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${
                    quickCheckAnswer !== null && !isCorrect && !isSelected ? 'opacity-50' : ''
                  }`}
                >
                  <span>{option}</span>
                  {quickCheckAnswer !== null && (
                    <div className="shrink-0">
                      {isCorrect && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {quickCheckAnswer !== null && (
            <div
              style={{
                backgroundColor:
                  quickCheckAnswer === lesson.quickCheck.correctIndex
                    ? 'var(--accent-emerald-bg)'
                    : 'var(--accent-rose-bg)',
                borderColor:
                  quickCheckAnswer === lesson.quickCheck.correctIndex
                    ? 'var(--accent-emerald-border)'
                    : 'var(--accent-rose-border)',
                color:
                  quickCheckAnswer === lesson.quickCheck.correctIndex
                    ? 'var(--accent-emerald-text)'
                    : 'var(--accent-rose-text)'
              }}
              className="p-3.5 rounded-xl text-xs leading-relaxed border"
            >
              <strong className="block mb-1">
                {quickCheckAnswer === lesson.quickCheck.correctIndex ? '🎉 Идеально! Урок зачтен.' : '💡 Пояснение:'}
              </strong>
              <p>{lesson.quickCheck.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom Pager (Prev / Next Lesson) */}
      <div
        style={{ borderColor: 'var(--card-border)' }}
        className="flex items-center justify-between pt-4 border-t gap-2"
      >
        {prevLesson ? (
          <button
            onClick={() => onSelectLesson(prevLesson.id)}
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)'
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium max-w-[48%] truncate active:scale-95 transition-all shadow-sm hover:opacity-90"
          >
            <ChevronLeft size={14} className="shrink-0" />
            <span className="truncate">{prevLesson.title}</span>
          </button>
        ) : (
          <div></div>
        )}

        {nextLesson && (
          <button
            onClick={() => {
              if (isNextUnlocked) {
                onSelectLesson(nextLesson.id);
              } else {
                // Complete current lesson and navigate
                onCompleteLesson(lesson.id);
                setJustCompletedToast(true);
                setTimeout(() => {
                  onSelectLesson(nextLesson.id);
                }, 300);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md max-w-[48%] truncate active:scale-95 transition-all ml-auto ${
              isNextUnlocked
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            <span className="truncate">
              {isNextUnlocked ? nextLesson.title : `Завершить & Далее`}
            </span>
            {isNextUnlocked ? (
              <ChevronRight size={14} className="shrink-0" />
            ) : (
              <Lock size={12} className="shrink-0 text-indigo-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
