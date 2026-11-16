---
slug: store-state
title: "Accessing and Mutating Store State"
topic: routing-state
kind: technique
summary: "Read and mutate Pinia store state directly without ceremony or mutations."
tags: [pinia, state, mutation, reactivity]
related: [define-store, store-getters, store-to-refs]
---
> **In one line:** Read and mutate Pinia store state directly on the store instance without mutations.

## The idea

One of the most frustrating aspects of legacy state managers (like Vuex or Redux) was the mandatory "mutation" boilerplate: you were forbidden from mutating state directly, forced instead to dispatch actions that committed mutations that updated state.

Pinia completely abolishes mutations. **You can read and mutate store state directly.**

Under the hood, a Pinia store is a reactive object wrapped with `reactive()`. Reading `store.count` tracks dependencies, and writing `store.count++` triggers immediate updates across all components reading that store.

```typescript
const store = useCounterStore();

// Direct read:
console.log(store.count);

// Direct write:
store.count++;
```

You can also use **`store.$patch({ ... })`** to apply multiple state mutations simultaneously in a single operation.

## See it

```html
<script setup lang="ts">
import { useCounterStore } from '../stores/counter';

const counter = useCounterStore();

function resetAll() {
  // $patch modifies multiple properties in one tick:
  counter.$patch({
    count: 0
  });
}
</script>

<template>
  <div class="counter-card">
    <p>Store Count: {{ counter.count }}</p>

    <!-- Mutate directly on the store: -->
    <button @click="counter.count++">Direct Increment</button>
    <button @click="resetAll">Reset</button>
  </div>
</template>
```

The template reads `counter.count` and mutates it directly with zero friction.

## Go deeper

In Option stores, you can reset all state back to its initial values in one call using `store.$reset()`.

> **Tip:** You can subscribe to state mutations using `store.$subscribe((mutation, state) => { ... })` to sync with `localStorage`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Never destructure state directly from a store without storeToRefs (e.g. const { count } = store destroys reactivity).
- For complex multi-step business logic, prefer encapsulating mutations inside actions.

## Remember

- Pinia has no mutations; state can be read and mutated directly on the store.
- store.$patch() applies multiple state mutations in a single batch.
- Store state is fully reactive across all components and templates.
