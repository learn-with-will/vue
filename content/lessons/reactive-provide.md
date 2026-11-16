---
slug: reactive-provide
title: "Reactive Provide and Inject"
topic: slots-provide
kind: pattern
summary: "Keep provided data reactive by passing refs, and provide updater functions to respect one-way flow."
tags: [provide, inject, reactivity, state-mutations]
related: [provide-and-inject, injection-keys, one-way-data-flow]
---
> **In one line:** Provide reactive refs to keep descendants in sync, and pass updater functions for mutations.

## The idea

When you pass a reactive `ref` or `reactive` object to `provide()`, Vue maintains full reactivity across the entire injection boundary. When the provider updates the ref's value, all descendant components that `inject` it automatically update their templates.

However, sharing reactive state raises a critical architectural question: **who is allowed to mutate the state?**

If any deep child can directly execute `theme.value = 'light'`, tracking down which component triggered an unexpected state change becomes a debugging nightmare.

The recommended best practice is to **keep mutations inside the provider**:
1. Provide the reactive ref (read-only or standard).
2. Provide an updater function alongside it that descendants call when they need to request changes.

## See it

```html
<!-- ThemeProvider.vue (Ancestor) -->
<script setup lang="ts">
import { ref, provide, readonly } from 'vue';

const theme = ref<'light' | 'dark'>('light');

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}

// Provide readonly state + explicit updater method
provide('theme', readonly(theme));
provide('toggleTheme', toggleTheme);
</script>

<template>
  <slot></slot>
</template>
```

In the child component:

```html
<!-- ThemeButton.vue (Descendant) -->
<script setup lang="ts">
import { inject } from 'vue';

const theme = inject('theme');
const toggleTheme = inject<() => void>('toggleTheme');
</script>

<template>
  <button @click="toggleTheme">
    Current: {{ theme }} (Click to toggle)
  </button>
</template>
```

The child cannot accidentally mutate `theme` directly because it was wrapped in `readonly()`, but it can cleanly request changes via `toggleTheme()`.

## Go deeper

Wrapping provided state in `readonly()` guarantees that descendants cannot violate one-way data principles.

> **Tip:** Package state and updaters into a single object or composable for clean injection signatures.

## Watch out

- Avoid directly mutating injected refs inside consumer components unless deliberately building a two-way form control.
- Unwrapping a ref before providing it (provide('k', count.value)) destroys reactivity; pass the ref itself.

## Remember

- Provide refs directly (provide('key', myRef)) to maintain reactivity in descendants.
- Wrap state in readonly() to prevent unauthorized child mutations.
- Provide dedicated updater functions alongside the state to handle modifications.
