<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useCourse } from '../../core/stores/course';
import { useProgress } from '../../core/stores/progress';
import { evaluate, loadQuizForLesson } from '../../core/services/quizService';
import type { AnswerValue, Quiz, QuizEvaluation } from '../../core/models/quiz';
import type { LessonMeta } from '../../core/models/lesson';
import QuizQuestion from '../../shared/components/QuizQuestion.vue';
import QuizProgress from '../../shared/components/QuizProgress.vue';
import QuizResult from '../../shared/components/QuizResult.vue';
import { useDocumentTitle } from '../../core/composables/useDocumentTitle';

type Phase = 'taking' | 'results' | 'reviewing';

/** Fisher–Yates shuffle that avoids returning the exact correct order. */
function shuffle(ids: string[], avoid: string[]): string[] {
  const arr = [...ids];
  for (let attempt = 0; attempt < 5; attempt++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.length < 2 || arr.some((id, i) => id !== avoid[i])) break;
  }
  return arr;
}

/**
 * Ordering questions need an initial answer so the displayed order is what gets
 * graded. We present a shuffled order (so it isn't trivially correct) and store
 * it as the starting answer.
 */
function buildInitialAnswers(q: Quiz | null): Record<string, AnswerValue> {
  if (!q) return {};
  const defaults: Record<string, AnswerValue> = {};
  for (const question of q.questions) {
    if (question.type === 'ordering') {
      defaults[question.id] = shuffle(
        question.items.map((i) => i.id),
        question.answer,
      );
    }
  }
  return defaults;
}

function hasAnswer(v: AnswerValue | undefined): boolean {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return Object.values(v).some((x) => x);
}

const route = useRoute();
const { getBySlug, loaded } = useCourse();
const { recordQuizResult } = useProgress();

const slug = computed(() => String(route.params.slug ?? ''));
const loading = ref(true);
const lessonMeta = ref<LessonMeta | null>(null);
const quiz = ref<Quiz | null>(null);
const answers = ref<Record<string, AnswerValue>>({});
const phase = ref<Phase>('taking');
const evaluation = ref<QuizEvaluation | null>(null);

useDocumentTitle(() =>
  quiz.value?.title ? `${quiz.value.title} · Quiz` : 'Quiz · Vue.js Learning Portal',
);

async function load(): Promise<void> {
  loading.value = true;
  quiz.value = null;
  lessonMeta.value = null;
  answers.value = {};
  phase.value = 'taking';
  evaluation.value = null;

  if (!loaded.value) return;

  const meta = getBySlug(slug.value);
  lessonMeta.value = meta ?? null;
  if (!meta) {
    loading.value = false;
    return;
  }

  const q = await loadQuizForLesson(meta.id);
  if (slug.value !== meta.slug) return; // a newer navigation won
  quiz.value = q;
  answers.value = buildInitialAnswers(q);
  loading.value = false;
}

watch([slug, loaded], load, { immediate: true });

const answeredCount = computed(
  () => Object.values(answers.value).filter((v) => hasAnswer(v)).length,
);

const resultByQuestion = computed(() => {
  const map = new Map<string, QuizEvaluation['results'][number]>();
  evaluation.value?.results.forEach((r) => map.set(r.questionId, r));
  return map;
});

function setAnswer(questionId: string, value: AnswerValue): void {
  answers.value = { ...answers.value, [questionId]: value };
}

function handleSubmit(): void {
  if (!quiz.value || !lessonMeta.value) return;
  const ev = evaluate(quiz.value, answers.value);
  evaluation.value = ev;
  recordQuizResult(lessonMeta.value.id, ev.score, ev.passed);
  phase.value = 'results';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleRetry(): void {
  answers.value = buildInitialAnswers(quiz.value);
  phase.value = 'taking';
  evaluation.value = null;
}

function resultFor(questionId: string) {
  return phase.value === 'reviewing' ? resultByQuestion.value.get(questionId) : undefined;
}
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
    <div v-if="loading" class="animate-pulse space-y-4" aria-busy="true" aria-label="Loading quiz">
      <div class="h-5 w-40 rounded-full bg-ink-200 dark:bg-ink-800"></div>
      <div class="h-9 w-1/2 rounded-xl bg-ink-200 dark:bg-ink-800"></div>
      <div class="h-32 w-full rounded-2xl bg-ink-200 dark:bg-ink-800"></div>
      <div class="h-32 w-full rounded-2xl bg-ink-200 dark:bg-ink-800"></div>
    </div>

    <div v-else-if="!lessonMeta" class="card border-dashed p-12 text-center">
      <h1 class="heading text-2xl">Lesson not found</h1>
      <RouterLink to="/roadmap" class="btn-primary mt-5">Back to roadmap</RouterLink>
    </div>

    <div v-else-if="!quiz" class="card border-dashed p-12 text-center">
      <span
        class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300"
      >
        <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.7v.5M12 17v.5" stroke-linecap="round" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </span>
      <h1 class="heading text-2xl">No quiz yet</h1>
      <p class="prose-muted mx-auto mt-2 max-w-sm">
        This lesson doesn't have a quiz. Add
        <code
          class="rounded-md bg-ink-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700 dark:bg-ink-800 dark:text-brand-300"
          >quizzes/{{ lessonMeta.id }}.json</code
        >
        to create one.
      </p>
      <RouterLink :to="`/lesson/${lessonMeta.slug}`" class="btn-secondary mt-5">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5m6 6-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Back to lesson
      </RouterLink>
    </div>

    <template v-else>
      <header class="mb-6">
        <RouterLink
          :to="`/lesson/${lessonMeta.slug}`"
          class="focusable inline-flex items-center gap-1.5 rounded text-sm font-bold text-brand-600 hover:text-cyan-600 dark:text-brand-300 dark:hover:text-cyan-400"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path d="M19 12H5m6 6-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ lessonMeta.title }}
        </RouterLink>
        <h1 class="heading mt-2 text-4xl">{{ quiz.title || 'Quiz' }}</h1>
        <p class="prose-muted mt-2 text-sm font-medium">
          {{ quiz.questions.length }} questions · pass mark {{ quiz.passingScore }}%
        </p>
      </header>

      <!-- Result summary -->
      <div v-if="phase !== 'taking' && evaluation" class="mb-8">
        <QuizResult
          :evaluation="evaluation"
          :passing-score="quiz.passingScore"
          @retry="handleRetry"
          @review="phase = 'reviewing'"
        />
      </div>

      <!-- Progress (while taking) -->
      <div
        v-if="phase === 'taking'"
        class="sticky top-[4.5rem] z-10 mb-6 rounded-2xl border border-ink-200 bg-ink-50/90 p-3 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90"
      >
        <QuizProgress :answered="answeredCount" :total="quiz.questions.length" />
      </div>

      <!-- Questions: shown while taking or reviewing -->
      <div v-if="phase !== 'results'" class="space-y-5">
        <QuizQuestion
          v-for="(q, i) in quiz.questions"
          :key="q.id"
          :question="q"
          :index="i"
          :answer="answers[q.id]"
          :result="resultFor(q.id)"
          @answerChange="(value) => setAnswer(q.id, value)"
        />
      </div>

      <div v-if="phase === 'taking'" class="mt-8 flex items-center justify-between gap-4">
        <p class="prose-muted text-sm font-medium tabular-nums">
          {{ answeredCount }} of {{ quiz.questions.length }} answered
        </p>
        <button
          type="button"
          :disabled="answeredCount === 0"
          class="btn-gradient"
          @click="handleSubmit"
        >
          Submit quiz
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div v-else-if="phase === 'reviewing'" class="mt-8 text-center">
        <button type="button" class="btn-primary" @click="handleRetry">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M4 12a8 8 0 1 1 2.3 5.7M4 20v-5h5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Try again
        </button>
      </div>
    </template>
  </div>
</template>
