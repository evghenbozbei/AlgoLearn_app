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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>К списку глав</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(lesson.id)}
            id="lesson-bookmark-btn"
            className={`p-2 rounded-xl border transition-all text-xs ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Добавить в закладки"
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>

          <button
            onClick={handleCompleteClick}
            id="lesson-complete-btn"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all active:scale-95 ${
              isCompleted
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
            }`}
          >
            <CheckCircle2 size={14} />
            <span>{isCompleted ? 'Пройдено' : 'Завершить урок'}</span>
          </button>
        </div>
      </div>

      {/* Just Completed Banner */}
      {(justCompletedToast || isCompleted) && nextLesson && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-mono font-bold text-emerald-400">
                Урок пройден • Открыт следующий шаг
              </div>
              <div className="text-xs font-bold text-slate-100 truncate">
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
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-semibold border border-indigo-500/30">
            Время: {lesson.timeComplexity}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono font-semibold border border-purple-500/30">
            Память: {lesson.spaceComplexity}
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-[11px] ml-auto">
            <Clock size={12} />
            <span>{lesson.duration}</span>
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
          {lesson.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          {lesson.shortDesc}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto text-xs font-medium no-scrollbar">
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
              className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 font-semibold bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
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
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Реализация на Python:</span>
              <span className="text-[11px] text-indigo-400">
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
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-slate-100 block mb-1">Разбор логики:</strong>
            {lesson.codeExplanation}
          </div>
        </div>
      )}

      {/* Tab 2: Theory & Analogy */}
      {activeTab === 'theory' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Real world analogy card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase">
              <Sparkles size={14} />
              <span>Аналогия из жизни:</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans italic">
              «{lesson.theory.analogy}»
            </p>
          </div>

          {/* Introduction */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">В чем суть:</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lesson.theory.intro}
            </p>
          </div>

          {/* Key points */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Ключевые моменты:</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {lesson.theory.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* When to use */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-emerald-400">Где это применяется:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {lesson.theory.whenToUse.map((use, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2"
                >
                  <Zap size={14} className="text-emerald-400 shrink-0" />
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
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedRoleTab === r.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
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
                let badgeStyle = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                let iconName = '👨‍💻 Dev';
                if (tip.role === 'qa') {
                  badgeStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                  iconName = '🧪 QA / Тестирование';
                } else if (tip.role === 'devops') {
                  badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                  iconName = '🛠 DevOps / Инфраструктура';
                }

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${badgeStyle}`}>
                        {iconName}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{tip.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{tip.content}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Tab 4: Quick Check */}
      {activeTab === 'check' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle size={15} />
            <span>Быстрая проверка понимания</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
            {lesson.quickCheck.question}
          </h3>

          <div className="space-y-2 pt-2">
            {lesson.quickCheck.options.map((option, idx) => {
              const isSelected = quickCheckAnswer === idx;
              const isCorrect = idx === lesson.quickCheck.correctIndex;
              let style = 'bg-slate-950/70 border-slate-800 hover:bg-slate-800 text-slate-200';

              if (quickCheckAnswer !== null) {
                if (isCorrect) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
                } else if (isSelected) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
                } else {
                  style = 'bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleQuickCheck(idx)}
                  disabled={quickCheckAnswer !== null}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 active:scale-[0.99] ${style}`}
                >
                  <span>{option}</span>
                  {quickCheckAnswer !== null && (
                    <div className="shrink-0">
                      {isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {quickCheckAnswer !== null && (
            <div
              className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                quickCheckAnswer === lesson.quickCheck.correctIndex
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}
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
      <div className="flex items-center justify-between pt-4 border-t border-slate-800 gap-2">
        {prevLesson ? (
          <button
            onClick={() => onSelectLesson(prevLesson.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium max-w-[48%] truncate active:scale-95 transition-all"
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
