---
id: lesson-20
slug: transitions-and-animations
title: "Transitions & Animations"
level: advanced
order: 20
duration: 17
summary: "Animate elements entering and leaving with the <Transition> component and its six CSS classes, then animate lists — including reordering — with <TransitionGroup>."
tags:
  - transition
  - transitiongroup
  - animation
  - css
---

# Learning Objectives

By the end of this lesson you will be able to:

- Animate a single element on enter/leave with `<Transition>`.
- Use the six transition CSS classes and named transitions.
- Animate lists (add, remove, reorder) with `<TransitionGroup>`.
- Use JavaScript hooks and transition modes when needed.

# Why It Matters

Motion, done well, makes an interface feel responsive and guides attention — a menu that slides
in, a toast that fades out, a list that smoothly reorders. Vue's built-in `<Transition>` and
`<TransitionGroup>` handle the tricky timing (applying and removing classes at the right moments,
waiting for animations to finish) so you can focus on the CSS.

# Concept Explanation

### The `<Transition>` component

`<Transition>` animates a **single** element or component as it enters or leaves. It triggers on
`v-if`, `v-show`, a dynamic `<component :is>`, or a changing `key`:

```html
<template>
  <button @click="show = !show">Toggle</button>
  <Transition>
    <p v-if="show">Hello</p>
  </Transition>
</template>
```

### The six classes

During enter and leave, Vue applies and removes CSS classes at the right moments. With no `name`,
they're prefixed `v-`:

```text
enter:  v-enter-from → v-enter-active → v-enter-to
leave:  v-leave-from → v-leave-active → v-leave-to
```

- `*-from` — the starting state (applied before the frame, removed after it starts).
- `*-active` — active during the whole transition (put your `transition`/`animation` here).
- `*-to` — the ending state.

A simple fade:

```html
<style>
.v-enter-active, .v-leave-active { transition: opacity 0.3s ease; }
.v-enter-from, .v-leave-to { opacity: 0; }
</style>
```

### Named transitions

Give a `name` to namespace the classes (and reuse different transitions):

```html
<Transition name="fade"> … </Transition>
```

```css
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
```

### Transition modes

When one element leaves as another enters (e.g. swapping views), overlap looks messy. Use
`mode="out-in"` to fully animate the old one out before the new one in:

```html
<Transition name="fade" mode="out-in">
  <component :is="currentView" />
</Transition>
```

Add the `appear` prop to also animate the initial render.

### JavaScript hooks

For complex or library-driven animation (e.g. GSAP), use JS hooks instead of CSS classes:

```html
<Transition @enter="onEnter" @leave="onLeave" :css="false">…</Transition>
```

Hooks include `@before-enter`, `@enter` (with a `done` callback), `@after-enter`, and the `leave`
equivalents. Set `:css="false"` to tell Vue you're handling everything in JS.

### `<TransitionGroup>` for lists

`<TransitionGroup>` animates items in a `v-for` list as they're added, removed, and **reordered**.
Each child needs a `key`. Reordering uses a special `*-move` class and the FLIP technique:

```html
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item.id">{{ item.text }}</li>
</TransitionGroup>
```

```css
.list-enter-active, .list-leave-active, .list-move { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(8px); }
```

# Key Terminology

- **`<Transition>`** — animates a single element/component on enter/leave.
- **Enter/leave classes** — the six `*-from`/`*-active`/`*-to` classes Vue toggles.
- **`mode="out-in"`** — leave the old element fully before entering the new one.
- **`<TransitionGroup>`** — animates list additions, removals, and moves (via a `*-move` class).

# Options and Trade-offs

| Tool | Animates | Use when | Watch out for |
| ---- | -------- | -------- | ------------- |
| `<Transition>` | One element/component | Toggles, view swaps | One child at a time |
| `mode="out-in"` | Sequential swap | Replacing content | Slightly longer total time |
| JS hooks (`:css="false"`) | Anything, via JS | Physics/timeline libraries | You own timing + `done` |
| `<TransitionGroup>` | Lists | Reorderable/filterable lists | Every child needs a stable `key` |

# Worked Example

A filterable list that fades and slides items as they appear, disappear, and reorder:

```html
<script setup lang="ts">
import { ref, computed } from 'vue'
const q = ref('')
const all = ref([
  { id: 1, text: 'Ada' }, { id: 2, text: 'Alan' }, { id: 3, text: 'Grace' },
])
const shown = computed(() =>
  all.value.filter((i) => i.text.toLowerCase().includes(q.value.toLowerCase())),
)
</script>

<template>
  <input v-model="q" placeholder="Filter…" />
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in shown" :key="item.id">{{ item.text }}</li>
  </TransitionGroup>
</template>

<style>
.list-enter-active, .list-leave-active, .list-move { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(12px); }
.list-leave-active { position: absolute; } /* let others move up smoothly */
</style>
```

Type in the box: matching items animate in/out and the remaining ones glide to their new
positions, thanks to the `*-move` class.

# Real World Analogy

`<Transition>` is a **stage crew** that dims the lights (enter-from), runs the scene change
(active), and brings the lights up (enter-to) — always in the right order, waiting for each step
to finish. `<TransitionGroup>` is the crew choreographing a **whole chorus line**: people entering,
exiting, and sliding to new spots without bumping into each other.

# Examples

## Example 1 — Basic: a fade toggle

```html
<Transition name="fade"><p v-if="show">Hi</p></Transition>
```

**Why this works:** Toggling `show` triggers the enter/leave classes; the CSS `.fade-*` rules
define the fade.

## Example 2 — Real-world: animated view swap

```html
<Transition name="slide" mode="out-in">
  <component :is="tabComponent" :key="tab" />
</Transition>
```

**Why this works:** `mode="out-in"` animates the old tab out before the new one in, avoiding an
ugly overlap; the changing `key` triggers the transition.

## Example 3 — Trade-off / pitfall: TransitionGroup without stable keys

```html
<TransitionGroup>
  <li v-for="(item, i) in items" :key="i">…</li>  <!-- ❌ index keys -->
</TransitionGroup>
```

**Why this bites:** Move/enter/leave animations rely on **stable identity**. Index keys change on
reorder, so Vue can't tell which item moved — animations break. Use a stable `id`.

# Common Mistakes

- **Putting the `transition` CSS on the wrong class** — it belongs on `*-active`.
- **Wrapping multiple elements in `<Transition>`** — it animates one child (use `TransitionGroup`).
- **Index keys in `<TransitionGroup>`** — breaks move animations; use stable ids.
- **Forgetting `mode="out-in"`** when swapping, causing overlap.

# Best Practices

- Put timing on `*-active`; put start/end states on `*-from`/`*-to`.
- Name transitions to reuse and to keep CSS organized.
- Use `<TransitionGroup>` with **stable keys** for lists; add a `*-move` rule for smooth reordering.
- Respect `prefers-reduced-motion` in your CSS so animations don't fight accessibility settings.

# Summary

- **`<Transition>`** animates a single element/component on enter/leave using six CSS classes
  (`*-from`, `*-active`, `*-to`).
- **Named** transitions namespace the classes; **`mode="out-in"`** sequences swaps; **`appear`**
  animates the initial render.
- **JS hooks** (with `:css="false"`) drive animation from JavaScript.
- **`<TransitionGroup>`** animates list add/remove/reorder — each child needs a **stable key**, and
  a `*-move` class handles reordering.

# Flash Cards

Q: What does <Transition> animate, and what triggers it?
A: A single element or component, on enter and leave — triggered by v-if, v-show, a dynamic <component>, or a changing key.

Q: Which of the six transition classes should carry the CSS transition/animation timing?
A: The *-active classes (v-enter-active / v-leave-active); *-from and *-to hold the start and end states.

Q: What does mode="out-in" do?
A: It makes the leaving element finish animating out before the entering element animates in, avoiding overlap when swapping content.

Q: When do you use <TransitionGroup> instead of <Transition>?
A: For animating a list of elements (a v-for) as items are added, removed, or reordered; each child needs a stable key.

Q: Why must TransitionGroup children have stable keys?
A: Move/enter/leave animations depend on stable item identity. Index keys change on reorder, so Vue can't track which item moved and animations break.

# Exercises

### Easy
Wrap a `v-if` element in `<Transition name="fade">` and write CSS so it fades in and out.

### Medium
Create a tab switcher that swaps a dynamic `<component>` with `mode="out-in"` and a slide
transition triggered by a changing `key`.

### Challenging
Build a sortable to-do list with `<TransitionGroup>` where completing an item moves it to the
bottom. Animate enter, leave, and the reordering move, using stable ids and a `*-move` rule.
Add a `prefers-reduced-motion` media query that disables the motion.

# Further Reading

- [Transition](https://vuejs.org/guide/built-ins/transition.html)
- [TransitionGroup](https://vuejs.org/guide/built-ins/transition-group.html)
