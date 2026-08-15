<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useCourse } from '../../core/stores/course';
import { useProgress } from '../../core/stores/progress';
import { loadLesson } from '../../core/services/lessonService';
import { type Lesson, LEVEL_BADGES, LEVEL_LABELS } from '../../core/models/lesson';
import Sidebar from '../../shared/components/Sidebar.vue';
import TableOfContents from '../../shared/components/TableOfContents.vue';
import LessonNavigation from '../../shared/components/LessonNavigation.vue';
import LessonContent from '../../shared/components/LessonContent.vue';
import { useDocumentTitle } from '../../core/composables/useDocumentTitle';

const route = useRoute();
const { getBySlug, neighbours, loaded } = useCourse();
const { isCompleted, isBookmarked, setLastOpened, toggleCompleted, toggleBookmark } = useProgress();

const slug = computed(() => String(route.params.slug ?? ''));
const lesson = ref<Lesson | null>(null);
const loading = ref(true);
const notFound = ref(false);

useDocumentTitle(() =>
  lesson.value
    ? `${lesson.value.meta.title} · Vue.js Learning Portal`
    : 'Lesson · Vue.js Learning Portal',
);

async function loadForSlug(): Promise<void> {
  loading.value = true;
  notFound.value = false;

  // Wait for the manifest; the watcher re-runs when `loaded` flips true.
  if (!loaded.value) return;

  const meta = getBySlug(slug.value);
  if (!meta) {
    lesson.value = null;
    notFound.value = true;
    loading.value = false;
    return;
  }

  setLastOpened(meta.id);
  try {
    const loaded_ = await loadLesson(meta);
    if (slug.value !== meta.slug) return; // a newer navigation won
    lesson.value = loaded_;
    loading.value = false;
  } catch {
    if (slug.value !== meta.slug) return;
    notFound.value = true;
    loading.value = false;
  }
}

watch([slug, loaded], loadForSlug, { immediate: true });

const nb = computed(() => neighbours(slug.value));
const completed = computed(() => (lesson.value ? isCompleted(lesson.value.meta.id) : false));
const bookmarked = computed(() => (lesson.value ? isBookmarked(lesson.value.meta.id) : false));
</script>

<template>
  <div
    class="mx-auto max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)_14rem]"
  >
    <!-- Course outline -->
    <aside class="hidden lg:block">
      <div class="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2">
        <Sidebar />
      </div>
    </aside>

    <!-- Main content -->
    <article class="min-w-0">
      <div
        v-if="loading"
        class="animate-pulse space-y-4"
        aria-busy="true"
        aria-label="Loading lesson"
      >
        <div class="h-5 w-24 rounded-full bg-ink-200 dark:bg-ink-800"></div>
        <div class="h-10 w-2/3 rounded-xl bg-ink-200 dark:bg-ink-800"></div>
        <div class="h-4 w-full rounded bg-ink-200 dark:bg-ink-800"></div>
        <div class="h-4 w-5/6 rounded bg-ink-200 dark:bg-ink-800"></div>
        <div class="h-40 w-full rounded-2xl bg-ink-200 dark:bg-ink-800"></div>
      </div>

      <div v-else-if="notFound" class="card border-dashed p-12 text-center">
        <h1 class="heading text-2xl">Lesson not found</h1>
        <p class="prose-muted mt-2">The lesson "{{ slug }}" doesn't exist.</p>
        <RouterLink to="/roadmap" class="btn-primary mt-5">
          Back to roadmap
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14m-6-6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>
      </div>

      <template v-else-if="lesson">
        <!-- Header -->
        <header class="mb-8 animate-fade-up border-b border-ink-200 pb-6 dark:border-ink-800">
          <div class="flex flex-wrap items-center gap-3">
            <span :class="LEVEL_BADGES[lesson.meta.level]">{{ LEVEL_LABELS[lesson.meta.level] }}</span>
            <span class="prose-muted flex items-center gap-1 text-sm font-medium">
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" stroke-linecap="round" />
              </svg>
              {{ lesson.meta.duration }} min read
            </span>
            <span
              v-if="completed"
              class="flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Completed
            </span>
          </div>

          <h1 class="heading mt-3 text-4xl text-balance">{{ lesson.meta.title }}</h1>

          <p v-if="lesson.meta.summary" class="prose-muted mt-3 text-lg text-pretty">
            {{ lesson.meta.summary }}
          </p>

          <div class="mt-6 flex flex-wrap gap-2.5">
            <button
              type="button"
              :aria-pressed="completed"
              :class="completed ? 'btn bg-emerald-600 text-white hover:bg-emerald-700' : 'btn-secondary'"
              @click="toggleCompleted(lesson.meta.id)"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ completed ? 'Completed' : 'Mark complete' }}
            </button>

            <button
              type="button"
              :aria-pressed="bookmarked"
              class="btn-secondary"
              :class="bookmarked ? 'text-cyan-600!' : ''"
              @click="toggleBookmark(lesson.meta.id)"
            >
              <svg
                class="h-4 w-4"
                :fill="bookmarked ? 'currentColor' : 'none'"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M6 4h12v16l-6-4-6 4V4Z" stroke-linejoin="round" />
              </svg>
              {{ bookmarked ? 'Bookmarked' : 'Bookmark' }}
            </button>

            <RouterLink :to="`/lesson/${lesson.meta.slug}/quiz`" class="btn-gradient">
              Take the quiz
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
          </div>
        </header>

        <!-- Mobile TOC -->
        <details v-if="lesson.toc.length > 0" class="card group mb-6 p-4 lg:hidden">
          <summary
            class="focusable flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg font-bold text-ink-700 dark:text-ink-200"
          >
            On this page
            <svg
              class="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </summary>
          <div class="mt-3">
            <TableOfContents :entries="lesson.toc" />
          </div>
        </details>

        <LessonContent :content="lesson.content" />

        <LessonNavigation :prev="nb.prev" :next="nb.next" />
      </template>
    </article>

    <!-- Table of contents -->
    <aside class="hidden lg:block">
      <div v-if="lesson" class="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto">
        <TableOfContents :entries="lesson.toc" />
      </div>
    </aside>
  </div>
</template>
