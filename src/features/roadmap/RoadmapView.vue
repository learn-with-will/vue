<script setup lang="ts">
import { useCourse } from '../../core/stores/course';
import { useProgress } from '../../core/stores/progress';
import LessonCard from '../../shared/components/LessonCard.vue';
import { useDocumentTitle } from '../../core/composables/useDocumentTitle';
import {
  LEVELS,
  LEVEL_ACCENTS,
  LEVEL_BLURBS,
  LEVEL_LABELS,
  type LessonLevel,
} from '../../core/models/lesson';

useDocumentTitle('Roadmap · Vue.js Learning Portal');
const { lessonsByLevel } = useCourse();
const { isCompleted } = useProgress();

function doneCount(level: LessonLevel): number {
  return lessonsByLevel(level).filter((l) => isCompleted(l.id)).length;
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <header class="mb-12 max-w-2xl">
      <h1 class="heading text-4xl">Course <span class="gradient-text">roadmap</span></h1>
      <p class="prose-muted mt-3 text-lg text-pretty">
        Work through the levels in order, or jump straight to a topic you need.
      </p>
    </header>

    <div v-for="(level, idx) in LEVELS" :key="level">
      <section :id="level" class="mb-14 scroll-mt-24">
        <div class="mb-5">
          <span
            class="mb-3 block h-1.5 w-16 rounded-full bg-gradient-to-r"
            :class="LEVEL_ACCENTS[level]"
          ></span>

          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 class="heading text-2xl">{{ LEVEL_LABELS[level] }}</h2>
            <span
              class="rounded-full bg-ink-100 px-2.5 py-0.5 text-sm font-bold tabular-nums text-ink-600 dark:bg-ink-800 dark:text-ink-300"
            >
              {{ lessonsByLevel(level).length }}
              {{ lessonsByLevel(level).length === 1 ? 'lesson' : 'lessons' }}
            </span>
            <span
              v-if="lessonsByLevel(level).length > 0 && doneCount(level) === lessonsByLevel(level).length"
              class="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            >
              <svg
                class="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="3.5"
              >
                <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              All done
            </span>
            <span
              v-else-if="doneCount(level) > 0"
              class="prose-muted text-sm font-semibold tabular-nums"
            >
              {{ doneCount(level) }}/{{ lessonsByLevel(level).length }} done
            </span>
          </div>

          <p class="prose-muted mt-2 max-w-xl">{{ LEVEL_BLURBS[level] }}</p>
        </div>

        <div
          v-if="lessonsByLevel(level).length > 0"
          class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <LessonCard v-for="lesson in lessonsByLevel(level)" :key="lesson.id" :lesson="lesson" />
        </div>
        <div v-else class="card border-dashed p-10 text-center">
          <p class="prose-muted text-sm">No lessons in this level yet.</p>
        </div>
      </section>

      <hr v-if="idx !== LEVELS.length - 1" class="mb-14 border-ink-200 dark:border-ink-800" />
    </div>
  </div>
</template>
