---
id: lesson-15
slug: vue-router
title: "Vue Router"
level: intermediate
order: 15
duration: 20
summary: "Add client-side routing with Vue Router: define routes, link and render with RouterLink and RouterView, read dynamic params, navigate programmatically, nest routes, and guard navigation."
tags:
  - vue-router
  - routing
  - spa
  - navigation-guards
---

# Learning Objectives

By the end of this lesson you will be able to:

- Set up Vue Router and register it on your app.
- Link with `<RouterLink>` and render matched components in `<RouterView>`.
- Read dynamic route parameters and navigate programmatically.
- Nest routes and add a navigation guard.
- Choose between history and hash modes.

# Why It Matters

A single-page application (SPA) has many "pages" but loads once; **routing** maps the URL to
the component that should show. **Vue Router** is the official router for Vue — it handles the
URL, browser history, dynamic parameters, nested layouts, and guards, so you can build a
multi-view app that still feels instant.

> This learning portal uses Vue Router for its own navigation — the sidebar links, lesson pages,
> and quiz routes are all Vue Router in action.

# Concept Explanation

### Setting up the router

You define an array of **routes** (path → component) and create a router with a **history**
implementation, then register it with `app.use`:

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: () => import('../views/About.vue') },
  ],
})
```

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

createApp(App).use(router).mount('#app')
```

Note the second route uses `() => import(...)` to **lazy-load** the component — it's only fetched
when the route is visited (code splitting).

### Linking and rendering

Use `<RouterLink>` to navigate (it renders an `<a>` and handles clicks without a full reload),
and `<RouterView>` to render the component matched by the current URL:

```html
<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <RouterView />
</template>
```

### Dynamic route parameters

A path segment starting with `:` is a **dynamic parameter**. Read it with `useRoute()`:

```typescript
// route: { path: '/users/:id', component: UserView }
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.params.id)
```

Because the same component is reused when only the param changes, `watch` the param to react to
navigation between, say, `/users/1` and `/users/2`.

### Programmatic navigation

Navigate from code with `useRouter()`:

```typescript
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/about')
router.push({ name: 'home' })   // by name
```

### Nested routes

Routes can have `children`, rendered in a nested `<RouterView>` inside the parent's template —
perfect for shared layouts:

```typescript
{
  path: '/settings',
  component: SettingsLayout,
  children: [
    { path: 'profile', component: Profile },   // /settings/profile
    { path: 'billing', component: Billing },    // /settings/billing
  ],
}
```

### Navigation guards

Guards run before a navigation completes — useful for auth. A global guard:

```typescript
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { name: 'login' } // redirect
  }
})
```

Return `false` to cancel, or a location to redirect. There are also per-route (`beforeEnter`)
and in-component guards.

### History vs hash mode

- `createWebHistory()` gives clean URLs (`/about`) but needs the server to serve `index.html`
  for unknown paths (a **SPA fallback**), or deep-link refreshes 404.
- `createWebHashHistory()` puts the route after a `#` (`/#/about`); it needs no server config
  because the part after `#` never reaches the server.

# Key Terminology

- **Route** — a mapping from a URL path to a component.
- **`<RouterLink>` / `<RouterView>`** — navigate to routes / render the matched component.
- **Dynamic parameter** — a `:param` segment read from `route.params`.
- **Navigation guard** — a hook that runs before a route change (e.g. for auth).
- **History mode** — how URLs are represented (`createWebHistory` vs `createWebHashHistory`).

# Options and Trade-offs

| Option | What it gives | Use when | Watch out for |
| ------ | ------------- | -------- | ------------- |
| `createWebHistory` | Clean URLs (`/about`) | Most SPAs | Needs a server/SPA 404 fallback |
| `createWebHashHistory` | Hash URLs (`/#/about`) | Static hosts without fallback config | Uglier URLs |
| Eager `component: X` | Loaded upfront | Small apps / always-needed routes | Larger initial bundle |
| Lazy `() => import(...)` | Code-split per route | Larger apps | A tiny load delay on first visit |

# Worked Example

A small app with a list and a detail route that reads a param and re-fetches on change:

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'list', component: () => import('../views/List.vue') },
    { path: '/item/:id', name: 'item', component: () => import('../views/Item.vue') },
  ],
})
```

```html
<!-- Item.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const item = ref<unknown>(null)

async function load(id: string) {
  item.value = await (await fetch(`/api/items/${id}`)).json()
}

// Re-run when the :id param changes (same component is reused)
watch(() => route.params.id, (id) => load(String(id)), { immediate: true })
</script>
```

`<RouterLink :to="{ name: 'item', params: { id } }">` navigates without a reload; the `watch`
on `route.params.id` re-fetches when moving between items.

# Real World Analogy

Vue Router is the **receptionist for a single building**. The building (your app) is loaded once;
when you ask for a "room" (URL), the receptionist directs you to the right room (`RouterView`
renders the matching component) without you leaving and re-entering the building. Guards are the
**security desk** — they can wave you through or send you to sign in first.

# Examples

## Example 1 — Basic: two routes

```typescript
routes: [
  { path: '/', component: Home },
  { path: '/about', component: About },
]
```

**Why this works:** Each path maps to a component; `<RouterView>` renders whichever matches the
current URL.

## Example 2 — Real-world: lazy route + auth guard

```typescript
{ path: '/admin', component: () => import('./Admin.vue'), meta: { requiresAuth: true } }
```

```typescript
router.beforeEach((to) => (to.meta.requiresAuth && !isLoggedIn() ? { name: 'login' } : true))
```

**Why this works:** The admin bundle loads only when needed, and the guard redirects
unauthenticated users before the route renders.

## Example 3 — Trade-off / pitfall: deep-link refresh with history mode

```text
Visit /users/42, hit refresh → server returns 404 (no such file)
```

**Why this bites:** With `createWebHistory`, the server must serve `index.html` for unknown paths
(a SPA fallback). Without it, refreshing a deep link 404s. Configure the fallback, or use
`createWebHashHistory`.

# Common Mistakes

- **Using `<a href>` for internal links**, causing full-page reloads — use `<RouterLink>`.
- **Not reacting to param changes** when the component is reused — `watch` the param.
- **Forgetting the SPA fallback** with history mode, so deep-link refreshes 404.
- **Loading everything eagerly** — lazy-load large or rarely used routes.

# Best Practices

- Register routes with meaningful `name`s and navigate by name where possible.
- **Lazy-load** route components with `() => import(...)` to shrink the initial bundle.
- Use navigation guards for auth and redirects; keep them small.
- Configure a server/host SPA fallback for `createWebHistory` (this app ships a `404.html` copy
  of `index.html` for GitHub Pages).

# Summary

- Vue Router maps URLs to components: define `routes`, create a router with a **history** mode,
  and `app.use(router)`.
- Link with **`<RouterLink>`**, render with **`<RouterView>`**.
- Read `:params` via `useRoute()`; navigate in code via `useRouter().push()`; `watch` params on
  reused components.
- **Nested routes** share layouts; **guards** run before navigation.
- `createWebHistory` needs a SPA fallback; `createWebHashHistory` doesn't.

# Flash Cards

Q: What do RouterLink and RouterView do?
A: RouterLink renders a link that navigates without a full page reload; RouterView renders the component matched by the current URL.

Q: How do you read a dynamic route parameter like :id?
A: With useRoute(): route.params.id. Since the component is reused when only the param changes, watch the param to react.

Q: How do you navigate from JavaScript instead of a link?
A: With useRouter(): router.push('/path') or router.push({ name: 'home' }).

Q: What's the difference between createWebHistory and createWebHashHistory?
A: createWebHistory gives clean URLs but needs a server SPA fallback for deep links; createWebHashHistory puts the route after a # and needs no server config.

Q: What is a navigation guard used for?
A: Running logic before a navigation completes — e.g. checking auth and redirecting or cancelling the navigation.

Q: How do you lazy-load a route component?
A: Use a dynamic import for the component: component: () => import('./View.vue'), which code-splits it into a chunk fetched on first visit.

# Exercises

### Easy
Set up two routes (`/` and `/about`) with `<RouterLink>`s and a `<RouterView>`. Confirm
navigation doesn't reload the page.

### Medium
Add a `/user/:id` route. In the view, read `route.params.id` and display it; add links to a few
ids and `watch` the param so the view updates when you move between them.

### Challenging
Create nested routes under `/dashboard` (`/dashboard/overview`, `/dashboard/settings`) sharing a
layout with a nested `<RouterView>`. Add a global `beforeEach` guard that redirects to `/login`
when a `requiresAuth` meta is set and the user isn't authenticated.

# Further Reading

- [Vue Router — Getting Started](https://router.vuejs.org/guide/)
- [Dynamic Route Matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html)
- [Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Different History Modes](https://router.vuejs.org/guide/essentials/history-mode.html)
