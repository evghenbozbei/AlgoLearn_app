import React, { useState, useEffect } from 'react';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import { UserProgress, RoleFilter, Lesson } from './types';
import { CHAPTERS } from './data/chapters';
import { Navigation, MainNavTab } from './components/Navigation';
import { ChapterList } from './components/ChapterList';
import { LessonView } from './components/LessonView';
import { Sandbox } from './components/Sandbox';
import { BugHunter } from './components/BugHunter';
import { QuizView } from './components/QuizView';
import { ProgressView } from './components/ProgressView';
import { DeviceFrame } from './components/DeviceFrame';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<MainNavTab>('lessons');
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeRoleFilter, setActiveRoleFilter] = useState<RoleFilter>('all');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(() => {
    // Enable frame on wide screens by default for mobile feel
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return false;
  });

  // Save progress whenever it updates
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Handle lesson completion
  const handleCompleteLesson = (lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      };
    });
  };

  // Handle bookmark toggle
  const handleToggleBookmark = (lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedLessons.includes(lessonId);
      return {
        ...prev,
        bookmarkedLessons: exists
          ? prev.bookmarkedLessons.filter((id) => id !== lessonId)
          : [...prev.bookmarkedLessons, lessonId]
      };
    });
  };

  // Handle bug challenge completion
  const handleCompleteBug = (bugId: string) => {
    setProgress((prev) => {
      if (prev.completedBugs.includes(bugId)) return prev;
      return {
        ...prev,
        completedBugs: [...prev.completedBugs, bugId]
      };
    });
  };

  // Handle quiz score saving
  const handleSaveQuizScore = (chapterId: string, score: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [chapterId]: Math.max(prev.quizScores[chapterId] || 0, score)
      }
    }));
  };

  // Handle reset
  const handleResetProgress = () => {
    const initial: UserProgress = {
      completedLessons: [],
      bookmarkedLessons: [],
      completedBugs: [],
      quizScores: {},
      currentStreak: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10)
    };
    setProgress(initial);
    saveUserProgress(initial);
  };

  // Handle toggle sequential mode
  const handleToggleSequentialMode = () => {
    setProgress((prev) => ({
      ...prev,
      sequentialMode: prev.sequentialMode === false ? true : false
    }));
  };

  // Find currently selected lesson
  const currentLesson: Lesson | undefined = selectedLessonId
    ? CHAPTERS.flatMap((c) => c.lessons).find((l) => l.id === selectedLessonId)
    : undefined;

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: MainNavTab) => {
    setActiveTab(tab);
    if (tab !== 'lessons') {
      setSelectedLessonId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--text-primary)'
      }}
      className="min-h-screen flex flex-col font-sans transition-colors duration-200"
    >
      {/* Launch Splash Screen Overlay */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Navigation Header & Bottom Floating Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileFrame={isMobileFrame}
        onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        streakCount={progress.currentStreak}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <DeviceFrame isMobileFrame={isMobileFrame}>
          {activeTab === 'lessons' && (
            <>
              {currentLesson ? (
                <LessonView
                  lesson={currentLesson}
                  progress={progress}
                  onBack={() => setSelectedLessonId(null)}
                  onSelectLesson={handleSelectLesson}
                  onToggleBookmark={handleToggleBookmark}
                  onCompleteLesson={handleCompleteLesson}
                />
              ) : (
                <ChapterList
                  progress={progress}
                  onSelectLesson={handleSelectLesson}
                  activeRoleFilter={activeRoleFilter}
                  onRoleFilterChange={setActiveRoleFilter}
                  onToggleSequentialMode={handleToggleSequentialMode}
                />
              )}
            </>
          )}

          {activeTab === 'sandbox' && <Sandbox />}

          {activeTab === 'bugs' && (
            <BugHunter
              progress={progress}
              onCompleteBug={handleCompleteBug}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizView
              onSaveScore={handleSaveQuizScore}
              onClose={() => handleTabChange('lessons')}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              progress={progress}
              onSelectLesson={handleSelectLesson}
              onResetProgress={handleResetProgress}
              onToggleSequentialMode={handleToggleSequentialMode}
            />
          )}
        </DeviceFrame>
      </main>
    </div>
  );
}
