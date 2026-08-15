<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import type { TocEntry } from '../../core/models/lesson';

defineProps<{ entries: TocEntry[] }>();

// Keep the current path and only change the hash, so clicking a TOC entry scrolls
// in place (handled by the router's scrollBehavior) rather than navigating away.
const route = useRoute();
</script>

<template>
  <nav v-if="entries.length" class="text-sm" aria-label="On this page">
    <p
      class="mb-3 flex items-center gap-2 text-xs font-extrabold tracking-wider text-ink-400 uppercase"
    >
      <span class="gradient-rule h-0.5 w-3 shrink-0"></span>
      On this page
    </p>
    <ul class="space-y-0.5 border-l-2 border-ink-200 dark:border-ink-800">
      <li v-for="entry in entries" :key="entry.id">
        <RouterLink
          :to="{ path: route.path, hash: '#' + entry.id }"
          class="focusable -ml-0.5 block border-l-2 border-transparent py-1.5 font-medium text-ink-500 transition hover:border-brand-500 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-300"
          :class="entry.level === 1 ? 'pl-4' : entry.level === 2 ? 'pl-6' : 'pl-8'"
        >
          {{ entry.text }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
