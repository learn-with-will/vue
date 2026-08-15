---
id: lesson-21
slug: async-components-and-performance
title: "Async Components & Performance"
level: advanced
order: 21
duration: 18
summary: "Lazy-load components with defineAsyncComponent, cache toggled components with KeepAlive, and speed up rendering with stable keys, v-once, and v-memo."
tags:
  - async-components
  - keepalive
  - performance
  - v-memo
---

# Learning Objectives

By the end of this lesson you will be able to:

- Lazy-load a component with `defineAsyncComponent`.
- Cache toggled components with `<KeepAlive>`.
- Use `v-once` and `v-memo` to skip unnecessary re-renders.
- Apply everyday performance best practices.

# Why It Matters

Vue is fast out of the box — its compiler optimizes templates automatically. But as apps grow,
two levers matter: **loading less JavaScript upfront** (code splitting) and **doing less work on
update** (caching and memoization). Knowing the built-in tools lets you keep a large app snappy
without premature micro-optimizing.

# Concept Explanation

### Async (lazy-loaded) components

`defineAsyncComponent` wraps a dynamic `import()` so a component is loaded **only when it's first
rendered**, in its own chunk:

```typescript
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
```

Use it for large, rarely used, or below-the-fold components. The advanced form adds a loading and
error UI:

```typescript
const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: Spinner,
  errorComponent: LoadError,
  delay: 200,     // wait before showing the spinner
  timeout: 8000,  // show error if it takes too long
})
```

Router routes are lazy-loaded the same way: `component: () => import('./View.vue')`.

### `<KeepAlive>`

By default, toggling a component with `v-if` or swapping a dynamic `<component>` **destroys and
recreates** it, losing its state. Wrap it in `<KeepAlive>` to **cache** the instance so its state
survives:

```html
<KeepAlive>
  <component :is="currentTab" />
</KeepAlive>
```

`include`/`exclude` (by component name) and `max` (cache size) control what's kept. Kept-alive
components get two extra lifecycle hooks: **`onActivated`** and **`onDeactivated`**, which fire as
they're shown and hidden (instead of mount/unmount).

### `v-once` — render once

`v-once` renders an element/subtree a single time and then never updates it — good for static
content that will never change:

```html
<h1 v-once>{{ appTitle }}</h1>
```

### `v-memo` — memoize a subtree

`v-memo="[deps]"` skips re-rendering a subtree unless one of the dependency values changes. It's a
targeted optimization for **large lists** where most rows rarely change:

```html
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <!-- re-renders only when id or selected changes -->
</div>
```

Use `v-memo` sparingly — only where profiling shows a hot spot; wrong dependency arrays cause
stale UI.

### Everyday performance habits

- **Stable `:key`s** in `v-for` so Vue reuses DOM efficiently.
- **`computed`** for derived values (cached) instead of recomputing in the template.
- **`shallowRef`/`shallowReactive`** for large data you replace wholesale (last lesson).
- **Virtualize** very long lists (render only visible rows) with a virtual-scroll library.
- Ship a **production build** (`vite build`) — it minifies, tree-shakes, and drops dev warnings.

# Key Terminology

- **`defineAsyncComponent`** — lazy-loads a component (its own chunk) on first render.
- **`<KeepAlive>`** — caches a toggled/swapped component so its state persists.
- **`onActivated` / `onDeactivated`** — lifecycle hooks for kept-alive components.
- **`v-once` / `v-memo`** — render once / skip re-render unless dependencies change.

# Options and Trade-offs

| Tool | Saves | Use when | Watch out for |
| ---- | ----- | -------- | ------------- |
| `defineAsyncComponent` | Initial bundle size | Large/rare components | A brief load delay on first show |
| `<KeepAlive>` | Re-creation + lost state | Tabs, wizards, back-navigation | Memory (use `max`) |
| `v-once` | Re-render of static content | Truly static subtrees | Never updates again |
| `v-memo` | Re-render of stable rows | Large lists (hot spots) | Wrong deps → stale UI |

# Worked Example

A tabbed panel where each tab is lazy-loaded and kept alive so its state (scroll, form input)
survives switching:

```html
<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

const tabs = {
  Reports: defineAsyncComponent(() => import('./Reports.vue')),
  Settings: defineAsyncComponent(() => import('./Settings.vue')),
} as const

const current = ref<keyof typeof tabs>('Reports')
</script>

<template>
  <nav>
    <button v-for="(_, name) in tabs" :key="name" @click="current = name">{{ name }}</button>
  </nav>

  <KeepAlive>
    <component :is="tabs[current]" />
  </KeepAlive>
</template>
```

Each tab's code loads on first visit (async), and `<KeepAlive>` preserves its state when you switch
away and back.

# Real World Analogy

`defineAsyncComponent` is **shipping furniture flat-packed** — you only unpack (download) a room's
furniture when you actually enter that room. `<KeepAlive>` is **leaving a room furnished** when you
step out, so it's exactly as you left it when you return, instead of rebuilding it. `v-memo` is a
**"do not disturb" sign** on a room that hasn't changed — skip cleaning it this round.

# Examples

## Example 1 — Basic: a lazy component

```typescript
const Editor = defineAsyncComponent(() => import('./RichTextEditor.vue'))
```

**Why this works:** The (large) editor's code is fetched only when it's first rendered, shrinking
the initial bundle.

## Example 2 — Real-world: keep-alive tabs with hooks

```html
<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue'
onActivated(() => console.log('tab shown'))
onDeactivated(() => console.log('tab hidden'))
</script>
```

**Why this works:** Inside a kept-alive component, `onActivated`/`onDeactivated` fire on show/hide
instead of mount/unmount, so you can pause/resume work.

## Example 3 — Trade-off / pitfall: wrong v-memo deps

```html
<div v-for="row in rows" :key="row.id" v-memo="[row.id]">
  {{ row.name }}   <!-- name changes won't re-render! -->
</div>
```

**Why this bites:** `v-memo` skips updates unless a listed dep changes. If `row.name` can change but
isn't in the deps, the UI goes stale. Include every value the subtree depends on — or don't use
`v-memo` here.

# Common Mistakes

- **Lazy-loading everything**, adding load delays where a component is always needed.
- **Expecting state to persist** across `v-if` toggles without `<KeepAlive>`.
- **Unbounded `<KeepAlive>`** caches — set `max` to cap memory.
- **`v-memo` with incomplete deps**, causing stale rows.

# Best Practices

- Lazy-load **large or rarely used** components and routes; keep the initial bundle lean.
- Use `<KeepAlive>` (with `max`) for tabs/wizards where losing state hurts UX.
- Reach for `v-once`/`v-memo` only at **profiled hot spots**, with correct deps.
- Rely on the compiler and stable keys first; always ship a **production build**.

# Summary

- **`defineAsyncComponent`** lazy-loads a component into its own chunk on first render (routes do
  the same with `() => import(...)`).
- **`<KeepAlive>`** caches a toggled/swapped component so its state survives; it adds
  `onActivated`/`onDeactivated`.
- **`v-once`** renders once; **`v-memo="[deps]"`** skips re-render unless deps change (use sparingly).
- Stable keys, `computed`, shallow reactivity, virtualization, and a production build are the
  everyday wins.

# Flash Cards

Q: What does defineAsyncComponent do?
A: It lazy-loads a component — wrapping a dynamic import so the component's code is fetched in its own chunk only when first rendered.

Q: What does <KeepAlive> do?
A: It caches a toggled or swapped component instance instead of destroying it, so its state (and DOM) persists; it also enables onActivated/onDeactivated hooks.

Q: What's the difference between v-once and v-memo?
A: v-once renders a subtree exactly once and never updates it; v-memo="[deps]" re-renders the subtree only when one of the listed dependencies changes.

Q: What's the risk of v-memo?
A: If the dependency array omits a value the subtree uses, the UI can go stale because Vue skips the update. Include every dependency, and use it only at hot spots.

Q: Which lifecycle hooks fire for a kept-alive component when it's shown and hidden?
A: onActivated (shown) and onDeactivated (hidden), instead of mounted/unmounted.

# Exercises

### Easy
Convert a heavy component to `defineAsyncComponent` and confirm (via the network tab) that its
chunk loads only when rendered.

### Medium
Build a two-tab interface with a dynamic `<component>` wrapped in `<KeepAlive>`. Put a text input
in one tab and verify its value survives switching tabs.

### Challenging
Render a list of 1,000 rows and profile updates. Add `v-memo="[row.id, row.active]"` to each row and
measure the improvement when toggling one row's `active`. Then discuss when virtualization would be
the better tool.

# Further Reading

- [Async Components](https://vuejs.org/guide/components/async.html)
- [KeepAlive](https://vuejs.org/guide/built-ins/keep-alive.html)
- [Performance](https://vuejs.org/guide/best-practices/performance.html)
- [`v-memo`](https://vuejs.org/api/built-in-directives.html#v-memo)
