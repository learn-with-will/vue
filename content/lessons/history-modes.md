---
slug: history-modes
title: "HTML5 History Mode vs Hash Mode"
topic: routing-state
kind: concept
summary: "Compare clean URLs with createWebHistory against server-agnostic URLs with createWebHashHistory."
tags: [history-modes, createwebhistory, createwebhashhistory, server-config]
related: [router-setup, vite-build-production, navigation-guards]
---
> **In one line:** createWebHistory() provides clean URLs (needs server rewrite); createWebHashHistory() uses # hashes.

## The idea

When configuring Vue Router with `createRouter()`, you must choose a **history mode**. Vue Router provides two primary modes:

1. **HTML5 History Mode (`createWebHistory`):**
   Produces clean, modern URLs: `https://example.com/courses/vue`. It leverages browser `history.pushState` APIs.
2. **Hash Mode (`createWebHashHistory`):**
   Appends a hash symbol before the internal path: `https://example.com/#/courses/vue`.

| Feature | HTML5 History Mode | Hash Mode |
|---|---|---|
| URL Appearance | Clean (`/user/profile`) | Contains hash (`/#/user/profile`) |
| Server config needed | Yes (must rewrite to `index.html`) | No (never hits the server) |
| SEO Friendliness | Excellent | Poor (crawlers may ignore hashes) |
| Best for | Production web apps, GitHub Pages (with 404 rewrite) | Electron apps, static files without server access |

HTML5 History is the standard choice for modern web apps. However, if a user directly enters `https://example.com/about` or hits browser reload, the browser asks the web server for `/about`. The server must be configured with a fallback rule to serve `index.html` for all paths so Vue can boot.

## See it

```typescript
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { routes } from './routes';

// Modern recommended choice: clean URLs
export const modernRouter = createRouter({
  history: createWebHistory(),
  routes
});

// Alternative choice: zero server config required
export const hashRouter = createRouter({
  history: createWebHashHistory(),
  routes
});
```

Switching between modes requires changing only a single line in your router configuration.

## Go deeper

If your application is hosted under a subfolder on a domain (like `https://domain.com/my-app/`), pass the base URL to `createWebHistory('/my-app/')`.

> **Tip:** Vite automatically provides the correct base URL via `import.meta.env.BASE_URL`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Deploying HTML5 History mode without server SPA rewrite rules produces 404 errors on browser page reloads.
- Hash URLs can interfere with on-page anchor link jumps.

## Remember

- createWebHistory() generates clean URLs using HTML5 History API.
- HTML5 History requires the server to redirect all requests to index.html.
- createWebHashHistory() works without server configuration using URL hashes.
