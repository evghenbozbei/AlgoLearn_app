import React, { useState, useEffect } from 'react';
import appIconUrl from '../assets/images/app_icon_1788125719420.jpg';
import { Sparkles, Terminal, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2600
}) => {
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Инициализация среды Python 3.12...');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgressPercent(progress);

      if (progress < 35) {
        setStatusText('Загрузка модулей алгоритмов и структур данных...');
      } else if (progress < 75) {
        setStatusText('Подготовка песочницы и тестов для Dev, QA & DevOps...');
      } else if (progress < 95) {
        setStatusText('Синхронизация прогресса обучения...');
      } else {
        setStatusText('Добро пожаловать в AlgoLearn!');
      }

      if (elapsed >= durationMs) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 350); // Small delay for smooth opacity transition
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationMs, onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 200);
  };

  return (
    <div
      id="app-splash-screen"
      className={`fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Skip Button */}
      <div className="w-full max-w-sm flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
          <Terminal size={12} className="text-indigo-400" />
          <span>v1.2.0 • Python 3.12</span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all flex items-center gap-1"
        >
          <span>Пропустить</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Center Hero Badge & Brand */}
      <div className="flex flex-col items-center text-center space-y-6 z-10 max-w-sm">
        {/* Glowing Icon Container */}
        <div className="relative group">
          {/* Radar wave animation */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-3xl opacity-40 blur-lg animate-pulse" />
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-b from-indigo-500/40 via-slate-800 to-slate-900 border border-indigo-400/30 shadow-2xl shadow-indigo-950 flex items-center justify-center">
            <img
              src={appIconUrl}
              alt="AlgoLearn Python Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[22px] shadow-inner"
            />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold tracking-wide">
            <Sparkles size={13} className="text-indigo-400" />
            <span>Interactive Learning Platform</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AlgoLearn <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Python</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-4">
            Алгоритмы, структуры данных и реальные кейсы с пошаговой визуализацией
          </p>
        </div>

        {/* Role Pills */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-indigo-500/30 text-indigo-300 font-semibold shadow-sm">
            👨‍💻 Dev
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-rose-500/30 text-rose-300 font-semibold shadow-sm">
            🧪 QA
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-emerald-500/30 text-emerald-300 font-semibold shadow-sm">
            🛠 DevOps
          </span>
        </div>
      </div>

      {/* Bottom Progress Bar & Loading Status */}
      <div className="w-full max-w-xs space-y-2 z-10 text-center">
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
          <div
            className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-75 ease-out shadow-sm shadow-indigo-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span className="truncate pr-2">{statusText}</span>
          <span className="text-indigo-400 font-bold">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};
