<script setup lang="ts">
import VueLogo from './VueLogo.vue';
</script>

<template>
  <footer class="mt-16 border-t border-ink-200 dark:border-ink-800">
    <div class="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6">
      <VueLogo class="h-8 w-8" />
      <p class="font-bold text-ink-800 dark:text-ink-100">
        Vue.js <span class="gradient-text">Learn</span>
      </p>
      <p class="prose-muted max-w-md text-sm">
        A frontend-only, file-driven course. Drop in a Markdown file and a manifest entry to add a
        lesson — no backend required.
      </p>
      <div class="gradient-rule mt-2 max-w-24 opacity-60"></div>
    </div>
  </footer>
</template>
