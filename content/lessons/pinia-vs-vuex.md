---
slug: pinia-vs-vuex
title: "Pinia vs Vuex"
topic: routing-state
kind: concept
summary: "Understand why Pinia replaced Vuex as the official state management store for Vue 3."
tags: [pinia, vuex, architecture, comparison]
related: [pinia-setup, define-store, store-state]
---
> **In one line:** Pinia replaced Vuex by eliminating mutations, adding TypeScript support, and removing nested modules.

## The idea

For many years, Vuex was the official state management library for Vue 2. However, Vuex had significant architectural pain points: verbose ceremony, mandatory mutations, lack of TypeScript inference, and complex nested modules.

Pinia was originally designed as an experiment to explore what a next-generation store built specifically for Vue 3's Composition API would look like. It was so successful that it officially became the default state management store for Vue.

| Feature | Pinia | Vuex (Legacy) |
|---|---|---|
| Mutations | None (direct mutation allowed) | Required for all state changes |
| TypeScript | Complete, automatic inference | Complex manual typing / brittle |
| Structure | Flat, independent stores | Monolithic tree with nested modules |
| API Style | Option Stores or Setup Stores | Options only (state, mutations, actions) |
| Bundle Size | Extremely light (~1.5 KB) | Heavier |

Vuex is now in maintenance mode. All modern Vue 3 applications should use Pinia.

## See it

```typescript
// The Vuex way (Legacy - DO NOT USE FOR NEW APPS)
// commit('increment', payload) --> mutation --> state

// The Pinia way (Modern, direct, type-safe)
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const name = ref('Ada');

  function updateName(newName: string) {
    name.value = newName;
  }

  return { name, updateName };
});
```

In Pinia, code reads like standard modern TypeScript without string mutation constants or boilerplate commit dispatches.

## Go deeper

Migrating from Vuex to Pinia is straightforward: convert each Vuex module into a standalone `defineStore`, merge mutations into actions, and replace `mapGetters` with `storeToRefs`.

> **Tip:** Pinia and Vuex can even run side-by-side during incremental migration phases.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Vuex is in maintenance mode; do not start new projects with Vuex.
- Pinia does not support nested module objects; use independent flat stores that import each other.

## Remember

- Pinia is the modern official successor to Vuex.
- Eliminated mutations: actions or direct assignments modify state.
- Provides first-class TypeScript inference and a modular architecture.
