import React from 'react';
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
  Play
} from 'lucide-react';
import { UserProgress, Lesson } from '../types';
import { CHAPTERS } from '../data/chapters';
import { BUG_CHALLENGES } from '../data/bugChallenges';
import { getFirstIncompleteLesson, getUnlockedLessonsCount } from '../utils/progression';

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
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border border-indigo-500/30">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Trophy size={15} />
          <span>Личный кабинет & Статистика</span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Твой прогресс в алгоритмах</h1>
        <p className="text-xs text-slate-300 mt-1">
          Отслеживай пройденные темы, цепочку открытых уроков и решенные баги.
        </p>
      </div>

      {/* Next Step Action Banner */}
      {nextLesson && completedLessonsCount < totalLessons && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/50 to-slate-900 border border-indigo-500/40 flex items-center justify-between gap-3 shadow-lg">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold uppercase">
              <Sparkles size={14} />
              <span>Текущий шаг обучения:</span>
            </div>
            <h3 className="text-sm font-bold text-white truncate mt-0.5">
              {nextLesson.title}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
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
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Пройдено уроков</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold font-mono text-white">
              {completedLessonsCount}
            </span>
            <span className="text-xs text-slate-400 font-mono"> / {totalLessons}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Открыто тем</span>
            <Unlock size={16} className="text-indigo-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold font-mono text-indigo-300">
              {unlockedLessonsCount}
            </span>
            <span className="text-xs text-slate-400 font-mono"> / {totalLessons}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Ударный режим</span>
            <Flame size={16} className="text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold font-mono text-amber-300">
              {progress.currentStreak}
            </span>
            <span className="text-xs text-slate-400 font-mono"> дн.</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Найденные баги</span>
            <Bug size={16} className="text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-extrabold font-mono text-rose-300">
              {progress.completedBugs.length}
            </span>
            <span className="text-xs text-slate-400 font-mono"> / {BUG_CHALLENGES.length}</span>
          </div>
        </div>
      </div>

      {/* Sequential Unlock Preference Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Режим доступа к материалам:
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                sequentialMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {sequentialMode ? '🔒 Последовательный' : '🔓 Свободный'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {sequentialMode
                ? 'Новые уроки открываются поочередно после завершения предыдущих для лучшего усвоения.'
                : 'Все уроки и темы открыты без предварительных условий.'}
            </p>
          </div>

          {onToggleSequentialMode && (
            <button
              onClick={onToggleSequentialMode}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                sequentialMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {sequentialMode ? 'Открыть все' : 'Включить пошаговый'}
            </button>
          )}
        </div>
      </div>

      {/* Role Progress Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Прогресс по специализациям
        </h3>

        <div className="space-y-3 text-xs">
          {/* Dev */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>👨‍💻 Разработчик (Python Code & Patterns)</span>
              <span className="font-mono font-bold text-indigo-400">{devDone} / {devLessons.length}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all"
                style={{ width: `${(devDone / devLessons.length) * 100}%` }}
              />
            </div>
          </div>

          {/* QA */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>🧪 QA Тестировщик (Граничные значения & Баги)</span>
              <span className="font-mono font-bold text-rose-400">{qaDone} / {qaLessons.length}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${(qaDone / qaLessons.length) * 100}%` }}
              />
            </div>
          </div>

          {/* DevOps */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>🛠 DevOps Инженер (Retry, Round Robin, Queues)</span>
              <span className="font-mono font-bold text-emerald-400">{devopsDone} / {devopsLessons.length}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${(devopsDone / devopsLessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookmarked Lessons Section */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Bookmark size={14} className="text-amber-400" />
          <span>Сохраненные закладки</span>
        </h3>

        {bookmarkedLessons.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 italic">
            Вы пока не добавили ни одного урока в закладки. Нажмите на иконку закладки в любом уроке!
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarkedLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => onSelectLesson(l.id)}
                className="w-full p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <h4 className="font-semibold text-slate-100">{l.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{l.shortDesc}</p>
                </div>
                <span className="font-mono text-[10px] text-indigo-400 px-2 py-0.5 rounded bg-slate-900">
                  {l.timeComplexity}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reset Progress Section */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            if (window.confirm('Сбросить весь сохраненный прогресс и начать заново с 1 урока?')) {
              onResetProgress();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-rose-400/80 hover:text-rose-300 transition-colors p-2"
        >
          <RotateCcw size={13} />
          <span>Сбросить весь прогресс</span>
        </button>
      </div>
    </div>
  );
};
