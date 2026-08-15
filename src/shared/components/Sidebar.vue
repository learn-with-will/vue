<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useCourse } from '../../core/stores/course';
import { useProgress } from '../../core/stores/progress';
import { LEVELS, LEVEL_LABELS } from '../../core/models/lesson';

/** Course outline shown beside the lesson reader. Highlights the active slug. */
const course = useCourse();
const progress = useProgress();
</script>

<template>
  <nav class="text-sm" aria-label="Course outline">
    <template v-for="level in LEVELS" :key="level">
      <div v-if="course.lessonsByLevel(level).length" class="mb-6">
        <p
          class="mb-2 flex items-center gap-2 text-xs font-extrabold tracking-wider text-ink-400 uppercase"
        >
          <span class="gradient-rule h-0.5 w-3 shrink-0"></span>
          {{ LEVEL_LABELS[level] }}
        </p>
        <ul class="space-y-0.5">
          <li v-for="lesson in course.lessonsByLevel(level)" :key="lesson.id">
            <RouterLink :to="`/lesson/${lesson.slug}`" custom v-slot="{ href, navigate, isActive }">
              <a
                :href="href"
                class="focusable flex items-center gap-2.5 rounded-xl px-3 py-2 font-medium transition"
                :class="
                  isActive
                    ? 'bg-brand-50 font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white'
                "
                @click="navigate"
              >
                <template v-if="progress.isCompleted(lesson.id)">
                  <svg
                    class="h-3.5 w-3.5 shrink-0 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3.5"
                    aria-hidden="true"
                  >
                    <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span class="sr-only">Completed:</span>
                </template>
                <span
                  v-else
                  class="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300 dark:bg-ink-600"
                ></span>
                <span class="truncate">{{ lesson.title }}</span>
              </a>
            </RouterLink>
          </li>
        </ul>
      </div>
    </template>
  </nav>
</template>
