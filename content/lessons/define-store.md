---
slug: define-store
title: "Defining Stores: Option vs Setup Syntax"
topic: routing-state
kind: api
summary: "Define stores using Option Stores (state/getters/actions) or Setup Stores with Composition API syntax."
tags: [pinia, definestore, setup-stores, architecture]
related: [pinia-setup, store-state, store-getters]
---
> **In one line:** defineStore('id', ...) defines a Pinia store using Option syntax or modern Setup syntax.

## The idea

In Pinia, you define stores using the **`defineStore()`** function. Every store requires a **unique string ID** (its name in Vue DevTools).

Pinia supports two authoring syntaxes:
1. **Option Stores:** Uses an object with `state`, `getters`, and `actions` keys (resembling the Options API).
2. **Setup Stores:** Uses a function that resembles a component's `<script setup>` (using `ref()`, `computed()`, and plain functions).

| Element | Option Store | Setup Store |
|---|---|---|
| State | `state: () => ({ count: 0 })` | `const count = ref(0)` |
| Getters | `getters: { double: (s) => s.count * 2 }` | `const double = computed(() => count.value * 2)` |
| Actions | `actions: { increment() { this.count++; } }` | `function increment() { count.value++; }` |

Setup Stores offer complete flexibility, allowing you to use composables, watchers, and custom refs directly inside the store.

## See it

```typescript
// stores/counter.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Setup Store Syntax (Recommended for Composition API projects)
export const useCounterStore = defineStore('counter', () => {
  // State: ref()
  const count = ref(0);

  // Getter: computed()
  const doubleCount = computed(() => count.value * 2);

  // Action: function
  function increment() {
    count.value++;
  }

  // Return everything exposed to components
  return { count, doubleCount, increment };
});
```

The store is defined as an exported composable function (`useCounterStore`) that any component can import and invoke.

## Go deeper

By convention, the return value of `defineStore` is named with a `use` prefix (e.g. `useUserStore`), matching standard composable conventions.

> **Tip:** You can use other Pinia stores inside a store! Simply call `useOtherStore()` inside your setup store function.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- The store ID ('counter') must be globally unique across all stores in your application.
- In Setup Stores, you must explicitly return all state properties and methods you want to expose.

## Remember

- defineStore('id', ...) defines an isolated, modular Pinia store.
- Supports Option syntax (state/getters/actions) and Setup syntax (ref/computed/function).
- Export as a composable function named with the "use" prefix.
