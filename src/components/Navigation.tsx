import React from 'react';
import {
  BookOpen,
  Sliders,
  Bug,
  HelpCircle,
  BarChart3,
  Smartphone,
  Monitor,
  Flame,
  Code
} from 'lucide-react';

export type MainNavTab = 'lessons' | 'sandbox' | 'bugs' | 'quiz' | 'progress';

interface NavigationProps {
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  streakCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  isMobileFrame,
  onToggleFrame,
  streakCount
}) => {
  return (
    <>
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Logo & Brand */}
          <div
            onClick={() => onTabChange('lessons')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Code size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  AlgoLearn
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  Python
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                Dev • QA • DevOps
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Screen Mode Switcher */}
            <button
              onClick={onToggleFrame}
              title={isMobileFrame ? 'Переключить на полный экран' : 'Переключить в мобильный фрейм'}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs transition-colors"
            >
              {isMobileFrame ? (
                <>
                  <Monitor size={14} className="text-indigo-400" />
                  <span>Широкий экран</span>
                </>
              ) : (
                <>
                  <Smartphone size={14} className="text-emerald-400" />
                  <span>Мобильный вид</span>
                </>
              )}
            </button>

            {/* Streak Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Flame size={13} className="text-amber-400 fill-amber-400" />
              <span>{streakCount}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Floating Mobile Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 shadow-2xl">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { key: 'lessons', label: 'Уроки', icon: BookOpen },
            { key: 'sandbox', label: 'Песочница', icon: Sliders },
            { key: 'bugs', label: 'Найди баг', icon: Bug },
            { key: 'quiz', label: 'Квиз', icon: HelpCircle },
            { key: 'progress', label: 'Профиль', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                id={`nav-tab-${tab.key}`}
                onClick={() => onTabChange(tab.key as MainNavTab)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive ? 'bg-indigo-500/15 scale-110' : ''
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span className="text-[10px] mt-0.5">{tab.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-400" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
