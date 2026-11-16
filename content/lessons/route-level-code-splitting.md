---
slug: route-level-code-splitting
title: "Route-Level Code Splitting"
topic: tooling-typescript
kind: technique
summary: "Split application code by route using dynamic imports in Vue Router configuration."
tags: [code-splitting, vue-router, performance, vite]
related: [define-async-component, router-setup, vite-build-production]
---
> **In one line:** Use () => import('./View.vue') in route definitions to code-split entire pages automatically.

## The idea

The single most effective performance optimization for any Single-Page Application is **route-level code splitting**.

If your app has 20 pages, a visitor landing on the homepage should not download the code for the Settings, Checkout, or Admin pages.

In Vue Router, code splitting is effortless: instead of importing view components statically at the top of the file, pass an **arrow function returning a dynamic `import()`**:

```typescript
// Static import: All code bundled into one giant file (AVOID)
// import AdminView from './views/AdminView.vue';

// Dynamic import: Split into a separate lazy-loaded chunk (RECOMMENDED)
const AdminView = () => import('./views/AdminView.vue');
```

Vite recognizes dynamic imports and automatically bundles each view and its dependencies into a separate, isolated JavaScript file.

## See it

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // Lightweight homepage can be loaded statically or dynamically
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/analytics',
      name: 'analytics',
      // Heavy analytics charts are bundled separately:
      component: () => import('../views/AnalyticsView.vue')
    }
  ]
});
```

When the user visits `/analytics`, the browser requests `AnalyticsView-[hash].js` on demand.

## Go deeper

Modern browsers preload linked chunks during idle time, so page navigation feels instant even with code splitting enabled.

> **Tip:** Group related routes into the same chunk using webpack/vite chunk names if needed.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Avoid dynamic imports for views that are almost always needed on initial render.
- Ensure 404 fallback handling works when deploying code-split assets to CDNs.

## Remember

- Dynamic imports () => import('...') enable route-level code splitting.
- Vite automatically generates separate JavaScript chunks per route.
- Users download only the code required for the current active page.
