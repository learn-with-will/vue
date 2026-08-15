<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCourse } from '../../core/stores/course';
import LessonCard from '../../shared/components/LessonCard.vue';
import { searchLessons } from '../../core/services/search';
import { useDocumentTitle } from '../../core/composables/useDocumentTitle';

useDocumentTitle('Search · Vue.js Learning Portal');
const { lessons } = useCourse();

const query = ref('');
const input = ref<HTMLInputElement | null>(null);

const results = computed(() => searchLessons(lessons.value, query.value));
const trimmed = computed(() => query.value.trim());

onMounted(() => input.value?.focus());
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <header class="mb-6 max-w-2xl">
      <h1 class="heading text-4xl">Search <span class="gradient-text">lessons</span></h1>
      <p class="prose-muted mt-3 text-lg">Find lessons by title, topic, or tag.</p>
    </header>

    <div class="relative">
      <svg
        class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-ink-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" stroke-linecap="round" />
      </svg>
      <input
        ref="input"
        v-model="query"
        type="search"
        aria-label="Search lessons"
        placeholder="Search for reactivity, components, routing…"
        class="input-field py-4 pr-4 pl-12"
      />
    </div>

    <div class="mt-8">
      <div v-if="trimmed.length === 0" class="card border-dashed p-12 text-center">
        <span
          class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-950 dark:text-brand-300"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" stroke-linecap="round" />
          </svg>
        </span>
        <p class="font-semibold text-ink-700 dark:text-ink-200">
          Start typing to search the course.
        </p>
        <p class="prose-muted mt-1 text-sm">Try "reactivity", "router", or "components".</p>
      </div>
      <div v-else-if="results.length === 0" class="card border-dashed p-12 text-center">
        <p class="font-semibold text-ink-700 dark:text-ink-200">No lessons match "{{ query }}".</p>
        <p class="prose-muted mt-1 text-sm">Check the spelling, or try a broader word.</p>
      </div>
      <template v-else>
        <p class="prose-muted mb-4 text-sm font-semibold" aria-live="polite">
          {{ results.length }} result{{ results.length === 1 ? '' : 's' }}
        </p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LessonCard v-for="result in results" :key="result.lesson.id" :lesson="result.lesson" />
        </div>
      </template>
    </div>
  </div>
</template>
