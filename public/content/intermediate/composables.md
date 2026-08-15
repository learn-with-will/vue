---
id: lesson-14
slug: composables
title: "Composables"
level: intermediate
order: 14
duration: 18
summary: "Extract and reuse stateful logic with composables — plain functions that use the Composition API — and understand why they replaced mixins."
tags:
  - composables
  - reusability
  - composition-api
  - mixins
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a composable is and the `useX` naming convention.
- Extract reactive state and behavior into a reusable composable.
- Use lifecycle hooks and other composables inside one.
- Explain why composables replaced mixins.

# Why It Matters

You often need the same *stateful logic* in several components: tracking the mouse, fetching
data, debouncing input, reading window size. Copy-pasting it is a maintenance trap. A
**composable** packages that logic — reactive state plus the functions that manage it — into a
reusable function you call from any component. This is the Composition API's superpower.

> This very learning app is built with composables: its theme, progress, and course state each
> live in a `use…` function (see `src/core/stores`). You're using them right now.

### What a composable is

A **composable** is just a function that uses Composition API features (`ref`, `computed`,
lifecycle hooks, watchers) to encapsulate and reuse **stateful** logic. By convention its name
starts with **`use`** (`useMouse`, `useCounter`, `useFetch`). It returns the reactive state and
functions the caller needs.

```typescript
// composables/useCounter.ts
import { ref } from 'vue'

export function useCounter(start = 0) {
  const count = ref(start)
  const increment = () => count.value++
  const reset = () => (count.value = start)
  return { count, increment, reset }
}
```

```html
<script setup lang="ts">
import { useCounter } from './composables/useCounter'
const { count, increment, reset } = useCounter(10)
</script>

<template>
  <button @click="increment">{{ count }}</button>
  <button @click="reset">Reset</button>
</template>
```

### Each call is independent (usually)

Because the state is created **inside** the function, every component that calls `useCounter()`
gets its own separate `count`. If you instead want *shared* state across the whole app, declare
the state at **module scope** (outside the function) so all callers see the same instance —
that's the composable-as-store pattern this app uses for theme and progress.

### Using lifecycle hooks and other composables

A composable can register lifecycle hooks and call other composables. This one tracks the mouse
and cleans up after itself:

```typescript
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  function update(e: MouseEvent) {
    x.value = e.clientX
    y.value = e.clientY
  }
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  return { x, y }
}
```

The hooks belong to whichever component calls `useMouse()`, so cleanup happens automatically
when that component unmounts.

### Composables vs mixins

Before the Composition API, logic was shared with **mixins** (Options API objects merged into a
component). Mixins had real problems: **name collisions** between mixins, and an **unclear
source** — you couldn't tell which mixin a property came from. Composables fix both: everything
is explicit (you see the imports and the returned names), and you rename freely on destructure.

# Key Terminology

- **Composable** — a `useX` function that encapsulates reusable, stateful Composition API logic.
- **Stateful logic** — logic that owns reactive state (as opposed to a pure utility function).
- **Module-scoped state** — state declared outside the composable, shared by all callers.
- **Mixin** — the older Options-API mechanism for sharing logic, largely replaced by composables.

# Options and Trade-offs

| Option | Sharing model | Use when | Watch out for |
| ------ | ------------- | -------- | ------------- |
| Composable (state inside) | New state per call | Reusable behavior each component owns | — |
| Composable (module-scoped state) | One shared instance | App-wide shared state (a lightweight store) | Shared mutation from anywhere |
| Plain utility function | No reactivity | Pure helpers (formatting, math) | Not for reactive state |
| Mixin (Options API) | Merged into component | Legacy code | Name collisions, unclear origin — avoid in new code |

# Worked Example

A `useFetch` composable that loads a URL and exposes loading/error/data:

```typescript
// composables/useFetch.ts
import { ref, watchEffect, toValue, type MaybeRefOrGetter } from 'vue'

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const error = ref<unknown>(null)
  const loading = ref(false)

  watchEffect(async () => {
    loading.value = true
    error.value = null
    data.value = null
    try {
      const res = await fetch(toValue(url)) // toValue reads a ref/getter/plain value
      data.value = (await res.json()) as T
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  })

  return { data, error, loading }
}
```

```html
<script setup lang="ts">
import { useFetch } from './composables/useFetch'
const { data, loading, error } = useFetch<{ name: string }>('/api/me')
</script>

<template>
  <p v-if="loading">Loading…</p>
  <p v-else-if="error">Failed to load</p>
  <p v-else>{{ data?.name }}</p>
</template>
```

Any component can now fetch with three lines. Passing the URL as a ref/getter (via
`MaybeRefOrGetter` + `toValue`) means it can even refetch when the URL changes.

# Real World Analogy

A composable is a **kitchen appliance you can plug in anywhere**. A blender (`useCounter`,
`useMouse`) bundles the motor and buttons; you plug it into any outlet (component) and it works,
each with its own jar of ingredients (its own state). Mixins were more like **pouring several
recipes into one bowl** — if two used "sugar," you couldn't tell whose was whose.

# Examples

## Example 1 — Basic: a toggle composable

```typescript
import { ref } from 'vue'
export function useToggle(initial = false) {
  const on = ref(initial)
  const toggle = () => (on.value = !on.value)
  return { on, toggle }
}
```

**Why this works:** It packages a boolean and its toggler; each caller gets an independent `on`.

## Example 2 — Real-world: shared state via module scope

```typescript
import { reactive } from 'vue'
const state = reactive({ user: null as null | { name: string } }) // shared

export function useSession() {
  function login(name: string) { state.user = { name } }
  function logout() { state.user = null }
  return { state, login, logout }
}
```

**Why this works:** `state` is declared outside the function, so every `useSession()` shares the
same session — a tiny store without a library.

## Example 3 — Trade-off / pitfall: expecting shared state from in-function state

```typescript
export function useCounter() {
  const count = ref(0)  // NEW each call
  return { count }
}
// Two components calling useCounter() do NOT share `count`
```

**Why this bites:** State declared inside the composable is per-call. If you wanted a single
shared counter, move `count` to module scope.

# Common Mistakes

- **Expecting in-function state to be shared** across components — it isn't; move it to module
  scope if you want sharing.
- **Not cleaning up** listeners/timers — register `onUnmounted` inside the composable.
- **Calling composables conditionally or after `await`** — call them at the top of `setup`, like
  hooks.
- **Reaching for mixins** in new code — use composables instead.

# Best Practices

- Name composables `useX` and return an object of refs/functions.
- Keep each composable focused on one concern; compose them together as needed.
- Put lifecycle-based setup/cleanup **inside** the composable so callers get it for free.
- Choose in-function state for per-component behavior, module-scoped state for shared stores.

# Summary

- A **composable** is a `useX` function that packages reusable, stateful Composition API logic.
- State declared **inside** is per-call; state at **module scope** is shared by all callers.
- Composables can use lifecycle hooks and other composables, with automatic cleanup.
- They **replace mixins**, avoiding name collisions and unclear origins.

# Flash Cards

Q: What is a composable?
A: A function (named useX by convention) that uses the Composition API to encapsulate and reuse stateful logic, returning reactive state and functions.

Q: Do two components calling the same composable share its state?
A: Only if the state is declared at module scope (outside the function). State declared inside the composable is created fresh for each caller.

Q: How do composables handle cleanup like removing event listeners?
A: They register lifecycle hooks (e.g. onUnmounted) inside the composable, so cleanup runs automatically for whichever component called it.

Q: Why did composables replace mixins?
A: Mixins caused name collisions and made it unclear which mixin a property came from. Composables are explicit — you see the imports and the returned names, and can rename on destructure.

Q: What convention should a composable's name follow?
A: It should start with "use", e.g. useMouse, useFetch, useCounter.

# Exercises

### Easy
Write a `useToggle` composable returning `{ on, toggle }` and use it to show/hide a panel.

### Medium
Create a `useLocalStorage(key, initial)` composable that returns a ref synced to `localStorage`
via a watcher. Use it for a persisted setting.

### Challenging
Build a `useWindowSize` composable that tracks `width`/`height` with a resize listener and
cleans up on unmount. Then compose it inside another composable, `useIsMobile`, that returns a
computed boolean.

# Further Reading

- [Composables](https://vuejs.org/guide/reusability/composables.html)
- [Composables vs. Mixins](https://vuejs.org/guide/reusability/composables.html#vs-mixins)
