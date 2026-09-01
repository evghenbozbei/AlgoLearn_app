import React, { useState, useMemo } from 'react';
import appIconUrl from '../assets/images/app_icon_1788125719420.jpg';
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
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 sm:p-5 rounded-2xl border relative overflow-hidden shadow-md transition-colors"
      >
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span
              style={{
                backgroundColor: 'var(--accent-indigo-bg)',
                color: 'var(--accent-indigo-text)',
                borderColor: 'var(--accent-indigo-border)'
              }}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1.5"
            >
              <span>Python 3.12 Edition</span>
            </span>

            {/* Streak Counter */}
            <div
              style={{
                backgroundColor: 'var(--accent-amber-bg)',
                color: 'var(--accent-amber-text)',
                borderColor: 'var(--accent-amber-border)'
              }}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-bold font-mono"
            >
              <Flame size={14} className="text-amber-500 fill-amber-500" />
              <span>{progress.currentStreak} дн. ударный режим</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <img
              src={appIconUrl}
              alt="AlgoLearn Python Icon"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-indigo-500/30 shrink-0 hidden sm:block"
            />
            <div>
              <h1
                style={{ color: 'var(--text-primary)' }}
                className="text-xl sm:text-2xl font-extrabold tracking-tight"
              >
                Алгоритмы для Dev, QA & DevOps
              </h1>
              <p
                style={{ color: 'var(--text-muted)' }}
                className="text-xs sm:text-sm mt-1 leading-relaxed"
              >
                Пошаговая программа обучения: уроки открываются последовательно от простых конструкций к сложным алгоритмам и инфраструктуре.
              </p>
            </div>
          </div>

          {/* Quick Continue Card if not all finished */}
          {nextActiveLesson && completedCount < totalLessons && (
            <div
              style={{
                backgroundColor: 'var(--card-subtle-bg)',
                borderColor: 'var(--accent-indigo-border)'
              }}
              className="p-3 rounded-xl border flex items-center justify-between gap-3 shadow-inner"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-500 font-semibold uppercase tracking-wider">
                  <Sparkles size={12} />
                  <span>Следующий шаг в обучении:</span>
                </div>
                <h4
                  style={{ color: 'var(--text-primary)' }}
                  className="text-xs sm:text-sm font-bold truncate mt-0.5"
                >
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
            <div className="flex items-center justify-between text-xs">
              <span
                style={{ color: 'var(--text-secondary)' }}
                className="flex items-center gap-1.5"
              >
                <Award size={14} className="text-indigo-500" />
                <span>Прогресс курса</span>
              </span>
              <span className="font-mono font-bold text-emerald-500">
                {completedCount} / {totalLessons} уроков ({progressPercent}%)
              </span>
            </div>
            <div
              style={{
                backgroundColor: 'var(--card-subtle-bg)',
                borderColor: 'var(--card-border)'
              }}
              className="w-full h-2 rounded-full overflow-hidden p-0.5 border"
            >
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div
              style={{ color: 'var(--text-muted)' }}
              className="flex justify-between text-[11px] pt-0.5 font-mono"
            >
              <span>Доступно: {unlockedCount} из {totalLessons}</span>
              <span>Завершено: {completedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switch & Filter Bar */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-3 rounded-xl border flex items-center justify-between gap-3 text-xs shadow-sm transition-colors"
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: sequentialMode ? 'var(--accent-indigo-bg)' : 'var(--accent-emerald-bg)',
              color: sequentialMode ? 'var(--accent-indigo-text)' : 'var(--accent-emerald-text)'
            }}
            className="p-1.5 rounded-lg"
          >
            {sequentialMode ? <Lock size={15} /> : <Unlock size={15} />}
          </div>
          <div>
            <div
              style={{ color: 'var(--text-primary)' }}
              className="font-bold"
            >
              {sequentialMode ? 'Последовательный доступ' : 'Свободный доступ'}
            </div>
            <div
              style={{ color: 'var(--text-muted)' }}
              className="text-[10px]"
            >
              {sequentialMode
                ? 'Уроки открываются по цепочке'
                : 'Все уроки доступны сразу'}
            </div>
          </div>
        </div>

        {onToggleSequentialMode && (
          <button
            onClick={onToggleSequentialMode}
            style={{
              backgroundColor: 'var(--card-subtle-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-secondary)'
            }}
            className="px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors hover:opacity-90"
          >
            {sequentialMode ? 'Открыть все уроки' : 'Включить цепочку'}
          </button>
        )}
      </div>

      {/* Role Filter Selector */}
      <div className="space-y-1.5">
        <div
          style={{ color: 'var(--text-muted)' }}
          className="text-[11px] font-semibold px-1 uppercase tracking-wider"
        >
          Выбор специализации:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { key: 'all', label: '🌟 Все темы', desc: 'Полная база' },
            { key: 'dev', label: '👨‍💻 Разработчик', desc: 'Код & Паттерны' },
            { key: 'qa', label: '🧪 QA Тестировщик', desc: 'Баги & Границы' },
            { key: 'devops', label: '🛠 DevOps Инженер', desc: 'Пайплайны & Retry' }
          ].map((item) => {
            const isSelected = activeRoleFilter === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onRoleFilterChange(item.key as RoleFilter)}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-indigo-bg)' : 'var(--card-bg)',
                  borderColor: isSelected ? 'var(--accent-indigo-border)' : 'var(--card-border)',
                  color: isSelected ? 'var(--accent-indigo-text)' : 'var(--text-secondary)'
                }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'shadow-md ring-1 ring-indigo-500 font-bold'
                    : 'hover:opacity-90'
                }`}
              >
                <div className="font-bold text-xs">{item.label}</div>
                <div
                  style={{ color: isSelected ? 'var(--accent-indigo-text)' : 'var(--text-muted)' }}
                  className="text-[10px] opacity-80 mt-0.5 truncate"
                >
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search
          size={16}
          style={{ color: 'var(--text-muted)' }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по уроку, теме или Big-O (например: binary, stack, retry)..."
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: 'var(--input-border)',
            color: 'var(--input-fg)'
          }}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
        />
      </div>

      {/* Chapter Cards Accordion */}
      <div className="space-y-3">
        {filteredChapters.map((chapter) => {
          const isExpanded = expandedChapters[chapter.id] ?? true;
          const chapterCompleted = chapter.filteredLessons.filter((l) =>
            progress.completedLessons.includes(l.id)
          ).length;

          return (
            <div
              key={chapter.id}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)'
              }}
              className="rounded-2xl border overflow-hidden shadow-sm transition-all"
            >
              {/* Chapter Card Header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full p-4 flex items-center justify-between text-left transition-colors hover:opacity-90"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      backgroundColor: 'var(--card-subtle-bg)',
                      borderColor: 'var(--card-border)'
                    }}
                    className="w-10 h-10 rounded-xl border flex items-center justify-center text-xl shrink-0 shadow-sm"
                  >
                    {chapter.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-indigo-500">
                        Глава {chapter.number}
                      </span>
                      <span
                        style={{ color: 'var(--text-muted)' }}
                        className="text-[10px] font-mono"
                      >
                        ({chapterCompleted}/{chapter.filteredLessons.length} завершено)
                      </span>
                    </div>
                    <h3
                      style={{ color: 'var(--text-primary)' }}
                      className="text-sm sm:text-base font-bold leading-snug"
                    >
                      {chapter.title}
                    </h3>
                    <p
                      style={{ color: 'var(--text-muted)' }}
                      className="text-xs line-clamp-1"
                    >
                      {chapter.subtitle}
                    </p>
                  </div>
                </div>

                <div
                  style={{ color: 'var(--text-muted)' }}
                  className="pl-2"
                >
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Lesson Items */}
              {isExpanded && (
                <div
                  style={{
                    backgroundColor: 'var(--card-subtle-bg)',
                    borderColor: 'var(--card-border)'
                  }}
                  className="px-3 pb-3 pt-1 space-y-1.5 border-t"
                >
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
                        style={{
                          backgroundColor: isLessonDone
                            ? 'var(--accent-emerald-bg)'
                            : isCurrentNext
                            ? 'var(--accent-indigo-bg)'
                            : 'var(--card-bg)',
                          borderColor: isLessonDone
                            ? 'var(--accent-emerald-border)'
                            : isCurrentNext
                            ? 'var(--accent-indigo-border)'
                            : 'var(--card-border)'
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 group active:scale-[0.99] ${
                          !isUnlocked ? 'opacity-60' : 'hover:opacity-95'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          {/* Status Icon */}
                          <div className="mt-0.5 shrink-0">
                            {isLessonDone ? (
                              <CheckCircle2 size={16} className="text-emerald-500" />
                            ) : !isUnlocked ? (
                              <div
                                style={{
                                  backgroundColor: 'var(--card-subtle-bg)',
                                  borderColor: 'var(--card-border)',
                                  color: 'var(--text-muted)'
                                }}
                                className="w-4 h-4 rounded-full border flex items-center justify-center"
                              >
                                <Lock size={10} />
                              </div>
                            ) : isCurrentNext ? (
                              <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                                <Play size={8} className="fill-white translate-x-[0.5px]" />
                              </div>
                            ) : (
                              <div
                                style={{ borderColor: 'var(--card-border-subtle)' }}
                                className="w-4 h-4 rounded-full border group-hover:border-indigo-400 transition-colors"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4
                                style={{ color: 'var(--text-primary)' }}
                                className="text-xs sm:text-sm font-semibold truncate group-hover:text-indigo-500"
                              >
                                {lesson.title}
                              </h4>
                              {isCurrentNext && (
                                <span
                                  style={{
                                    backgroundColor: 'var(--accent-indigo-bg)',
                                    color: 'var(--accent-indigo-text)',
                                    borderColor: 'var(--accent-indigo-border)'
                                  }}
                                  className="px-1.5 py-0.2 rounded border text-[9px] font-bold uppercase tracking-wider shrink-0"
                                >
                                  Текущий
                                </span>
                              )}
                            </div>

                            <p
                              style={{ color: 'var(--text-muted)' }}
                              className="text-[11px] truncate"
                            >
                              {lesson.shortDesc}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono">
                              <span
                                style={{
                                  backgroundColor: 'var(--accent-indigo-bg)',
                                  color: 'var(--accent-indigo-text)'
                                }}
                                className="px-1.5 py-0.5 rounded font-semibold"
                              >
                                {lesson.timeComplexity}
                              </span>
                              <span
                                style={{
                                  backgroundColor: 'var(--card-subtle-bg)',
                                  color: 'var(--text-muted)'
                                }}
                                className="px-1.5 py-0.5 rounded flex items-center gap-1"
                              >
                                <Clock size={10} />
                                {lesson.duration}
                              </span>

                              {!isUnlocked && (
                                <span
                                  style={{
                                    backgroundColor: 'var(--card-subtle-bg)',
                                    color: 'var(--text-faint)'
                                  }}
                                  className="px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px]"
                                >
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
                            <div className="text-amber-500">
                              <Bookmark size={14} className="fill-amber-500" />
                            </div>
                          )}
                          {!isUnlocked && (
                            <Lock size={14} style={{ color: 'var(--text-faint)' }} />
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
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-muted)'
            }}
            className="p-8 text-center rounded-2xl border space-y-2"
          >
            <BookOpen size={28} className="mx-auto opacity-50" />
            <p className="text-sm">По вашему запросу ничего не найдено.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onRoleFilterChange('all');
              }}
              className="text-xs text-indigo-500 hover:underline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog for Locked Lesson */}
      {lockedModalLesson && (
        <div
          style={{ backgroundColor: 'var(--modal-backdrop)' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
        >
          <div
            style={{
              backgroundColor: 'var(--modal-bg)',
              borderColor: 'var(--modal-border)'
            }}
            className="w-full max-w-sm border rounded-2xl p-5 space-y-4 shadow-2xl relative"
          >
            <button
              onClick={() => setLockedModalLesson(null)}
              style={{ color: 'var(--text-muted)' }}
              className="absolute right-3.5 top-3.5 hover:opacity-80 p-1"
            >
              <X size={18} />
            </button>

            <div
              style={{
                backgroundColor: 'var(--accent-indigo-bg)',
                borderColor: 'var(--accent-indigo-border)',
                color: 'var(--accent-indigo-text)'
              }}
              className="w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto"
            >
              <Lock size={22} />
            </div>

            <div className="text-center space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-500">
                Последовательное обучение
              </span>
              <h3
                style={{ color: 'var(--text-primary)' }}
                className="text-base font-bold"
              >
                Урок пока заблокирован
              </h3>
              <p
                style={{ color: 'var(--text-muted)' }}
                className="text-xs leading-relaxed"
              >
                Тема{' '}
                <strong style={{ color: 'var(--text-primary)' }}>
                  «{lockedModalLesson.title}»
                </strong>{' '}
                опирается на материал предыдущего урока.
              </p>
            </div>

            {/* Previous lesson reference */}
            {(() => {
              const prev = getPreviousLesson(lockedModalLesson.id);
              if (!prev) return null;
              return (
                <div
                  style={{
                    backgroundColor: 'var(--card-subtle-bg)',
                    borderColor: 'var(--card-border)'
                  }}
                  className="p-3 rounded-xl border space-y-1"
                >
                  <div
                    style={{ color: 'var(--text-muted)' }}
                    className="text-[10px] font-semibold uppercase"
                  >
                    Сначала необходимо завершить:
                  </div>
                  <div className="text-xs font-bold text-indigo-500">
                    {prev.title}
                  </div>
                  <div
                    style={{ color: 'var(--text-muted)' }}
                    className="text-[11px] line-clamp-1"
                  >
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
                style={{
                  backgroundColor: 'var(--card-subtle-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-secondary)'
                }}
                className="w-full py-2 rounded-xl border text-xs font-medium transition-colors hover:opacity-90"
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
                  className="w-full text-center text-[11px] text-indigo-500 hover:underline pt-1"
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
