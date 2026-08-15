export interface QuizResultRecord {
  score: number;
  passed: boolean;
  completedAt: string;
}

export interface UserProgress {
  completedLessons: string[];
  bookmarkedLessons: string[];
  lastOpenedLesson?: string;
  quizResults: Record<string, QuizResultRecord>;
}

export const EMPTY_PROGRESS: UserProgress = {
  completedLessons: [],
  bookmarkedLessons: [],
  quizResults: {},
};

// Course-unique key: every course on thachthanhthien.github.io shares one origin,
// so localStorage is shared. A unique key keeps Vue progress separate from the
// other courses' progress.
export const PROGRESS_STORAGE_KEY = 'vue-learning-progress';
