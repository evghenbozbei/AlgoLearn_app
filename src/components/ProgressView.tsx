import React from 'react';
import appIconUrl from '../assets/images/app_icon_1788125719420.jpg';
import {
  Trophy,
  Flame,
  Bookmark,
  CheckCircle2,
  Bug,
  RotateCcw,
  BookOpen,
  Award,
  Zap,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  Play,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { UserProgress, Lesson } from '../types';
import { CHAPTERS } from '../data/chapters';
import { BUG_CHALLENGES } from '../data/bugChallenges';
import { getFirstIncompleteLesson, getUnlockedLessonsCount } from '../utils/progression';
import { useTheme } from '../context/ThemeContext';

interface ProgressViewProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
  onResetProgress: () => void;
  onToggleSequentialMode?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onSelectLesson,
  onResetProgress,
  onToggleSequentialMode
}) => {
  const { theme, setTheme } = useTheme();

  const allLessons = CHAPTERS.flatMap((c) => c.lessons);
  const totalLessons = allLessons.length;
  const completedLessonsCount = progress.completedLessons.length;
  const sequentialMode = progress.sequentialMode !== false;
  const unlockedLessonsCount = getUnlockedLessonsCount(progress.completedLessons, sequentialMode);

  const bookmarkedLessons = allLessons.filter((l) =>
    progress.bookmarkedLessons.includes(l.id)
  );

  const nextLesson = getFirstIncompleteLesson(progress.completedLessons);

  // Role Breakdown
  const devLessons = allLessons.filter((l) => l.targetRoles.includes('dev'));
  const qaLessons = allLessons.filter((l) => l.targetRoles.includes('qa'));
  const devopsLessons = allLessons.filter((l) => l.targetRoles.includes('devops'));

  const devDone = devLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
  const qaDone = qaLessons.filter((l) => progress.completedLessons.includes(l.id)).length;
  const devopsDone = devopsLessons.filter((l) => progress.completedLessons.includes(l.id)).length;

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border shadow-md transition-colors"
      >
        <div className="flex items-center gap-2 text-indigo-500 text-xs font-semibold uppercase tracking-wider">
          <Trophy size={15} />
          <span>Личный кабинет & Статистика</span>
        </div>
        <h1
          style={{ color: 'var(--text-primary)' }}
          className="text-xl font-bold mt-1"
        >
          Твой прогресс в алгоритмах
        </h1>
        <p
          style={{ color: 'var(--text-muted)' }}
          className="text-xs mt-1"
        >
          Отслеживай пройденные темы, цепочку открытых уроков и решенные баги.
        </p>
      </div>

      {/* Theme Appearance Selector Card */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border space-y-3 shadow-sm transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-indigo-500" />
            <h3
              style={{ color: 'var(--text-primary)' }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Тема оформления
            </h3>
          </div>
          <span
            style={{ color: 'var(--text-muted)' }}
            className="text-[11px] font-mono"
          >
            CSS Custom Properties
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="theme-dark-opt"
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-indigo-500 text-white shadow-md shadow-indigo-950 ring-2 ring-indigo-500/30'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Moon size={15} className="text-indigo-400" />
            <span>Тёмная тема</span>
          </button>

          <button
            id="theme-light-opt"
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'bg-white border-indigo-500 text-slate-900 shadow-md shadow-slate-200 ring-2 ring-indigo-500/30'
                : 'bg-slate-100/50 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sun size={15} className="text-amber-500" />
            <span>Светлая тема</span>
          </button>
        </div>
      </div>

      {/* Next Step Action Banner */}
      {nextLesson && completedLessonsCount < totalLessons && (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--accent-indigo-border)'
          }}
          className="p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-md transition-colors"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-bold uppercase">
              <Sparkles size={14} />
              <span>Текущий шаг обучения:</span>
            </div>
            <h3
              style={{ color: 'var(--text-primary)' }}
              className="text-sm font-bold truncate mt-0.5"
            >
              {nextLesson.title}
            </h3>
            <p
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] truncate"
            >
              {nextLesson.shortDesc}
            </p>
          </div>
          <button
            onClick={() => onSelectLesson(nextLesson.id)}
            className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
          >
            <Play size={13} className="fill-white" />
            <span>Продолжить</span>
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          }}
          className="p-3.5 rounded-2xl border flex flex-col justify-between shadow-sm transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] font-medium"
            >
              Пройдено уроков
            </span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2">
            <span
              style={{ color: 'var(--text-primary)' }}
              className="text-xl font-extrabold font-mono"
            >
              {completedLessonsCount}
            </span>
            <span
              style={{ color: 'var(--text-faint)' }}
              className="text-xs font-mono"
            >
              {' '}
              / {totalLessons}
            </span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          }}
          className="p-3.5 rounded-2xl border flex flex-col justify-between shadow-sm transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] font-medium"
            >
              Открыто тем
            </span>
            <Unlock size={16} className="text-indigo-500" />
          </div>
          <div className="mt-2">
            <span
              style={{ color: 'var(--accent-indigo-text)' }}
              className="text-xl font-extrabold font-mono"
            >
              {unlockedLessonsCount}
            </span>
            <span
              style={{ color: 'var(--text-faint)' }}
              className="text-xs font-mono"
            >
              {' '}
              / {totalLessons}
            </span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          }}
          className="p-3.5 rounded-2xl border flex flex-col justify-between shadow-sm transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] font-medium"
            >
              Ударный режим
            </span>
            <Flame size={16} className="text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2">
            <span
              style={{ color: 'var(--accent-amber-text)' }}
              className="text-xl font-extrabold font-mono"
            >
              {progress.currentStreak}
            </span>
            <span
              style={{ color: 'var(--text-faint)' }}
              className="text-xs font-mono"
            >
              {' '}
              дн.
            </span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)'
          }}
          className="p-3.5 rounded-2xl border flex flex-col justify-between shadow-sm transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] font-medium"
            >
              Найденные баги
            </span>
            <Bug size={16} className="text-rose-500" />
          </div>
          <div className="mt-2">
            <span
              style={{ color: 'var(--accent-rose-text)' }}
              className="text-xl font-extrabold font-mono"
            >
              {progress.completedBugs.length}
            </span>
            <span
              style={{ color: 'var(--text-faint)' }}
              className="text-xs font-mono"
            >
              {' '}
              / {BUG_CHALLENGES.length}
            </span>
          </div>
        </div>
      </div>

      {/* Sequential Unlock Preference Card */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border space-y-3 shadow-sm transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                style={{ color: 'var(--text-primary)' }}
                className="text-xs font-bold uppercase tracking-wider"
              >
                Режим доступа к материалам:
              </span>
              <span
                style={{
                  backgroundColor: sequentialMode
                    ? 'var(--accent-indigo-bg)'
                    : 'var(--accent-emerald-bg)',
                  color: sequentialMode
                    ? 'var(--accent-indigo-text)'
                    : 'var(--accent-emerald-text)',
                  borderColor: sequentialMode
                    ? 'var(--accent-indigo-border)'
                    : 'var(--accent-emerald-border)'
                }}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
              >
                {sequentialMode ? '🔒 Последовательный' : '🔓 Свободный'}
              </span>
            </div>
            <p
              style={{ color: 'var(--text-muted)' }}
              className="text-xs"
            >
              {sequentialMode
                ? 'Новые уроки открываются поочередно после завершения предыдущих для лучшего усвоения.'
                : 'Все уроки и темы открыты без предварительных условий.'}
            </p>
          </div>

          {onToggleSequentialMode && (
            <button
              onClick={onToggleSequentialMode}
              style={{
                backgroundColor: sequentialMode ? 'var(--card-subtle-bg)' : undefined,
                borderColor: sequentialMode ? 'var(--card-border)' : undefined,
                color: sequentialMode ? 'var(--text-secondary)' : undefined
              }}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                sequentialMode
                  ? 'border hover:opacity-90'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {sequentialMode ? 'Открыть все' : 'Включить пошаговый'}
            </button>
          )}
        </div>
      </div>

      {/* Role Progress Breakdown */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border space-y-3 shadow-sm transition-colors"
      >
        <h3
          style={{ color: 'var(--text-secondary)' }}
          className="text-xs font-bold uppercase tracking-wider"
        >
          Прогресс по специализациям
        </h3>

        <div className="space-y-3 text-xs">
          {/* Dev */}
          <div className="space-y-1">
            <div
              style={{ color: 'var(--text-secondary)' }}
              className="flex justify-between"
            >
              <span>👨‍💻 Разработчик (Python Code & Patterns)</span>
              <span className="font-mono font-bold text-indigo-500">
                {devDone} / {devLessons.length}
              </span>
            </div>
            <div
              style={{ backgroundColor: 'var(--card-subtle-bg)' }}
              className="w-full h-1.5 rounded-full overflow-hidden"
            >
              <div
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${(devDone / devLessons.length) * 100}%` }}
              />
            </div>
          </div>

          {/* QA */}
          <div className="space-y-1">
            <div
              style={{ color: 'var(--text-secondary)' }}
              className="flex justify-between"
            >
              <span>🧪 QA Тестировщик (Граничные значения & Баги)</span>
              <span className="font-mono font-bold text-rose-500">
                {qaDone} / {qaLessons.length}
              </span>
            </div>
            <div
              style={{ backgroundColor: 'var(--card-subtle-bg)' }}
              className="w-full h-1.5 rounded-full overflow-hidden"
            >
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${(qaDone / qaLessons.length) * 100}%` }}
              />
            </div>
          </div>

          {/* DevOps */}
          <div className="space-y-1">
            <div
              style={{ color: 'var(--text-secondary)' }}
              className="flex justify-between"
            >
              <span>🛠 DevOps Инженер (Retry, Round Robin, Queues)</span>
              <span className="font-mono font-bold text-emerald-500">
                {devopsDone} / {devopsLessons.length}
              </span>
            </div>
            <div
              style={{ backgroundColor: 'var(--card-subtle-bg)' }}
              className="w-full h-1.5 rounded-full overflow-hidden"
            >
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${(devopsDone / devopsLessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarked Lessons Section */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border space-y-3 shadow-sm transition-colors"
      >
        <h3
          style={{ color: 'var(--text-secondary)' }}
          className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <Bookmark size={14} className="text-amber-500" />
          <span>Сохраненные закладки</span>
        </h3>

        {bookmarkedLessons.length === 0 ? (
          <div
            style={{ color: 'var(--text-faint)' }}
            className="p-4 text-center text-xs italic"
          >
            Вы пока не добавили ни одного урока в закладки. Нажмите на иконку закладки в любом уроке!
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarkedLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => onSelectLesson(l.id)}
                style={{
                  backgroundColor: 'var(--card-subtle-bg)',
                  borderColor: 'var(--card-border)'
                }}
                className="w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors hover:opacity-90"
              >
                <div>
                  <h4
                    style={{ color: 'var(--text-primary)' }}
                    className="font-semibold"
                  >
                    {l.title}
                  </h4>
                  <p
                    style={{ color: 'var(--text-muted)' }}
                    className="text-[11px] line-clamp-1"
                  >
                    {l.shortDesc}
                  </p>
                </div>
                <span
                  style={{
                    backgroundColor: 'var(--accent-indigo-bg)',
                    color: 'var(--accent-indigo-text)',
                    borderColor: 'var(--accent-indigo-border)'
                  }}
                  className="font-mono text-[10px] px-2 py-0.5 rounded border"
                >
                  {l.timeComplexity}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* App Badge & Info */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--card-border)'
        }}
        className="p-4 rounded-2xl border flex items-center justify-between gap-3.5 shadow-sm transition-colors"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={appIconUrl}
            alt="AlgoLearn Python App Icon"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-xl object-cover shadow-md border border-indigo-500/30 shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4
                style={{ color: 'var(--text-primary)' }}
                className="text-xs sm:text-sm font-bold"
              >
                AlgoLearn Python
              </h4>
              <span
                style={{
                  backgroundColor: 'var(--accent-indigo-bg)',
                  color: 'var(--accent-indigo-text)',
                  borderColor: 'var(--accent-indigo-border)'
                }}
                className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border"
              >
                v1.2 Mobile
              </span>
            </div>
            <p
              style={{ color: 'var(--text-muted)' }}
              className="text-[11px] mt-0.5"
            >
              Python 3.12 • Интерактивный тренажер алгоритмов для Dev, QA & DevOps
            </p>
          </div>
        </div>
      </div>

      {/* Reset Progress Section */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            if (window.confirm('Сбросить весь сохраненный прогресс и начать заново с 1 урока?')) {
              onResetProgress();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 transition-colors p-2"
        >
          <RotateCcw size={13} />
          <span>Сбросить весь прогресс</span>
        </button>
      </div>
    </div>
  );
};
