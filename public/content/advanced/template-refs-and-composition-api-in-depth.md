---
id: lesson-17
slug: template-refs-and-composition-api-in-depth
title: "Template Refs & Composition API in Depth"
level: advanced
order: 17
duration: 18
summary: "Access DOM elements and child components with template refs, expose a child's API with defineExpose, wait for the DOM with nextTick, and use reactivity utilities like toRef, toRefs, and toValue."
tags:
  - template-refs
  - defineexpose
  - nexttick
  - torefs
---

# Learning Objectives

By the end of this lesson you will be able to:

- Access a DOM element with a template ref.
- Get a reference to a child component and its exposed API.
- Wait for the DOM to update with `nextTick`.
- Use `toRef`, `toRefs`, `unref`, and `toValue` correctly.

# Why It Matters

Most of the time you let Vue drive the DOM. But sometimes you need a **direct handle** — to
focus an input, measure an element, play a video, or call a method a child exposes. **Template
refs** provide that handle. And the Composition API ships small **reactivity utilities** that
smooth over the rough edges of passing reactive values around.

# Concept Explanation

### Template refs to DOM elements

Add a `ref="name"` attribute in the template and declare a matching ref in the script. After the
component mounts, the ref holds the DOM element:

```html
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const inputEl = ref<HTMLInputElement | null>(null)
onMounted(() => inputEl.value?.focus())
</script>

<template>
  <input ref="inputEl" />
</template>
```

The ref is `null` until the element is mounted, so access it in `onMounted` or later — not
during setup. Vue 3.5 also adds `useTemplateRef('inputEl')` as an alternative that matches by
the string name.

### Refs to child components and `defineExpose`

A ref on a child component gives you the child's instance. But a `<script setup>` component is
**closed by default** — the parent can't see its internals unless the child opts in with
`defineExpose`:

```html
<!-- VideoPlayer.vue -->
<script setup lang="ts">
function play() { /* … */ }
defineExpose({ play }) // make play() visible to a parent ref
</script>
```

```html
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import VideoPlayer from './VideoPlayer.vue'
const player = ref<InstanceType<typeof VideoPlayer> | null>(null)
function start() { player.value?.play() }
</script>

<template>
  <VideoPlayer ref="player" />
  <button @click="start">Play</button>
</template>
```

### `nextTick`

Vue batches DOM updates. If you change state and immediately need the **updated** DOM, await
`nextTick()`:

```typescript
import { nextTick, ref } from 'vue'
const list = ref<string[]>([])

async function addAndScroll(el: HTMLElement) {
  list.value.push('new')
  await nextTick()          // DOM now reflects the new item
  el.scrollTop = el.scrollHeight
}
```

### Reactivity utilities

- **`toRef`** — creates a ref that stays linked to a property of a reactive object:
  `const name = toRef(props, 'name')`.
- **`toRefs`** — converts every property of a reactive object into refs, so you can destructure
  without losing reactivity (great for returning from composables).
- **`unref(x)`** — returns `x.value` if `x` is a ref, otherwise `x` (shorthand for
  "value or itself").
- **`toValue(x)`** — like `unref`, but also calls `x` if it's a **getter function**. Useful in
  composables that accept a ref, a getter, or a plain value (`MaybeRefOrGetter`).
- **`isRef(x)`** — checks whether `x` is a ref.

```typescript
import { reactive, toRefs } from 'vue'
const state = reactive({ x: 1, y: 2 })
const { x, y } = toRefs(state) // x, y are refs linked to state
```

### Refs inside `v-for`

If you put `ref` on an element inside `v-for`, Vue collects the elements into the ref as an
**array** (order matches the list). Bind a function ref for full control if you need it.

# Key Terminology

- **Template ref** — a `ref="name"` handle to a DOM element or child component.
- **`defineExpose`** — declares which properties/methods a `<script setup>` component reveals to a
  parent ref.
- **`nextTick`** — a promise that resolves after Vue applies pending DOM updates.
- **`toRef` / `toRefs`** — link reactive-object properties to refs (singular/plural).
- **`unref` / `toValue`** — read the underlying value of a ref (or getter, for `toValue`).

# Options and Trade-offs

| Utility | Input | Returns | Use when |
| ------- | ----- | ------- | -------- |
| `toRef` | reactive object + key | A linked ref | Passing one property around as a ref |
| `toRefs` | reactive object | Object of linked refs | Destructuring reactive state without losing reactivity |
| `unref` | ref or value | The value | You accept "maybe a ref" and want the value |
| `toValue` | ref, getter, or value | The value | Composables accepting `MaybeRefOrGetter` |

# Worked Example

A composable that measures an element's width and updates after DOM changes:

```html
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const box = ref<HTMLElement | null>(null)
const width = ref(0)
const items = ref<string[]>([])

async function measure() {
  await nextTick()               // wait for the DOM to reflect state
  width.value = box.value?.offsetWidth ?? 0
}

onMounted(measure)

async function addItem() {
  items.value.push(`Item ${items.value.length + 1}`)
  await measure()                // re-measure after the new item renders
}
</script>

<template>
  <div ref="box">
    <p v-for="item in items" :key="item">{{ item }}</p>
  </div>
  <p>Width: {{ width }}px</p>
  <button @click="addItem">Add</button>
</template>
```

The template ref (`box`) gives a real element to measure, and `nextTick` guarantees the
measurement reflects the latest DOM.

# Real World Analogy

A template ref is a **remote control** paired to one specific device. Vue usually runs the room's
automation, but the remote lets you reach out and press a button on exactly that TV (element) or
appliance (child component). `defineExpose` is the device deciding **which buttons** the remote
is allowed to press. `nextTick` is waiting for the screen to finish redrawing before you read
what's on it.

# Examples

## Example 1 — Basic: focus on mount

```html
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const el = ref<HTMLInputElement | null>(null)
onMounted(() => el.value?.focus())
</script>

<template><input ref="el" /></template>
```

**Why this works:** After mount, `el.value` is the real input, so `.focus()` works.

## Example 2 — Real-world: toRefs in a composable

```typescript
import { reactive, toRefs } from 'vue'
export function useForm() {
  const state = reactive({ name: '', email: '' })
  return { ...toRefs(state) } // caller can destructure name/email reactively
}
```

**Why this works:** `toRefs` lets the caller `const { name } = useForm()` and keep reactivity.

## Example 3 — Trade-off / pitfall: reading a ref before mount

```typescript
const el = ref<HTMLElement | null>(null)
console.log(el.value) // null during setup — element not mounted yet
```

**Why this bites:** Template refs are populated on mount. Access them in `onMounted` (or later),
not synchronously during setup.

# Common Mistakes

- **Reading a template ref during setup** — it's `null` until mounted.
- **Expecting to reach a child's internals** without `defineExpose` — `<script setup>` is closed.
- **Reading the DOM right after a state change** without awaiting `nextTick`.
- **Destructuring a reactive object** and losing reactivity — use `toRefs`.

# Best Practices

- Access template refs in `onMounted` or event handlers, never during setup.
- Expose a **minimal, intentional API** from children via `defineExpose`.
- Use `nextTick` whenever you need to read or act on the DOM after changing state.
- Return `toRefs(state)` from composables so callers can destructure freely.

# Summary

- A **template ref** (`ref="name"`) hands you a DOM element or child component after mount.
- `<script setup>` components are closed; use **`defineExpose`** to reveal a child's methods.
- **`nextTick`** waits for Vue to flush DOM updates before you read them.
- **`toRef`/`toRefs`** link reactive properties to refs; **`unref`/`toValue`** read a ref's (or
  getter's) value.

# Flash Cards

Q: When is a template ref actually populated with its element?
A: After the component mounts. During setup it's still null, so access it in onMounted or later.

Q: Why can't a parent call a child's method through a ref by default?
A: A <script setup> component is closed; it must opt in by declaring the method with defineExpose for a parent ref to see it.

Q: What does nextTick do?
A: It returns a promise that resolves after Vue applies pending DOM updates, so you can read or act on the up-to-date DOM.

Q: What problem does toRefs solve?
A: Destructuring a reactive object loses reactivity; toRefs converts each property into a linked ref so you can destructure and stay reactive.

Q: What's the difference between unref and toValue?
A: unref returns x.value if x is a ref, else x. toValue does the same but also calls x if it's a getter function — handy for MaybeRefOrGetter inputs.

# Exercises

### Easy
Add a button that focuses a text input using a template ref and `onMounted`/click handler.

### Medium
Create a child `Timer.vue` with `start`/`stop` methods exposed via `defineExpose`, and control it
from a parent through a component ref.

### Challenging
Build a chat log that appends messages and, after each new message, uses `nextTick` to scroll to
the bottom via a template ref. Then extract the scroll logic into a composable using `toValue` so
it accepts either a ref or a getter for the container.

# Further Reading

- [Template Refs](https://vuejs.org/guide/essentials/template-refs.html)
- [`defineExpose`](https://vuejs.org/api/sfc-script-setup.html#defineexpose)
- [Reactivity Utilities — `toRef`, `toRefs`, `toValue`](https://vuejs.org/api/reactivity-utilities.html)
- [`nextTick`](https://vuejs.org/api/general.html#nexttick)
