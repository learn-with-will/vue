---
slug: what-is-a-composable
title: "What is a Composable?"
topic: composables
kind: concept
summary: "A composable is a function that leverages the Composition API to encapsulate and reuse stateful logic."
tags: [composables, composition-api, reusability, architecture]
related: [mouse-tracker-composable, fetch-composable, composable-conventions]
---
> **In one line:** A composable is a function that uses Vue Composition APIs to encapsulate and share stateful logic.

## The idea

When building applications, we frequently need to reuse logic across different components. In traditional JavaScript, we write utility functions. But utility functions can only share *stateless* operations (like formatting a date or calculating math).

What if the logic we want to reuse **manages its own reactive state, watchers, and lifecycle hooks**?

In Vue 3, this is solved by **composables**. A composable is a function that leverages the Composition API (`ref`, `computed`, `onMounted`, `watch`) to encapsulate and reuse **stateful logic**.

```tree
Evolution of Code Reuse
  Plain Utility Functions
    [Stateless] Pure functions, no reactivity (e.g. math, string formatting) @neutral
  Legacy Vue 2 Mixins
    [Flawed] Implicit dependencies, namespace collisions, obscure origin @red
  Vue 3 Composables
    [Stateful & Pure] Explicit imports, reactive state, full type safety @green
```

By convention, composable function names always start with the word **"use"** (e.g. `useMouse`, `useFetch`, `useDarkTheme`).

## See it

```typescript
// useCounter.ts (Composable)
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  // Return a plain object of refs and methods
  return {
    count,
    doubleCount,
    increment,
    decrement
  };
}
```

Using it in any component:

```html
<script setup lang="ts">
import { useCounter } from './useCounter';

const { count, doubleCount, increment } = useCounter(10);
</script>

<template>
  <button @click="increment">Count: {{ count }} (Double: {{ doubleCount }})</button>
</template>
```

The component imports `useCounter` and destructures its reactive state effortlessly.

## Go deeper

Each time you call a composable function, it instantiates **completely fresh, independent state** for that calling component instance.

> **Tip:** If you actually want state to be shared globally between all callers, declare the `ref` outside of the exported function body.

## Watch out

- Composables must be called synchronously inside setup() or <script setup>.
- Never call composables inside condition branches or asynchronous callbacks.

## Remember

- Composables encapsulate and reuse stateful logic using Vue Composition APIs.
- Naming convention: always prefix composable names with "use" (e.g. useMouse).
- Each invocation creates independent reactive state for the caller.
