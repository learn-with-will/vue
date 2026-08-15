---
id: lesson-18
slug: reactivity-in-depth
title: "Reactivity in Depth"
level: advanced
order: 18
duration: 20
summary: "How Vue's Proxy-based reactivity really works, plus the tools for edge cases: shallowRef and shallowReactive, customRef, triggerRef, and toRaw/markRaw, with a recap of watcher flush timing."
tags:
  - reactivity
  - proxy
  - shallowref
  - customref
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain how Vue tracks dependencies and triggers updates.
- Use `shallowRef` and `shallowReactive` for performance.
- Build a `customRef` (e.g. a debounced ref).
- Opt out of reactivity with `toRaw`/`markRaw`, and recap flush timing.

# Why It Matters

You can use Vue's reactivity for a long time without knowing how it works — but when you hit an
edge (a huge non-reactive dataset, a value that shouldn't be deeply tracked, a custom debounce),
understanding the machinery lets you reach for the right tool instead of fighting the framework.

# Concept Explanation

### How tracking and triggering work

Vue 3's reactivity is built on JavaScript **Proxies**. When you read a reactive property inside
an effect (a render, a `computed`, or a `watchEffect`), Vue **tracks** that the effect depends on
it. When you write to that property, Vue **triggers** the effects that depend on it to re-run.

- `reactive(obj)` returns a **Proxy** whose `get` traps track and `set` traps trigger.
- `ref(value)` is an object with a `.value` getter/setter that track and trigger; if the value is
  an object, it's made reactive internally.

That's the whole model: **track on read, trigger on write.** Everything else builds on it.

### Deep by default — and how to opt out

`reactive` and `ref` are **deep**: nested objects are reactive too. For large structures you may
not need deep tracking. **`shallowRef`** and **`shallowReactive`** track only the top level:

```typescript
import { shallowRef, triggerRef } from 'vue'

const state = shallowRef({ count: 0 }) // only .value reassignment is reactive
state.value.count++                    // NOT tracked (deep change to a shallow ref)
state.value = { count: 1 }             // tracked (reassigning .value)
```

If you deeply mutate a `shallowRef` and still want to force an update, call **`triggerRef`**:

```typescript
state.value.count++
triggerRef(state) // force effects to re-run
```

Use shallow variants when a value is large and you either replace it wholesale or manage updates
yourself.

### `customRef`

**`customRef`** lets you control exactly when tracking and triggering happen, by giving you
`track` and `trigger` functions. A classic use is a debounced ref that only updates after typing
stops:

```typescript
import { customRef } from 'vue'

function useDebouncedRef<T>(value: T, delay = 300) {
  let timeout: number
  return customRef<T>((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newValue) {
      clearTimeout(timeout)
      timeout = window.setTimeout(() => {
        value = newValue
        trigger()
      }, delay)
    },
  }))
}
```

### Escaping reactivity: `toRaw` and `markRaw`

- **`toRaw(proxy)`** returns the original, non-proxied object — handy for cheap reads or handing
  data to a non-Vue library.
- **`markRaw(obj)`** marks an object so Vue **never** makes it reactive (e.g. a large third-party
  class instance, a map you'll never render reactively).

### Reactivity caveats to remember

- Adding a **new property** to a `reactive` object *is* tracked in Vue 3 (Proxies see it) — a
  change from Vue 2.
- **Reassigning** a whole `reactive` object still breaks the link — mutate or use a `ref`.
- `reactive` works on **`Map` and `Set`** too, not just plain objects and arrays.

### Watcher flush timing (recap)

Watcher callbacks flush **`'pre'`** (before render, default), **`'post'`** (after the DOM
updates — use to read the DOM), or **`'sync'`** (synchronously on each change; rarely needed and
can hurt performance). `watchPostEffect` and `watchSyncEffect` are `watchEffect` with `post`/`sync`
timing.

# Key Terminology

- **Proxy** — the JavaScript feature Vue uses to intercept reads/writes for tracking/triggering.
- **Track / Trigger** — recording a dependency on read; re-running effects on write.
- **`shallowRef` / `shallowReactive`** — reactivity limited to the top level.
- **`customRef`** — a ref with custom track/trigger control.
- **`toRaw` / `markRaw`** — get the raw object / prevent an object from becoming reactive.

# Options and Trade-offs

| Tool | What it changes | Use when | Watch out for |
| ---- | --------------- | -------- | ------------- |
| `ref` / `reactive` | Deep reactivity | Normal state | Deep tracking cost on huge objects |
| `shallowRef` / `shallowReactive` | Top-level only | Large data you replace wholesale | Deep mutations aren't tracked (use `triggerRef`) |
| `customRef` | Custom track/trigger | Debounce, throttle, validation | More code; get the timing right |
| `markRaw` / `toRaw` | Opt out of reactivity | Non-Vue libs, huge inert data | You lose reactivity by design |

# Worked Example

A search box using a debounced `customRef` so the expensive filter runs only after typing stops:

```html
<script setup lang="ts">
import { customRef, computed } from 'vue'

function useDebouncedRef(value: string, delay = 300) {
  let timeout: number
  return customRef<string>((track, trigger) => ({
    get() { track(); return value },
    set(v) {
      clearTimeout(timeout)
      timeout = window.setTimeout(() => { value = v; trigger() }, delay)
    },
  }))
}

const query = useDebouncedRef('')
const names = ['Ada', 'Alan', 'Grace', 'Linus']
const matches = computed(() => names.filter((n) => n.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <input v-model="query" placeholder="Search…" />
  <ul><li v-for="n in matches" :key="n">{{ n }}</li></ul>
</template>
```

The `customRef` delays the trigger, so `matches` recomputes 300 ms after the last keystroke — not
on every character.

# Real World Analogy

Reactivity is a **subscription service**. When a component "reads" a value, it subscribes
(track); when the value changes, the publisher notifies all subscribers (trigger). `shallowRef`
is a subscription that only alerts you when the *whole magazine* is swapped, not when a single
article inside is edited. `customRef` is you writing your own delivery rules — "hold my mail and
deliver once a day."

# Examples

## Example 1 — Basic: shallowRef for a big blob

```typescript
import { shallowRef } from 'vue'
const chart = shallowRef(loadHugeDataset()) // replaced wholesale, not deeply tracked
```

**Why this works:** You only ever reassign `chart.value`, so shallow tracking avoids the cost of
making a giant object deeply reactive.

## Example 2 — Real-world: markRaw for a third-party instance

```typescript
import { markRaw, reactive } from 'vue'
const state = reactive({ map: markRaw(new ExternalMap()) }) // never proxied
```

**Why this works:** `ExternalMap` manages its own internals; `markRaw` keeps Vue from wrapping it
in a Proxy that could interfere.

## Example 3 — Trade-off / pitfall: mutating a shallowRef deeply

```typescript
const s = shallowRef({ n: 0 })
s.value.n++          // UI does NOT update — deep change on a shallow ref
```

**Why this bites:** `shallowRef` only reacts to `.value` reassignment. Either reassign
(`s.value = { n: s.value.n + 1 }`) or call `triggerRef(s)` to force the update.

# Common Mistakes

- **Deeply mutating a `shallowRef`** and expecting updates — reassign or `triggerRef`.
- **Reassigning a `reactive` object** and losing reactivity — mutate it or use a `ref`.
- **Marking too much as raw** and then wondering why the UI won't update.
- **Using `flush: 'sync'`** casually — it can cause performance problems.

# Best Practices

- Default to `ref`/`reactive`; reach for **shallow** variants only for large data you replace
  wholesale.
- Use **`customRef`** for cross-cutting input behavior like debouncing.
- Use **`markRaw`/`toRaw`** to keep non-reactive, third-party, or huge inert data out of the
  Proxy system.
- Prefer `flush: 'post'` when a watcher must read the DOM; avoid `'sync'` unless necessary.

# Summary

- Vue reactivity = **Proxies** that **track on read** and **trigger on write**; a `ref` does this
  via `.value`.
- `reactive`/`ref` are **deep**; `shallowRef`/`shallowReactive` track only the top level
  (`triggerRef` forces a shallow update).
- **`customRef`** gives you manual track/trigger control (e.g. debounce).
- **`toRaw`/`markRaw`** opt out of reactivity; watcher flush is `pre`/`post`/`sync`.

# Flash Cards

Q: In one line, how does Vue's reactivity work?
A: It uses Proxies to track which effects read each reactive value, and triggers those effects to re-run when the value is written.

Q: What does shallowRef track?
A: Only reassignment of its .value — not deep mutations of the object it holds. Use triggerRef to force an update after a deep change.

Q: What is customRef for?
A: Creating a ref with custom control over when it tracks (on get) and triggers (on set) — for example, a debounced ref that updates only after typing stops.

Q: What's the difference between toRaw and markRaw?
A: toRaw returns the original non-proxied object from a reactive proxy; markRaw flags an object so Vue never makes it reactive at all.

Q: In Vue 3, does adding a new property to a reactive object trigger reactivity?
A: Yes — because reactive uses a Proxy, newly added properties are tracked (a change from Vue 2, which needed Vue.set).

# Exercises

### Easy
Create a `shallowRef` holding an object, mutate a nested property, and observe the UI not
updating; then fix it with `triggerRef` or reassignment.

### Medium
Write a `useDebouncedRef` composable with `customRef` and use it to debounce a search input.

### Challenging
Profile a component that stores a large array in `reactive` versus `shallowRef` and replaces it
wholesale on each update. Explain the difference, and add `markRaw` to a nested third-party object
to keep it out of the reactivity system.

# Further Reading

- [Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [`shallowRef` / `triggerRef` / `customRef`](https://vuejs.org/api/reactivity-advanced.html)
- [`toRaw` / `markRaw`](https://vuejs.org/api/reactivity-advanced.html#toraw)
