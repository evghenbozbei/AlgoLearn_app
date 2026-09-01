import React from 'react';
import appIconUrl from '../assets/images/app_icon_1788125719420.jpg';
import {
  BookOpen,
  Sliders,
  Bug,
  HelpCircle,
  BarChart3,
  Smartphone,
  Monitor,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Top App Bar */}
      <header
        style={{
          backgroundColor: 'var(--header-bg)',
          borderColor: 'var(--header-border)'
        }}
        className="sticky top-0 z-30 backdrop-blur-md border-b px-4 py-3 transition-colors duration-200"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Logo & Brand */}
          <div
            onClick={() => onTabChange('lessons')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <img
              src={appIconUrl}
              alt="AlgoLearn Python Icon"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-xl object-cover shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform border border-indigo-500/30"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span
                  style={{ color: 'var(--text-primary)' }}
                  className="font-extrabold text-sm tracking-tight"
                >
                  AlgoLearn
                </span>
                <span
                  style={{
                    backgroundColor: 'var(--accent-indigo-bg)',
                    borderColor: 'var(--accent-indigo-border)',
                    color: 'var(--accent-indigo-text)'
                  }}
                  className="text-[10px] font-mono px-1.5 py-0.2 rounded font-bold border"
                >
                  Python
                </span>
              </div>
              <span
                style={{ color: 'var(--text-muted)' }}
                className="text-[10px] block -mt-0.5"
              >
                Dev • QA • DevOps
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
              className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 border"
              style={{
                backgroundColor: 'var(--card-subtle-bg)',
                borderColor: 'var(--card-border)',
                color: theme === 'dark' ? '#fde047' : '#4f46e5'
              }}
            >
              {theme === 'dark' ? (
                <Sun size={16} className="animate-spin-slow hover:scale-110 transition-transform" />
              ) : (
                <Moon size={16} className="hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Desktop Screen Mode Switcher */}
            <button
              onClick={onToggleFrame}
              title={isMobileFrame ? 'Переключить на полный экран' : 'Переключить в мобильный фрейм'}
              style={{
                backgroundColor: 'var(--card-subtle-bg)',
                borderColor: 'var(--card-border)',
                color: 'var(--text-secondary)'
              }}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-colors hover:opacity-90"
            >
              {isMobileFrame ? (
                <>
                  <Monitor size={14} className="text-indigo-400" />
                  <span>Широкий экран</span>
                </>
              ) : (
                <>
                  <Smartphone size={14} className="text-emerald-500" />
                  <span>Мобильный вид</span>
                </>
              )}
            </button>

            {/* Streak Badge */}
            <div
              style={{
                backgroundColor: 'var(--accent-amber-bg)',
                borderColor: 'var(--accent-amber-border)',
                color: 'var(--accent-amber-text)'
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-mono font-bold"
            >
              <Flame size={13} className="text-amber-500 fill-amber-500" />
              <span>{streakCount}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Floating Mobile Tab Bar */}
      <nav
        style={{
          backgroundColor: 'var(--nav-bg)',
          borderColor: 'var(--nav-border)'
        }}
        className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-2 py-1.5 shadow-2xl transition-colors duration-200"
      >
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
                    ? 'text-indigo-500 font-semibold'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
