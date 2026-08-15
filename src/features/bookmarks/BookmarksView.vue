<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useCourse } from '../../core/stores/course';
import { useProgress } from '../../core/stores/progress';
import LessonCard from '../../shared/components/LessonCard.vue';
import { useDocumentTitle } from '../../core/composables/useDocumentTitle';

useDocumentTitle('Bookmarks · Vue.js Learning Portal');
const { lessons } = useCourse();
const { isBookmarked } = useProgress();

const bookmarked = computed(() => lessons.value.filter((l) => isBookmarked(l.id)));
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <header class="mb-8 max-w-2xl">
      <h1 class="heading text-4xl"><span class="gradient-text">Bookmarks</span></h1>
      <p class="prose-muted mt-3 text-lg">Lessons you've saved for later.</p>
    </header>

    <div v-if="bookmarked.length > 0" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <LessonCard v-for="lesson in bookmarked" :key="lesson.id" :lesson="lesson" />
    </div>
    <div v-else class="card border-dashed p-12 text-center">
      <span
        class="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-500 dark:bg-cyan-950 dark:text-cyan-300"
      >
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path d="M6 4h12v16l-6-4-6 4V4Z" stroke-linejoin="round" />
        </svg>
      </span>
      <p class="font-semibold text-ink-700 dark:text-ink-200">No bookmarks yet.</p>
      <p class="prose-muted mx-auto mt-1 max-w-sm text-sm">
        Tap the bookmark icon on any lesson card to pin it here.
      </p>
      <RouterLink to="/roadmap" class="btn-primary mt-5">
        Browse lessons
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
