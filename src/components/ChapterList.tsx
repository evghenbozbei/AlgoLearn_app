import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
  Flame,
  Award,
  BookOpen,
  Lock,
  Unlock,
  Play,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { CHAPTERS } from '../data/chapters';
import { UserProgress, RoleFilter, Lesson } from '../types';
import {
  isLessonUnlocked,
  getPreviousLesson,
  getFirstIncompleteLesson,
  getUnlockedLessonsCount
} from '../utils/progression';

interface ChapterListProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
  activeRoleFilter: RoleFilter;
  onRoleFilterChange: (role: RoleFilter) => void;
  onToggleSequentialMode?: () => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  progress,
  onSelectLesson,
  activeRoleFilter,
  onRoleFilterChange,
  onToggleSequentialMode
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedChapters, setExpandedChapters] = useState<{ [key: string]: boolean }>({
    'ch-1': true,
    'ch-2': true,
    'ch-3': true,
    'ch-4': true,
    'ch-5': true
  });

  // Modal state for locked lesson click
  const [lockedModalLesson, setLockedModalLesson] = useState<Lesson | null>(null);

  const sequentialMode = progress.sequentialMode !== false;

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  // Filter lessons
  const filteredChapters = useMemo(() => {
    return CHAPTERS.map((ch) => {
      const lessons = ch.lessons.filter((l) => {
        // Search query match
        const matchesSearch =
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.timeComplexity.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ch.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Role filter match
        const matchesRole =
          activeRoleFilter === 'all' || l.targetRoles.includes(activeRoleFilter as any);

        return matchesSearch && matchesRole;
      });

      return {
        ...ch,
        filteredLessons: lessons
      };
    }).filter((ch) => ch.filteredLessons.length > 0);
  }, [searchQuery, activeRoleFilter]);

  const totalLessons = CHAPTERS.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedCount = progress.completedLessons.length;
  const unlockedCount = getUnlockedLessonsCount(progress.completedLessons, sequentialMode);
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const nextActiveLesson = getFirstIncompleteLesson(progress.completedLessons);

  const handleLessonClick = (lesson: Lesson, isUnlocked: boolean) => {
    if (!isUnlocked) {
      setLockedModalLesson(lesson);
      return;
    }
    onSelectLesson(lesson.id);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Welcome Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-950 border border-indigo-500/30 relative overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <span>Python 3.12 Edition</span>
            </span>

            {/* Streak Counter */}
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
              <Flame size={14} className="text-amber-400 fill-amber-400" />
              <span>{progress.currentStreak} дн. ударный режим</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Алгоритмы для Dev, QA & DevOps
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Пошаговая программа обучения: уроки открываются последовательно от простых конструкций к сложным алгоритмам и инфраструктуре.
            </p>
          </div>

          {/* Quick Continue Card if not all finished */}
          {nextActiveLesson && completedCount < totalLessons && (
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-between gap-3 shadow-inner">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-300 font-semibold uppercase tracking-wider">
                  <Sparkles size={12} className="text-indigo-400" />
                  <span>Следующий шаг в обучении:</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                  {nextActiveLesson.title}
                </h4>
              </div>
              <button
                onClick={() => onSelectLesson(nextActiveLesson.id)}
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/30 active:scale-95 transition-all"
              >
                <span>Начать</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}

          {/* Overall Progress Meter */}
          <div className="pt-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-indigo-400" />
                <span>Прогресс курса</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {completedCount} / {totalLessons} уроков ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-0.5 font-mono">
              <span>Доступно: {unlockedCount} из {totalLessons}</span>
              <span>Завершено: {completedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switch & Filter Bar */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${sequentialMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {sequentialMode ? <Lock size={15} /> : <Unlock size={15} />}
          </div>
          <div>
            <div className="font-bold text-slate-200">
              {sequentialMode ? 'Последовательный доступ' : 'Свободный доступ'}
            </div>
            <div className="text-[10px] text-slate-400">
              {sequentialMode
                ? 'Уроки открываются по цепочке'
                : 'Все уроки доступны сразу'}
            </div>
          </div>
        </div>

        {onToggleSequentialMode && (
          <button
            onClick={onToggleSequentialMode}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
          >
            {sequentialMode ? 'Открыть все уроки' : 'Включить цепочку'}
          </button>
        )}
      </div>

      {/* Role Filter Selector */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 px-1 uppercase tracking-wider">
          Выбор специализации:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { key: 'all', label: '🌟 Все темы', desc: 'Полная база' },
            { key: 'dev', label: '👨‍💻 Разработчик', desc: 'Код & Паттерны' },
            { key: 'qa', label: '🧪 QA Тестировщик', desc: 'Баги & Границы' },
            { key: 'devops', label: '🛠 DevOps Инженер', desc: 'Пайплайны & Retry' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onRoleFilterChange(item.key as RoleFilter)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeRoleFilter === item.key
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/90'
              }`}
            >
              <div className="font-bold text-xs">{item.label}</div>
              <div className="text-[10px] opacity-75 mt-0.5 truncate">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по уроку, теме или Big-O (например: binary, stack, retry)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Chapter Cards Accordion */}
      <div className="space-y-3">
        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapters[chapter.id] ?? true;
          const chapterCompleted = chapter.filteredLessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;

          // Check if chapter has any unlocked lesson
          const chapterUnlockedCount = chapter.filteredLessons.filter((l) =>
            isLessonUnlocked(l.id, progress.completedLessons, sequentialMode)
          ).length;

          return (
            <div
              key={chapter.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800/90 overflow-hidden shadow-md transition-all"
            >
              {/* Chapter Card Header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {chapter.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-indigo-400">
                        Глава {chapter.number}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({chapterCompleted}/{chapter.filteredLessons.length} завершено)
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {chapter.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-slate-500 pl-2">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Lesson Items */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-slate-800/60 bg-slate-950/40">
                  {chapter.filteredLessons.map((lesson) => {
                    const isLessonDone = progress.completedLessons.includes(lesson.id);
                    const isBookmarked = progress.bookmarkedLessons.includes(lesson.id);
                    const isUnlocked = isLessonUnlocked(
                      lesson.id,
                      progress.completedLessons,
                      sequentialMode
                    );
                    const isCurrentNext = nextActiveLesson?.id === lesson.id && !isLessonDone;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson, isUnlocked)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 group active:scale-[0.99] ${
                          isLessonDone
                            ? 'bg-slate-900/40 border-emerald-900/40 hover:bg-slate-800/60'
                            : isCurrentNext
                            ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-950/50 hover:bg-indigo-900/40'
                            : !isUnlocked
                            ? 'bg-slate-950/60 border-slate-900 opacity-60 hover:opacity-80'
                            : 'bg-slate-900/90 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          {/* Status Icon */}
                          <div className="mt-0.5 shrink-0">
                            {isLessonDone ? (
                              <CheckCircle2 size={16} className="text-emerald-400" />
                            ) : !isUnlocked ? (
                              <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                                <Lock size={10} />
                              </div>
                            ) : isCurrentNext ? (
                              <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                                <Play size={8} className="fill-white translate-x-[0.5px]" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-indigo-400 transition-colors" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className={`text-xs sm:text-sm font-semibold truncate ${
                                !isUnlocked
                                  ? 'text-slate-400'
                                  : isCurrentNext
                                  ? 'text-indigo-200'
                                  : 'text-slate-100 group-hover:text-indigo-300'
                              }`}>
                                {lesson.title}
                              </h4>
                              {isCurrentNext && (
                                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold uppercase tracking-wider shrink-0">
                                  Текущий
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-400 truncate">
                              {lesson.shortDesc}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono text-slate-400">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300">
                                {lesson.timeComplexity}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center gap-1">
                                <Clock size={10} />
                                {lesson.duration}
                              </span>

                              {!isUnlocked && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 flex items-center gap-1 text-[9px]">
                                  <Lock size={9} />
                                  <span>Пройдите прошлый урок</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right side icon */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          {isBookmarked && (
                            <div className="text-amber-400">
                              <Bookmark size={14} className="fill-amber-400/30" />
                            </div>
                          )}
                          {!isUnlocked && (
                            <Lock size={14} className="text-slate-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredChapters.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 space-y-2">
            <BookOpen size={28} className="mx-auto text-slate-600" />
            <p className="text-sm">По вашему запросу ничего не найдено.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onRoleFilterChange('all');
              }}
              className="text-xs text-indigo-400 hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog for Locked Lesson */}
      {lockedModalLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setLockedModalLesson(null)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
              <Lock size={22} />
            </div>

            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                Последовательное обучение
              </span>
              <h3 className="text-base font-bold text-white">
                Урок пока заблокирован
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Тема <strong className="text-white">«{lockedModalLesson.title}»</strong> опирается на материал предыдущего урока.
              </p>
            </div>

            {/* Previous lesson reference */}
            {(() => {
              const prev = getPreviousLesson(lockedModalLesson.id);
              if (!prev) return null;
              return (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Сначала необходимо завершить:
                  </div>
                  <div className="text-xs font-bold text-indigo-300">
                    {prev.title}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">
                    {prev.shortDesc}
                  </div>
                </div>
              );
            })()}

            <div className="space-y-2 pt-1">
              {(() => {
                const prev = getPreviousLesson(lockedModalLesson.id);
                if (prev) {
                  return (
                    <button
                      onClick={() => {
                        const targetId = prev.id;
                        setLockedModalLesson(null);
                        onSelectLesson(targetId);
                      }}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
                    >
                      <Play size={13} className="fill-white" />
                      <span>Перейти к уроку «{prev.title}»</span>
                    </button>
                  );
                }
                return null;
              })()}

              <button
                onClick={() => setLockedModalLesson(null)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Понятно
              </button>

              {onToggleSequentialMode && (
                <button
                  onClick={() => {
                    onToggleSequentialMode();
                    const lessonId = lockedModalLesson.id;
                    setLockedModalLesson(null);
                    onSelectLesson(lessonId);
                  }}
                  className="w-full text-center text-[11px] text-indigo-400/80 hover:text-indigo-300 pt-1 underline"
                >
                  Включить свободный режим и открыть всё
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
