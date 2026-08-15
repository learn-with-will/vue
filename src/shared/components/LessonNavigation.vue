<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { LessonMeta } from '../../core/models/lesson';

defineProps<{ prev?: LessonMeta; next?: LessonMeta }>();
</script>

<template>
  <nav
    class="mt-14 grid gap-4 border-t border-ink-200 pt-8 sm:grid-cols-2 dark:border-ink-800"
    aria-label="Lesson navigation"
  >
    <RouterLink
      v-if="prev"
      :to="`/lesson/${prev.slug}`"
      class="card-interactive group flex items-center gap-3 p-4"
    >
      <span
        class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-500 transition group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-ink-800 dark:text-ink-400 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-300"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path d="M19 12H5m6 6-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span class="min-w-0">
        <span class="block text-xs font-bold tracking-wide text-ink-400 uppercase">Previous</span>
        <span
          class="block truncate font-bold text-ink-800 group-hover:text-brand-600 dark:text-ink-100 dark:group-hover:text-brand-300"
        >
          {{ prev.title }}
        </span>
      </span>
    </RouterLink>
    <span v-else class="hidden sm:block"></span>

    <RouterLink
      v-if="next"
      :to="`/lesson/${next.slug}`"
      class="card-interactive group flex items-center justify-end gap-3 p-4 text-right"
    >
      <span class="min-w-0">
        <span class="block text-xs font-bold tracking-wide text-ink-400 uppercase">Next</span>
        <span
          class="block truncate font-bold text-ink-800 group-hover:text-brand-600 dark:text-ink-100 dark:group-hover:text-brand-300"
        >
          {{ next.title }}
        </span>
      </span>
      <span
        class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-500 transition group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-ink-800 dark:text-ink-400 dark:group-hover:bg-brand-950 dark:group-hover:text-brand-300"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </RouterLink>
  </nav>
</template>
