---
id: lesson-19
slug: teleport-and-suspense
title: "Built-in Components: Teleport & Suspense"
level: advanced
order: 19
duration: 16
summary: "Render DOM elsewhere in the document with Teleport (for modals and tooltips), and coordinate async components with the experimental Suspense and its fallback slot."
tags:
  - teleport
  - suspense
  - built-in-components
  - async
---

# Learning Objectives

By the end of this lesson you will be able to:

- Use `<Teleport>` to render content elsewhere in the DOM.
- Explain why teleporting helps modals and tooltips.
- Use `<Suspense>` to show a fallback while async components load.
- Recognize that Suspense is experimental.

# Why It Matters

Two problems come up constantly in real apps. First, **modals and tooltips** need to escape a
parent's `overflow: hidden` or stacking context — but the logic belongs with the component that
opened them. Second, components that **load data asynchronously** need a clean way to show a
loading state. Vue's built-in `<Teleport>` and `<Suspense>` solve exactly these.

# Concept Explanation

### Teleport

`<Teleport>` renders its children into a **different part of the DOM** (given by a CSS selector),
while keeping them logically part of your component — props, events, and reactivity all still
work:

```html
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <button @click="open = true">Open modal</button>

  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click="open = false">
      <div class="modal" @click.stop>
        <p>I'm rendered at the end of &lt;body&gt;, not inside the button's box.</p>
        <button @click="open = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>
```

Because the modal markup is moved to `<body>`, it isn't trapped by any ancestor's `overflow` or
`z-index` — a common source of "my modal is cut off" bugs. The `to` prop takes a selector (or an
element). A `disabled` prop can turn teleporting off conditionally (e.g. render inline on mobile).

### Suspense (experimental)

> **Suspense is experimental.** Its API may change; use it knowingly.

`<Suspense>` coordinates **async dependencies** in its subtree. If a descendant component uses an
**async `setup()`** (top-level `await`) or is an **async component**, Suspense shows a `#fallback`
until all such dependencies resolve, then swaps in the real content:

```html
<template>
  <Suspense>
    <template #default>
      <UserProfile />   <!-- its setup() awaits data -->
    </template>
    <template #fallback>
      <p>Loading profile…</p>
    </template>
  </Suspense>
</template>
```

```html
<!-- UserProfile.vue -->
<script setup lang="ts">
const res = await fetch('/api/me') // top-level await → async setup
const user = await res.json()
</script>

<template>
  <p>{{ user.name }}</p>
</template>
```

Suspense lets a **parent** own the loading UI for a whole async subtree, instead of every child
managing its own `loading` flag. It also pairs with router-level async components.

# Key Terminology

- **`<Teleport>`** — renders children at a different DOM location via a `to` selector.
- **Stacking/overflow context** — ancestor CSS that can clip or mis-layer descendants.
- **`<Suspense>`** — coordinates async dependencies and shows a fallback until they resolve.
- **Async `setup`** — a `<script setup>` with a top-level `await`, making the component async.

# Options and Trade-offs

| Tool | Solves | Use when | Watch out for |
| ---- | ------ | -------- | ------------- |
| `<Teleport>` | Escaping overflow/z-index | Modals, tooltips, toasts | Target element must exist in the DOM |
| `disabled` on Teleport | Conditional teleport | Inline on some breakpoints | Toggling moves the DOM node |
| `<Suspense>` | Coordinated async loading | Async setup / async components | Experimental API; wrap carefully |
| Per-component `loading` ref | Local loading UI | Simple, isolated fetches | More repetition across children |

# Worked Example

A tooltip that teleports to `<body>` so it's never clipped by a scrolling container:

```html
<script setup lang="ts">
import { ref } from 'vue'
const show = ref(false)
const x = ref(0)
const y = ref(0)

function onEnter(e: MouseEvent) {
  x.value = e.clientX
  y.value = e.clientY
  show.value = true
}
</script>

<template>
  <span @mouseenter="onEnter" @mouseleave="show = false">Hover me</span>

  <Teleport to="body">
    <div
      v-if="show"
      class="tooltip"
      :style="{ position: 'fixed', left: x + 'px', top: y + 'px' }"
    >
      Tooltip text
    </div>
  </Teleport>
</template>
```

The trigger stays inline in your component, but the tooltip renders at the document body, so it
floats above everything regardless of ancestor `overflow`.

# Real World Analogy

`<Teleport>` is like **mailing a package to a different address while keeping it under your
account**: the contents still belong to you (your component's state and events), but they're
physically delivered somewhere more convenient (the body). `<Suspense>` is a **restaurant pager**:
you're told "your table (content) isn't ready — here's a buzzer (fallback)," and when everything's
prepared, it lights up and seats you.

# Examples

## Example 1 — Basic: teleport a modal to body

```html
<Teleport to="body">
  <div v-if="open" class="modal">…</div>
</Teleport>
```

**Why this works:** The modal renders at `<body>`, escaping any ancestor `overflow: hidden` or
low `z-index`.

## Example 2 — Real-world: Suspense with a fallback

```html
<Suspense>
  <template #default><Dashboard /></template>
  <template #fallback><Spinner /></template>
</Suspense>
```

**Why this works:** `Dashboard` (async setup) shows `Spinner` until its data resolves — one place
owns the loading UI.

## Example 3 — Trade-off / pitfall: teleport target not in the DOM

```html
<Teleport to="#modal-root"> … </Teleport>
<!-- but there's no element with id="modal-root" -->
```

**Why this bites:** The `to` target must exist when the Teleport mounts, or the content has nowhere
to go (you'll get a warning). Teleport to `body`, or ensure the target element is present.

# Common Mistakes

- **Teleporting to a target that doesn't exist** in the DOM.
- **Reaching for Suspense** for simple isolated fetches where a local `loading` ref is clearer.
- **Forgetting Suspense is experimental** and depending on its exact API long-term.
- **Assuming Teleport changes the logical parent** — it only moves the DOM; state/events stay.

# Best Practices

- Teleport modals, tooltips, and toasts to `<body>` to avoid clipping/z-index issues.
- Keep the trigger and its teleported content in the **same component** for cohesive logic.
- Use Suspense to centralize loading UI for an **async subtree**; otherwise a local flag is fine.
- Treat Suspense as experimental — isolate it so a future API change is easy to adjust.

# Summary

- **`<Teleport to="…">`** renders children elsewhere in the DOM (e.g. `body`) while keeping them
  logically in your component — ideal for modals and tooltips.
- The teleport target must exist; a `disabled` prop can toggle teleporting.
- **`<Suspense>`** (experimental) shows a `#fallback` until async descendants (async `setup` or
  async components) resolve, then renders `#default`.

# Flash Cards

Q: What does <Teleport> do?
A: It renders its children at a different location in the DOM (given by the to selector) while keeping them logically part of your component, so state and events still work.

Q: Why teleport a modal to <body>?
A: To escape any ancestor's overflow: hidden or stacking context (z-index), which would otherwise clip or mis-layer the modal.

Q: What does <Suspense> coordinate?
A: Async dependencies in its subtree — components with an async setup (top-level await) or async components — showing a #fallback until they resolve.

Q: What's an important caveat about Suspense?
A: It is experimental; its API may change, so use it deliberately and isolate it.

Q: Does Teleport change a component's logical parent?
A: No — it only moves where the content is rendered in the DOM. Props, events, and reactivity behave as if it were still in place.

# Exercises

### Easy
Build a modal whose markup is wrapped in `<Teleport to="body">` and toggled by a button. Confirm
it isn't clipped when placed inside an `overflow: hidden` container.

### Medium
Add a `disabled` prop bound to a `isMobile` ref so the modal renders inline on small screens and
teleports on large ones.

### Challenging
Create an async `UserCard.vue` (top-level `await` fetch) and wrap it in `<Suspense>` with a skeleton
`#fallback`. Then combine with Vue Router so navigating to the route shows the fallback until data
loads.

# Further Reading

- [Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Suspense (experimental)](https://vuejs.org/guide/built-ins/suspense.html)
