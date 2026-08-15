---
id: lesson-08
slug: lifecycle-hooks-and-watchers
title: "Lifecycle Hooks & Watchers"
level: beginner
order: 8
duration: 20
summary: "Run code at key moments with lifecycle hooks like onMounted and onUnmounted, and react to state changes with watch and watchEffect — including when to use each."
tags:
  - lifecycle
  - onmounted
  - watch
  - watcheffect
---

# Learning Objectives

By the end of this lesson you will be able to:

- Run code when a component mounts and clean up when it unmounts.
- Name the common Composition API lifecycle hooks.
- React to state changes with `watch`.
- Use `watchEffect` and explain how it differs from `watch`.
- Understand watcher flush timing at a high level.

# Why It Matters

Sometimes you need to do something *because* time passed or state changed — fetch data when a
component appears, start a timer, focus an input, or persist a value whenever it changes.
Computed properties can't do this (they must be pure). **Lifecycle hooks** and **watchers**
are the tools for these side effects.

# Concept Explanation

### Lifecycle hooks

A component goes through a lifecycle: it's created, mounted to the DOM, updated as state
changes, and finally unmounted. The Composition API lets you hook into these moments with
functions you call **synchronously inside `<script setup>`**:

```html
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('Component is now in the DOM')
})

onUnmounted(() => {
  console.log('Component was removed — clean up here')
})
</script>
```

The most-used hooks:

- **`onMounted`** — the component's DOM exists; do DOM work or fetch initial data.
- **`onUnmounted`** — the component is being removed; clean up timers, listeners, subscriptions.
- **`onBeforeMount` / `onBeforeUnmount`** — just before those moments.
- **`onUpdated` / `onBeforeUpdate`** — around DOM re-renders caused by state changes.

Because they register callbacks, hooks must be called during `setup` (synchronously), not
inside an `if` or after an `await`.

### Watching with `watch`

`watch` runs a callback whenever a specific reactive **source** changes. It's **lazy** — the
callback doesn't run until the source changes (unless you ask for `immediate`):

```typescript
import { ref, watch } from 'vue'

const query = ref('')

watch(query, (newValue, oldValue) => {
  console.log(`changed from "${oldValue}" to "${newValue}"`)
})
```

The source can be a ref, a **getter** `() => something`, a reactive object, or an array of
several sources:

```typescript
watch(() => user.id, fetchUser)          // getter
watch([a, b], ([newA, newB]) => { … })   // multiple sources
```

Useful options: `{ immediate: true }` runs the callback once right away; `{ deep: true }`
watches nested changes in an object; `{ once: true }` runs it at most once.

### Watching with `watchEffect`

`watchEffect` runs its function **immediately**, and **automatically tracks** whatever
reactive state the function reads — re-running when any of it changes. You don't list
sources:

```typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)
watchEffect(() => {
  document.title = `Count: ${count.value}`
})
```

### `watch` vs `watchEffect`

- Use **`watch`** when you need the old value, want to run lazily, or want to watch a specific
  source.
- Use **`watchEffect`** when you just want "run this whenever the state it uses changes," with
  no explicit source list.

### Flush timing (brief)

By default a watcher's callback runs **before** Vue updates the DOM (`flush: 'pre'`). If you
need the updated DOM (e.g. to measure an element), use `flush: 'post'`. `flush: 'sync'` runs
synchronously on every change (rarely needed). Watchers created in `setup` are automatically
stopped when the component unmounts; `watch`/`watchEffect` also return a **stop handle** you
can call to stop them early.

# Key Terminology

- **Lifecycle hook** — a function that runs at a specific stage of a component's life.
- **`onMounted` / `onUnmounted`** — the mount and unmount hooks (setup and cleanup).
- **Watcher** — code that reacts to changes in reactive state.
- **Source** — the reactive value(s) a `watch` observes.
- **Flush timing** — when a watcher's callback runs relative to DOM updates (`pre`/`post`/`sync`).

# Options and Trade-offs

| Option | Runs | Tracks | Best for |
| ------ | ---- | ------ | -------- |
| `watch(source, cb)` | Lazily, on source change | The explicit source(s) | Reacting to a specific value; needing old + new |
| `watchEffect(cb)` | Immediately, then on change | Everything read inside | "Keep this in sync" side effects |
| `onMounted` | Once, after mount | — | DOM access, initial fetch |
| `onUnmounted` | Once, before removal | — | Cleanup (timers, listeners) |

# Worked Example

Fetch data on mount, keep the document title in sync, and clean up a timer:

```html
<script setup lang="ts">
import { ref, watch, watchEffect, onMounted, onUnmounted } from 'vue'

const userId = ref(1)
const user = ref<{ name: string } | null>(null)

async function fetchUser(id: number) {
  user.value = null
  const res = await fetch(`/api/users/${id}`)
  user.value = await res.json()
}

// Re-fetch whenever userId changes; run once immediately.
watch(userId, (id) => fetchUser(id), { immediate: true })

// Keep the title in sync with whatever it reads.
watchEffect(() => {
  document.title = user.value ? user.value.name : 'Loading…'
})

// A timer that must be cleaned up on unmount.
let timer: number
onMounted(() => {
  timer = window.setInterval(() => console.log('tick'), 1000)
})
onUnmounted(() => clearInterval(timer))
</script>
```

`watch` reacts to `userId` (lazy but `immediate`), `watchEffect` auto-tracks `user`, and the
lifecycle hooks set up and tear down the timer.

# Real World Analogy

Lifecycle hooks are like **arriving at and leaving a rented venue**: `onMounted` is setup
when you get the keys; `onUnmounted` is cleanup before you hand them back. A `watch` is a
**motion sensor aimed at one door** — it fires when that specific thing changes.
`watchEffect` is a **smart thermostat** — it just keeps the room in sync with whatever it's
reading, adjusting whenever any input changes.

# Examples

## Example 1 — Basic: focus an input on mount

```html
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const input = ref<HTMLInputElement | null>(null)
onMounted(() => input.value?.focus())
</script>

<template>
  <input ref="input" />
</template>
```

**Why this works:** `onMounted` runs after the DOM exists, so the template ref is available to
focus.

## Example 2 — Real-world: persist a value on change

```typescript
import { ref, watch } from 'vue'

const theme = ref(localStorage.getItem('theme') ?? 'light')
watch(theme, (value) => localStorage.setItem('theme', value))
```

**Why this works:** The watcher runs whenever `theme` changes, writing it through to storage.

## Example 3 — Trade-off / pitfall: registering a hook conditionally

```typescript
// Anti-pattern: hook inside a condition / after await
if (someFlag) {
  onMounted(() => {})   // may not register correctly
}
```

**Why this bites:** Lifecycle hooks must be called synchronously during setup so Vue can
associate them with the current component. Calling them inside a branch or after `await` can
silently fail to register.

# Common Mistakes

- **Using a computed for side effects.** Fetching or DOM work belongs in a hook or watcher,
  not a computed getter.
- **Forgetting cleanup.** Timers, event listeners, and subscriptions set up in `onMounted`
  should be torn down in `onUnmounted`.
- **Registering hooks conditionally or after `await`** — call them synchronously in setup.
- **Reaching for `watch` when `watchEffect` is simpler** (or vice versa). Pick by whether you
  need an explicit source and the old value.

# Best Practices

- Do initial data fetching in `onMounted` (or a `watch(..., { immediate: true })`).
- Always pair setup with cleanup: `onMounted` ↔ `onUnmounted`.
- Prefer `watchEffect` for "keep X in sync"; prefer `watch` when you need the previous value
  or a specific source.
- Use `flush: 'post'` only when you must read the updated DOM inside the watcher.

# Summary

- Lifecycle hooks (`onMounted`, `onUnmounted`, `onUpdated`, …) run code at stages of a
  component's life and must be registered synchronously in setup.
- `watch(source, cb)` reacts to a specific source, lazily, with access to old and new values.
- `watchEffect(cb)` runs immediately and auto-tracks whatever reactive state it reads.
- Watcher callbacks flush **before** DOM updates by default (`flush: 'post'` to read the DOM).
- Clean up side effects in `onUnmounted`.

# Flash Cards

Q: What is onMounted commonly used for?
A: Running code once the component's DOM exists — accessing DOM elements/refs and fetching initial data.

Q: What is the difference between watch and watchEffect?
A: watch is lazy and takes explicit sources (and gives you old + new values); watchEffect runs immediately and automatically tracks whatever reactive state its function reads.

Q: Why must lifecycle hooks be called synchronously in setup?
A: So Vue can associate them with the current component instance. Calling them inside a condition or after await can fail to register.

Q: Where should you clean up a timer started in onMounted?
A: In onUnmounted, so the timer is cleared when the component is removed.

Q: When does a watcher's callback run relative to DOM updates by default, and how do you change it?
A: By default before the DOM updates (flush: 'pre'). Use flush: 'post' to run after the DOM has updated (e.g. to measure an element).

Q: Which option makes a watch run its callback once immediately in addition to on change?
A: The { immediate: true } option.

# Exercises

### Easy
Use `onMounted` to log a message and `onUnmounted` to log another, then toggle the component
with `v-if` to see both fire.

### Medium
Watch a `search` ref and, whenever it changes, `console.log` the old and new values. Add
`{ immediate: true }` and observe the first call.

### Challenging
Build a component that starts a `setInterval` clock in `onMounted`, shows the current time
reactively, and clears the interval in `onUnmounted`. Then add a `watchEffect` that updates
`document.title` with the time and confirm it stops when the component unmounts.

# Further Reading

- [Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)
- [Watchers](https://vuejs.org/guide/essentials/watchers.html)
- [`watch()` / `watchEffect()` — API](https://vuejs.org/api/reactivity-core.html#watch)
