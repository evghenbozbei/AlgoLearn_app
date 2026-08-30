export type RoleFilter = 'all' | 'dev' | 'qa' | 'devops';

export interface VisualStep {
  id: number;
  description: string;
  codeLine?: number; // 1-indexed line number in python code
  array?: number[];
  pointers?: { [key: string]: number }; // e.g. { i: 2, j: 3, mid: 4, left: 0, right: 6 }
  highlightIndices?: number[];
  secondaryHighlightIndices?: number[];
  sortedIndices?: number[];
  discardedIndices?: number[];
  foundIndex?: number;
  stack?: string[] | number[];
  queue?: string[] | number[];
  treeVisited?: string[];
  currentAction?: 'compare' | 'swap' | 'push' | 'pop' | 'found' | 'discard' | 'init' | 'step';
  metrics?: { [key: string]: string | number };
  customData?: any;
}

export interface LessonRoleTip {
  role: 'dev' | 'qa' | 'devops';
  title: string;
  content: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  shortDesc: string;
  duration: string; // e.g. "5 мин"
  difficulty: 'beginner' | 'intermediate';
  targetRoles: ('dev' | 'qa' | 'devops')[];
  timeComplexity: string; // e.g. "O(log n)"
  spaceComplexity: string; // e.g. "O(1)"
  theory: {
    intro: string;
    analogy: string;
    keyPoints: string[];
    whenToUse: string[];
  };
  pythonCode: string;
  codeExplanation: string;
  visualizerType:
    | 'array-search'
    | 'array-sort'
    | 'two-pointers'
    | 'stack'
    | 'queue'
    | 'recursion-tree'
    | 'graph-bfs-dfs'
    | 'hash-map'
    | 'sliding-window'
    | 'round-robin'
    | 'exponential-backoff'
    | 'rate-limiter';
  initialData?: number[] | string[];
  generateSteps?: (data?: any) => VisualStep[];
  roleTips: LessonRoleTip[];
  quickCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Chapter {
  id: string;
  number: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  targetAudience: string;
  color: string;
  lessons: Lesson[];
}

export interface BugChallenge {
  id: string;
  title: string;
  roleTarget: 'qa' | 'dev' | 'devops';
  difficulty: 'easy' | 'medium';
  scenario: string;
  buggyCode: string;
  correctLineNumber?: number;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  fixedCode: string;
  takeaway: string;
}

export interface QuizQuestion {
  id: string;
  chapterId: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  roleTag?: 'dev' | 'qa' | 'devops';
}

export interface UserProgress {
  completedLessons: string[]; // lesson ids
  bookmarkedLessons: string[];
  completedBugs: string[];
  quizScores: { [chapterId: string]: number };
  currentStreak: number;
  lastActiveDate: string;
  sequentialMode?: boolean; // Sequential progression mode (default: true)
}
