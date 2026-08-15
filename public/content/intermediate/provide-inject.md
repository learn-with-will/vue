---
id: lesson-13
slug: provide-inject
title: "Provide / Inject"
level: intermediate
order: 13
duration: 16
summary: "Pass data deep into the component tree without prop-drilling using provide and inject, keep it reactive, and type it safely with an InjectionKey."
tags:
  - provide
  - inject
  - dependency-injection
  - prop-drilling
---

# Learning Objectives

By the end of this lesson you will be able to:

- Recognize the prop-drilling problem.
- Share data from an ancestor with `provide` and read it with `inject`.
- Keep provided data reactive.
- Type an injection safely with an `InjectionKey`.

# Why It Matters

When a deeply nested component needs data from a far-up ancestor, passing it as a prop through
every layer in between — **prop drilling** — is tedious and couples components that don't
actually care about the data. **Provide/inject** lets an ancestor offer data that any
descendant can grab directly, no matter how deep.

# Concept Explanation

### The prop-drilling problem

Imagine a `theme` value owned by the root, needed by a button five levels down. Without help,
every component in between must accept and re-pass a `theme` prop it doesn't use. That's noisy
and fragile.

### `provide` and `inject`

An ancestor calls `provide(key, value)` to make a value available to its entire subtree. Any
descendant calls `inject(key)` to read it:

```html
<!-- Ancestor.vue -->
<script setup lang="ts">
import { provide } from 'vue'
provide('theme', 'dark')
</script>
```

```html
<!-- DeepChild.vue (any depth below) -->
<script setup lang="ts">
import { inject } from 'vue'
const theme = inject('theme', 'light') // second arg is a default
</script>
```

The components in between don't need to know anything about `theme`.

### Keeping it reactive

To share reactive state, provide a `ref` or `reactive` object. Descendants that inject it will
update when it changes:

```html
<script setup lang="ts">
import { provide, ref } from 'vue'
const count = ref(0)
provide('count', count)          // provide the ref itself
function increment() { count.value++ }
provide('increment', increment)  // you can provide functions too
</script>
```

To let descendants read but not mutate shared state, wrap it with `readonly()` before
providing, and expose functions (like `increment`) for controlled updates.

### Typing with an `InjectionKey`

A plain string key isn't type-safe. Use an `InjectionKey<T>` so `inject` knows the value's
type:

```typescript
// keys.ts
import type { InjectionKey, Ref } from 'vue'
export const countKey = Symbol() as InjectionKey<Ref<number>>
```

```typescript
provide(countKey, count)          // TypeScript enforces Ref<number>
const count = inject(countKey)    // typed as Ref<number> | undefined
```

### App-level provide

`app.provide(key, value)` in your entry file makes something available to **every** component
in the app — handy for app-wide config.

# Key Terminology

- **Prop drilling** — passing a prop through many intermediate components that don't use it.
- **`provide`** — an ancestor offers a value to its subtree.
- **`inject`** — a descendant reads a provided value (with an optional default).
- **`InjectionKey<T>`** — a typed symbol key that makes injection type-safe.

# Options and Trade-offs

| Option | Reach | Use when | Watch out for |
| ------ | ----- | -------- | ------------- |
| Props/events | Parent ↔ direct child | Local, explicit data flow | Prop drilling across many layers |
| provide/inject | Ancestor → any descendant | Sharing across a subtree (theme, config, a widget's context) | Implicit — can be harder to trace |
| Pinia store | Whole app | App-wide shared state | Overkill for a single subtree value |

# Worked Example

A theme provider whose toggle is available anywhere below it:

```html
<!-- ThemeProvider.vue -->
<script setup lang="ts">
import { provide, ref, readonly } from 'vue'

const theme = ref<'light' | 'dark'>('light')
function toggle() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

provide('theme', readonly(theme)) // descendants can read but not reassign
provide('toggleTheme', toggle)    // controlled way to change it
</script>

<template>
  <div :class="theme"><slot /></div>
</template>
```

```html
<!-- ThemeToggle.vue (any depth below ThemeProvider) -->
<script setup lang="ts">
import { inject } from 'vue'
const theme = inject('theme')
const toggle = inject('toggleTheme')
</script>

<template>
  <button @click="toggle">Theme: {{ theme }}</button>
</template>
```

The provider owns the state and the toggle; the toggle button injects both without any
in-between component passing props.

# Real World Analogy

provide/inject is like a **building's Wi‑Fi**. The owner sets it up once at the top; any room
on any floor can connect directly using the network name (the key). Rooms in between don't have
to relay the signal room-to-room — that would be prop drilling.

# Examples

## Example 1 — Basic: providing a constant

```html
<script setup lang="ts">
import { provide } from 'vue'
provide('appName', 'Vue Portal')
</script>
```

**Why this works:** Any descendant can `inject('appName')` to read the app name without a prop
chain.

## Example 2 — Real-world: reactive user context

```typescript
import { provide, reactive } from 'vue'
const user = reactive({ name: 'Ada', role: 'admin' })
provide('user', user) // descendants react to changes
```

**Why this works:** Because a `reactive` object is provided, injecting components update
automatically when `user` changes.

## Example 3 — Trade-off / pitfall: injecting a non-reactive snapshot

```typescript
// Anti-pattern: provide a plain value read out of reactive state
provide('count', count.value)   // ❌ provides a number snapshot, not the ref
```

**Why this bites:** Providing `count.value` hands over a one-time number; descendants won't
update. Provide the **ref** (`provide('count', count)`) to keep reactivity.

# Common Mistakes

- **Providing `ref.value`** instead of the ref — that breaks reactivity for injectors.
- **Forgetting a default** in `inject(key, default)` when the provider might be absent.
- **Using string keys in TypeScript** and losing types — use an `InjectionKey<T>`.
- **Reaching for provide/inject app-wide** when a Pinia store is the better fit.

# Best Practices

- Provide **refs/reactive** objects (not their unwrapped values) to keep reactivity.
- Wrap shared state in `readonly()` and expose functions for controlled mutation.
- Use `InjectionKey<T>` (a `Symbol`) for type-safe, collision-free keys.
- Prefer provide/inject for a **subtree's** shared context; use Pinia for app-wide state.

# Summary

- **Prop drilling** is passing props through components that don't use them; provide/inject
  avoids it.
- An ancestor `provide(key, value)`; any descendant `inject(key, default)`.
- Provide a **ref/reactive** to keep data reactive; `readonly()` + functions give controlled
  updates.
- Use an **`InjectionKey<T>`** for type-safe injection; `app.provide` shares app-wide.

# Flash Cards

Q: What problem does provide/inject solve?
A: Prop drilling — it lets an ancestor share data directly with any descendant, without passing props through every intermediate component.

Q: How do you keep provided data reactive?
A: Provide a ref or reactive object (not its unwrapped .value). Injecting components then update when it changes.

Q: What's the second argument to inject for?
A: A default value used when no ancestor provided that key.

Q: How do you make injection type-safe in TypeScript?
A: Use an InjectionKey<T> (a Symbol typed as InjectionKey) as the key, so provide/inject infer the value's type.

Q: How can you let descendants read shared state but not mutate it?
A: Provide the state wrapped in readonly() and provide separate functions for controlled updates.

# Exercises

### Easy
Provide an `appName` string at the root and inject it in a deeply nested footer component.

### Medium
Create a `CounterProvider` that provides a reactive `count` and an `increment` function; inject
both in a child button several levels down and confirm the display updates.

### Challenging
Build a typed "auth context": an `InjectionKey` for a `readonly` user ref plus `login`/`logout`
functions. Provide it at the app root and consume it in a nested `UserMenu`. Handle the case
where the context is missing with a sensible default or error.

# Further Reading

- [Provide / Inject](https://vuejs.org/guide/components/provide-inject.html)
- [Typing Provide / Inject](https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject)
