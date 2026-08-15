<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ answered: number; total: number }>();

const pct = computed(() =>
  props.total === 0 ? 0 : Math.round((props.answered / props.total) * 100),
);
</script>

<template>
  <div class="flex items-center gap-3">
    <div
      class="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800"
      role="progressbar"
      :aria-valuenow="pct"
      :aria-valuemin="0"
      :aria-valuemax="100"
      aria-label="Questions answered"
    >
      <div
        class="h-full rounded-full transition-all duration-300"
        :style="{ backgroundImage: 'var(--gradient-brand)', width: pct + '%' }"
      ></div>
    </div>
    <span class="prose-muted shrink-0 text-sm font-bold tabular-nums">
      {{ answered }}/{{ total }} answered
    </span>
  </div>
</template>
