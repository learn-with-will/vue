---
slug: store-to-refs
title: "Destructuring Stores with storeToRefs()"
topic: routing-state
kind: technique
summary: "Use storeToRefs to destructure state and getters from a Pinia store without losing reactivity."
tags: [pinia, storetorefs, destructuring, reactivity]
related: [store-state, store-getters, ref-vs-reactive]
---
> **In one line:** storeToRefs() extracts reactive refs for state and getters so destructuring preserves reactivity.

## The idea

When using a store in a component, typing `store.count`, `store.user`, and `store.theme` repeatedly in templates can feel verbose. It is tempting to destructure the store:

```typescript
// WRONG: Destructuring a store directly breaks reactivity!
const { count, user } = useCounterStore();
```

Because the store is a reactive Proxy object, destructuring properties directly pulls out raw static values. If `count` is 0, destructuring assigns the number 0 to a local variable. When the store's count increases to 1, your local variable **stays 0**!

To solve this, Pinia provides the **`storeToRefs()`** helper function.

`storeToRefs()` iterates through the store and converts every state property and getter into an individual `Ref`. You can destructure the returned object freely, and every property retains full two-way reactivity!

## See it

```html
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCounterStore } from '../stores/counter';

const counterStore = useCounterStore();

// 1. Destructure state and getters with storeToRefs (preserves reactivity!):
const { count, doubleCount } = storeToRefs(counterStore);

// 2. Destructure actions directly from the store (methods don't need storeToRefs!):
const { increment } = counterStore;
</script>

<template>
  <div class="counter">
    <!-- Clean, short variable names in template: -->
    <p>Count: {{ count }} | Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

`count` and `doubleCount` are fully reactive refs that stay in sync with the Pinia store.

## Go deeper

Notice that **actions are not included** in `storeToRefs()`. Because actions are plain functions and not reactive state, they can be destructured directly from the store instance.

> **Tip:** In templates, if you don't mind writing `store.property`, you don't even need `storeToRefs`. It is strictly for destructuring.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Destructuring actions from storeToRefs() will fail; destructure actions directly from the store.
- Directly destructuring state without storeToRefs silently breaks reactivity with no error.

## Remember

- Directly destructuring a Pinia store breaks reactivity.
- Use storeToRefs(store) to extract state and getters as reactive refs.
- Actions can be destructured directly from the store instance.
