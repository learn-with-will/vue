<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCourse } from '../../core/stores/course';
import { useProgress } from '../../core/stores/progress';
import LessonCard from '../../shared/components/LessonCard.vue';
import { useDocumentTitle } from '../../core/composables/useDocumentTitle';
import { LEVELS, LEVEL_ACCENTS, LEVEL_BLURBS, LEVEL_LABELS } from '../../core/models/lesson';

useDocumentTitle('Vue.js Learning Portal');
const { lessons, lessonsByLevel, getById, loaded } = useCourse();
const { completedCount, averageScore, isCompleted, state } = useProgress();

const ICON_BOOK =
  'M4 5.5A2.5 2.5 0 0 1 6.5 3H19v14H6.5A2.5 2.5 0 0 0 4 19.5V5.5ZM4 19.5A2.5 2.5 0 0 1 6.5 17H19v4H6.5A2.5 2.5 0 0 1 4 19.5Z';
const ICON_CHECK = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3.5-9.2 2.4 2.4 4.6-4.6';
const ICON_CHART = 'M4 20V10M10 20V4M16 20v-7M22 20H2';
const ICON_TROPHY =
  'M8 4h8v5a4 4 0 1 1-8 0V4ZM8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3M10 17h4M9 21h6M12 13v4';

const totalLessons = computed(() => lessons.value.length);
const completionPct = computed(() =>
  totalLessons.value === 0 ? 0 : Math.round((completedCount.value / totalLessons.value) * 100),
);
const continueLesson = computed(() => {
  const last = state.lastOpenedLesson;
  if (last) {
    const meta = getById(last);
    if (meta) return meta;
  }
  return lessons.value.find((l) => !isCompleted(l.id));
});
const featured = computed(() => lessons.value.slice(0, 3));
const stats = computed(() => [
  { label: 'Lessons', value: `${totalLessons.value}`, icon: ICON_BOOK },
  { label: 'Completed', value: `${completedCount.value}`, icon: ICON_CHECK },
  { label: 'Progress', value: `${completionPct.value}%`, icon: ICON_CHART },
  { label: 'Avg quiz score', value: `${averageScore.value}%`, icon: ICON_TROPHY },
]);
</script>

<template>
  <!-- Hero -->
  <section class="relative isolate overflow-hidden border-b border-ink-200 dark:border-ink-800">
    <div
      aria-hidden="true"
      class="surface-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]"
    ></div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-40 -left-32 -z-10 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-600/20"
    ></div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-32 right-0 -z-10 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-600/20"
    ></div>

    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div class="max-w-2xl animate-fade-up">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-sm font-bold text-brand-700 backdrop-blur dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300"
        >
          <span class="gradient-rule h-2 w-2 rounded-full"></span>
          Frontend-only · File-driven
        </span>

        <h1 class="heading mt-5 text-4xl text-balance sm:text-6xl">
          Master <span class="gradient-text">Vue.js</span>, one focused lesson at a time.
        </h1>

        <p class="prose-muted mt-5 max-w-xl text-lg text-pretty">
          Read bite-sized lessons, test yourself with quizzes, and track your progress — all in the
          browser. No sign-up, no backend.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          <RouterLink to="/roadmap" class="btn-gradient px-6 py-3 text-base">
            Explore the roadmap
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </RouterLink>

          <RouterLink
            v-if="continueLesson"
            :to="`/lesson/${continueLesson.slug}`"
            class="btn-secondary max-w-full px-6 py-3 text-base"
          >
            <svg
              class="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M8 5.5v13l11-6.5-11-6.5Z" stroke-linejoin="round" />
            </svg>
            <span class="truncate">
              {{ state.lastOpenedLesson ? 'Continue' : 'Start' }}: {{ continueLesson.title }}
            </span>
          </RouterLink>
        </div>

        <div v-if="completionPct > 0" class="mt-8 max-w-sm">
          <div class="mb-1.5 flex items-center justify-between text-sm">
            <span class="font-semibold text-ink-700 dark:text-ink-200">Your progress</span>
            <span class="font-bold text-brand-600 dark:text-brand-300">{{ completionPct }}%</span>
          </div>
          <div
            class="h-2.5 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800"
            role="progressbar"
            :aria-valuenow="completionPct"
            :aria-valuemin="0"
            :aria-valuemax="100"
            aria-label="Course completion"
          >
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ backgroundImage: 'var(--gradient-brand)', width: completionPct + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <!-- Statistics -->
    <section class="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="card p-5">
        <span
          class="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path :d="stat.icon" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <p class="text-3xl font-extrabold tabular-nums text-ink-900 dark:text-white">
          {{ stat.value }}
        </p>
        <p class="prose-muted mt-0.5 text-sm font-medium">{{ stat.label }}</p>
      </div>
    </section>

    <!-- Roadmap overview -->
    <section class="mt-14">
      <h2 class="heading text-2xl">Roadmap overview</h2>
      <p class="prose-muted mt-1">Three levels, built to be taken in order.</p>

      <div class="mt-5 grid gap-4 sm:grid-cols-3">
        <RouterLink
          v-for="level in LEVELS"
          :key="level"
          :to="`/roadmap#${level}`"
          class="card-interactive group overflow-hidden p-6"
        >
          <span
            class="mb-4 block h-1.5 w-12 rounded-full bg-gradient-to-r"
            :class="LEVEL_ACCENTS[level]"
          ></span>
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-lg font-bold text-ink-900 dark:text-white">{{ LEVEL_LABELS[level] }}</h3>
            <span
              class="shrink-0 rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold tabular-nums text-ink-600 dark:bg-ink-800 dark:text-ink-300"
            >
              {{ lessonsByLevel(level).length }}
            </span>
          </div>
          <p class="prose-muted mt-2 text-sm">{{ LEVEL_BLURBS[level] }}</p>
          <span
            class="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600 transition-transform duration-200 group-hover:translate-x-1 dark:text-brand-300"
          >
            Browse lessons
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </RouterLink>
      </div>
    </section>

    <!-- Featured lessons -->
    <section v-if="featured.length > 0" class="mt-14">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="heading text-2xl">Start here</h2>
          <p class="prose-muted mt-1">The first few lessons, in order.</p>
        </div>
        <RouterLink
          to="/roadmap"
          class="focusable inline-flex items-center gap-1 rounded-full text-sm font-bold text-brand-600 hover:text-cyan-600 dark:text-brand-300 dark:hover:text-cyan-400"
        >
          View all
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>
      </div>
      <div class="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LessonCard v-for="lesson in featured" :key="lesson.id" :lesson="lesson" />
      </div>
    </section>
    <section v-else-if="loaded" class="card mt-14 border-dashed p-12 text-center">
      <p class="prose-muted">
        No lessons found. Add entries to
        <code class="font-mono text-brand-600">content/course-manifest.json</code>.
      </p>
    </section>
  </div>
</template>
