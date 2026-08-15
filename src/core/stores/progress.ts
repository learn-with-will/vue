import { reactive, computed, watch } from 'vue';
import {
  EMPTY_PROGRESS,
  PROGRESS_STORAGE_KEY,
  type QuizResultRecord,
  type UserProgress,
} from '../models/progress';

function read(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return structuredClone(EMPTY_PROGRESS);
    return { ...structuredClone(EMPTY_PROGRESS), ...JSON.parse(raw) };
  } catch {
    return structuredClone(EMPTY_PROGRESS);
  }
}

// Module-scoped reactive state → one shared progress store for the whole app.
// A deep watcher writes every change through to localStorage.
const state = reactive<UserProgress>(read());

watch(
  state,
  (value) => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* storage may be unavailable (private mode); ignore */
    }
  },
  { deep: true },
);

const completedCount = computed(() => state.completedLessons.length);
const bookmarks = computed(() => state.bookmarkedLessons);
const averageScore = computed(() => {
  const scores = Object.values(state.quizResults).map((r) => r.score);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
});

function isCompleted(lessonId: string): boolean {
  return state.completedLessons.includes(lessonId);
}
function isBookmarked(lessonId: string): boolean {
  return state.bookmarkedLessons.includes(lessonId);
}
function quizResult(lessonId: string): QuizResultRecord | undefined {
  return state.quizResults[lessonId];
}
function setCompleted(lessonId: string, completed: boolean): void {
  const has = state.completedLessons.includes(lessonId);
  if (completed && !has) state.completedLessons.push(lessonId);
  else if (!completed && has)
    state.completedLessons = state.completedLessons.filter((id) => id !== lessonId);
}
function toggleCompleted(lessonId: string): void {
  setCompleted(lessonId, !state.completedLessons.includes(lessonId));
}
function toggleBookmark(lessonId: string): void {
  if (state.bookmarkedLessons.includes(lessonId))
    state.bookmarkedLessons = state.bookmarkedLessons.filter((id) => id !== lessonId);
  else state.bookmarkedLessons.push(lessonId);
}
function setLastOpened(lessonId: string): void {
  state.lastOpenedLesson = lessonId;
}
function recordQuizResult(lessonId: string, score: number, passed: boolean): void {
  state.quizResults[lessonId] = { score, passed, completedAt: new Date().toISOString() };
}
function reset(): void {
  const fresh = structuredClone(EMPTY_PROGRESS);
  state.completedLessons = fresh.completedLessons;
  state.bookmarkedLessons = fresh.bookmarkedLessons;
  state.quizResults = fresh.quizResults;
  state.lastOpenedLesson = undefined;
}

export function useProgress() {
  return {
    state,
    completedCount,
    bookmarks,
    averageScore,
    isCompleted,
    isBookmarked,
    quizResult,
    setCompleted,
    toggleCompleted,
    toggleBookmark,
    setLastOpened,
    recordQuizResult,
    reset,
  };
}
