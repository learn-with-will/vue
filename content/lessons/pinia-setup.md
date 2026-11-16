---
slug: pinia-setup
title: "State Management with Pinia"
topic: routing-state
kind: tool
summary: "Install and configure Pinia, the official intuitive state management store for Vue 3."
tags: [pinia, state-management, setup, store]
related: [define-store, store-state, pinia-vs-vuex]
---
> **In one line:** Pinia is the official, type-safe state management store for modern Vue 3 applications.

## The idea

As applications scale, state often needs to be shared across completely unrelated components across different pages and layouts. Passing props and events through dozens of components is unmaintainable, and Provide / Inject is limited to parent-child subtrees.

**Pinia** is the official, officially recommended state management library for Vue.

Pinia provides a centralized, global store with remarkable features:
- **Zero boilerplate:** No mutations, no magic strings, no complex namespaces.
- **Full TypeScript inference:** Every state property, getter, and action is typed automatically.
- **DevTools integration:** Time-travel debugging, state inspection, and timeline tracking.
- **Modular by design:** Define independent stores per domain (e.g. `useUserStore`, `useCartStore`).

```flow
create: createPinia() @primary
use: app.use(pinia) @blue
stores: Define useAuthStore, useCartStore @green
create -> use: register plugin
use -> stores: available across all components
```

## See it

```typescript
// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// 1. Create the Pinia root store instance
const pinia = createPinia();

const app = createApp(App);

// 2. Install Pinia as a plugin into the Vue application
app.use(pinia);

app.mount('#app');
```

Pinia is installed as an application plugin before mounting, making all stores instantly accessible to any component.

## Go deeper

Pinia stores can also be used outside of components! You can import and use a store inside Vue Router navigation guards or standalone API services.

> **Tip:** You do not need a single monolithic store; create a separate store file for each logical domain in your application.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- app.use(pinia) must be called before mounting the application or importing stores at the top level of entry files.
- Do not store non-serializable objects (like DOM elements or WebSocket instances) inside store state.

## Remember

- Pinia is the official state management store for modern Vue 3.
- createPinia() initializes the root store instance registered via app.use().
- Provides full TypeScript autocompletion and official Vue DevTools support.
