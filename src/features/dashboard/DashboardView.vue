<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCourse } from '../../core/stores/course';
import { useProgress } from '../../core/stores/progress';
import { useDocumentTitle } from '../../core/composables/useDocumentTitle';
import { LEVELS, LEVEL_ACCENTS, LEVEL_LABELS, type LessonLevel } from '../../core/models/lesson';

useDocumentTitle('Dashboard · Vue.js Learning Portal');
const { lessons, lessonsByLevel, getById } = useCourse();
const { completedCount, averageScore, bookmarks, isCompleted, state, reset } = useProgress();

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

const totalLessons = computed(() => lessons.value.length);
const completionPct = computed(() =>
  totalLessons.value === 0 ? 0 : Math.round((completedCount.value / totalLessons.value) * 100),
);
const completedLessons = computed(() => lessons.value.filter((l) => isCompleted(l.id)));

const quizHistory = computed(() =>
  Object.entries(state.quizResults)
    .map(([lessonId, r]) => ({
      lesson: getById(lessonId),
      score: r.score,
      passed: r.passed,
      completedAt: r.completedAt,
    }))
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt)),
);

function levelProgress(level: LessonLevel): { done: number; total: number; pct: number } {
  const list = lessonsByLevel(level);
  const done = list.filter((l) => isCompleted(l.id)).length;
  const total = list.length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

function resetProgress(): void {
  if (confirm('Reset all progress, bookmarks and quiz history? This cannot be undone.')) {
    reset();
  }
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="heading text-4xl">Your <span class="gradient-text">dashboard</span></h1>
        <p class="prose-muted mt-3 text-lg">Track your learning progress and quiz history.</p>
      </div>
      <button type="button" class="btn-danger" @click="resetProgress">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Reset progress
      </button>
    </header>

    <!-- Top stats -->
    <section class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div class="card p-5">
        <p class="text-3xl font-extrabold tabular-nums text-ink-900 dark:text-white">
          {{ completedCount }}<span class="text-ink-400">/{{ totalLessons }}</span>
        </p>
        <p class="prose-muted mt-0.5 text-sm font-medium">Lessons done</p>
      </div>
      <div class="card p-5">
        <p class="gradient-text text-3xl font-extrabold tabular-nums">{{ completionPct }}%</p>
        <p class="prose-muted mt-0.5 text-sm font-medium">Course complete</p>
      </div>
      <div class="card p-5">
        <p class="text-3xl font-extrabold tabular-nums text-ink-900 dark:text-white">
          {{ averageScore }}%
        </p>
        <p class="prose-muted mt-0.5 text-sm font-medium">Avg quiz score</p>
      </div>
      <div class="card p-5">
        <p class="text-3xl font-extrabold tabular-nums text-ink-900 dark:text-white">
          {{ bookmarks.length }}
        </p>
        <p class="prose-muted mt-0.5 text-sm font-medium">Bookmarks</p>
      </div>
    </section>

    <!-- Progress by level -->
    <section class="mt-12">
      <h2 class="heading mb-5 text-xl">Progress by level</h2>
      <div class="card divide-y divide-ink-100 dark:divide-ink-800">
        <template v-for="level in LEVELS" :key="level">
          <div v-if="levelProgress(level).total" class="p-5">
            <div class="mb-2 flex items-center justify-between gap-3 text-sm">
              <span class="flex items-center gap-2 font-bold text-ink-800 dark:text-ink-100">
                <span
                  class="h-2.5 w-2.5 rounded-full bg-gradient-to-r"
                  :class="LEVEL_ACCENTS[level]"
                ></span>
                {{ LEVEL_LABELS[level] }}
              </span>
              <span class="prose-muted font-semibold tabular-nums">
                {{ levelProgress(level).done }}/{{ levelProgress(level).total }}
              </span>
            </div>
            <div
              class="h-2.5 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800"
              role="progressbar"
              :aria-valuenow="levelProgress(level).pct"
              :aria-valuemin="0"
              :aria-valuemax="100"
              :aria-label="`${LEVEL_LABELS[level]} progress`"
            >
              <div
                class="h-full rounded-full bg-gradient-to-r transition-all duration-500"
                :class="LEVEL_ACCENTS[level]"
                :style="{ width: levelProgress(level).pct + '%' }"
              ></div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Quiz history -->
    <section class="mt-12">
      <h2 class="heading mb-5 text-xl">Quiz history</h2>
      <div v-if="quizHistory.length > 0" class="card overflow-hidden">
        <!-- Wide tables must scroll inside their own container, not the page. -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-ink-50 text-left dark:bg-ink-950/50">
              <tr class="prose-muted">
                <th scope="col" class="px-4 py-3 font-bold">Lesson</th>
                <th scope="col" class="px-4 py-3 font-bold">Score</th>
                <th scope="col" class="px-4 py-3 font-bold">Result</th>
                <th scope="col" class="px-4 py-3 font-bold">Taken</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-ink-100 dark:divide-ink-800">
              <tr
                v-for="(row, idx) in quizHistory"
                :key="idx"
                class="transition hover:bg-ink-50 dark:hover:bg-ink-800/50"
              >
                <td class="px-4 py-3">
                  <RouterLink
                    v-if="row.lesson"
                    :to="`/lesson/${row.lesson.slug}`"
                    class="focusable rounded font-bold text-brand-600 hover:text-cyan-600 dark:text-brand-300 dark:hover:text-cyan-400"
                  >
                    {{ row.lesson.title }}
                  </RouterLink>
                  <span v-else class="text-ink-400">Unknown lesson</span>
                </td>
                <td class="px-4 py-3 font-bold tabular-nums text-ink-800 dark:text-ink-100">
                  {{ row.score }}%
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="
                      row.passed
                        ? 'badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'badge bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    "
                  >
                    <svg
                      v-if="row.passed"
                      class="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="3.5"
                    >
                      <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg
                      v-else
                      class="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="3.5"
                    >
                      <path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
                    </svg>
                    {{ row.passed ? 'Passed' : 'Failed' }}
                  </span>
                </td>
                <td class="prose-muted px-4 py-3 whitespace-nowrap">
                  {{ formatDate(row.completedAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="card border-dashed p-10 text-center">
        <p class="font-semibold text-ink-700 dark:text-ink-200">No quizzes taken yet.</p>
        <p class="prose-muted mt-1 text-sm">
          Finish a lesson and take its quiz to see scores here.
        </p>
      </div>
    </section>

    <!-- Completed lessons -->
    <section v-if="completedLessons.length > 0" class="mt-12">
      <h2 class="heading mb-5 text-xl">Completed lessons</h2>
      <ul class="flex flex-wrap gap-2">
        <li v-for="lesson in completedLessons" :key="lesson.id">
          <RouterLink :to="`/lesson/${lesson.slug}`" class="chip">
            <svg
              class="h-3.5 w-3.5 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="3.5"
            >
              <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ lesson.title }}
          </RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>
