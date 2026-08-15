---
id: lesson-01
slug: introduction-to-vue
title: "Introduction to Vue"
level: beginner
order: 1
duration: 16
summary: "What Vue is, the progressive-framework idea, the difference between the Options and Composition APIs, and what a single-file component looks like."
tags:
  - fundamentals
  - progressive-framework
  - composition-api
  - single-file-component
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what Vue is and what problem a UI framework solves.
- Describe what "progressive framework" means and the different ways to use Vue.
- Tell the **Options API** and the **Composition API** apart, and say which this course uses.
- Recognize the three blocks of a **single-file component (SFC)**.
- Write your first tiny reactive Vue app.

# Why It Matters

Building user interfaces by hand — finding elements, reading their values, and writing
changes back to the page every time your data changes — gets tangled fast. You end up with
code that says *how* to update the DOM step by step, and it drifts out of sync with your
data.

Vue flips this around. You **declare** what the page should look like for a given state,
and Vue keeps the real page in sync automatically when that state changes. That idea —
**declarative, reactive rendering** — is the heart of Vue and the reason it exists.

# Concept Explanation

### What Vue is

**Vue** (pronounced like "view") is an open-source JavaScript **framework** for building
user interfaces. A *framework* is a structured toolkit that gives you a standard way to
build apps so you write less glue code. Vue was created by Evan You, and this course
targets **Vue 3**, the current major version.

Two ideas define Vue:

- **Declarative rendering**: you describe the UI as a function of your data, using an
  HTML-based template. When the data changes, Vue updates the DOM for you.
- **Reactivity**: Vue automatically tracks which data a piece of UI depends on, and
  re-renders just that part when the data changes.

### A progressive framework

Vue is described as a **progressive framework**, meaning you can adopt as much or as little
as you need:

- Drop it into a single page with a `<script>` tag to make one widget interactive.
- Use it with a build tool (Vite) to build a full **single-page application (SPA)**.
- Use it with a meta-framework (Nuxt) for server-side rendering.

You start small and grow into the parts you need — you don't have to rewrite your whole app
to use Vue.

### The two APIs

Vue 3 offers two styles for writing component logic:

- The **Options API** organizes a component into option objects: `data`, `methods`,
  `computed`, and so on.
- The **Composition API** organizes logic with imported functions like `ref` and
  `computed`, usually inside `<script setup>`.

Both are fully supported and neither is deprecated. The Composition API is the recommended
default for new projects and scales better as components grow, so **this course uses the
Composition API with `<script setup>`** throughout.

### The single-file component

Most Vue apps are written as **single-file components** — `.vue` files that keep a
component's template, logic, and styles together in three blocks:

```html
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">Clicked {{ count }} times</button>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
```

`<template>` is the HTML, `<script setup>` is the logic, and `<style>` is the CSS. SFCs need
a build step (Vite compiles them), which you get for free when you scaffold a project.

# Key Terminology

- **Framework** — a structured toolkit that provides a standard way to build applications.
- **Declarative rendering** — describing *what* the UI should be for a given state, rather
  than *how* to change the DOM step by step.
- **Reactivity** — the system that tracks data usage and updates the UI when data changes.
- **Component** — a reusable, self-contained piece of UI (template + logic + style).
- **Single-file component (SFC)** — a `.vue` file holding `<template>`, `<script>`, and
  `<style>`.
- **Options API / Composition API** — the two supported styles for writing component logic.

# Options and Trade-offs

| Option | What it is | Use when | Watch out for |
| ------ | ---------- | -------- | ------------- |
| Composition API (`<script setup>`) | Logic built from imported functions (`ref`, `computed`) | New projects; large components; sharing logic via composables | It's a small mental shift if you know the Options API |
| Options API | Logic grouped into `data`/`methods`/`computed` options | Small components; teams already using it; gentle for absolute beginners | Reusing logic across components is harder |
| Use via CDN `<script>` | No build step; enhance an existing page | Adding interactivity to a server-rendered page | No `.vue` SFCs or scoped styles |
| Use via build tool (Vite) | Full SFC project | Building a real app or SPA | Requires Node.js and a build step |

# Worked Example

Let's make the smallest possible reactive app — a counter — with no build tools, straight
from a CDN. Save this as an `.html` file and open it in a browser:

```html
<div id="app">
  <button @click="count++">Count is: {{ count }}</button>
</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const count = ref(0)
      return { count }
    },
  }).mount('#app')
</script>
```

Click the button and the label updates. You never wrote code to find the button or change
its text — you declared `{{ count }}` in the template and Vue re-rendered when `count`
changed. That is declarative, reactive rendering in one screen of code.

# Real World Analogy

Think of a **spreadsheet**. You type `=A1+A2` into a cell, and whenever `A1` or `A2`
changes, the total recalculates itself — you never re-run the formula by hand. Vue's
reactivity works the same way: your template is the formula, your reactive data is the
input cells, and Vue recalculates the screen whenever the inputs change.

# Examples

## Example 1 — Basic: text interpolation

```html
<script setup lang="ts">
const name = 'Ada'
</script>

<template>
  <p>Hello, {{ name }}!</p>
</template>
```

**Why this works:** `{{ name }}` is a *text interpolation* — Vue inserts the value of the
JavaScript expression `name` into the page as text.

## Example 2 — Real-world: a reactive component

```html
<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
</script>

<template>
  <input v-model="message" placeholder="Type something" />
  <p>You typed: {{ message }}</p>
</template>
```

**Why this works:** `message` is *reactive* state created with `ref`. `v-model` ties the
input to it, and the `<p>` re-renders on every keystroke — no manual DOM updates.

## Example 3 — Trade-off / pitfall: Vue is not jQuery

```javascript
// Anti-pattern: reaching into the DOM by hand, fighting Vue
document.querySelector('#total').textContent = String(a + b)
```

**Why this bites:** In Vue you almost never touch the DOM directly. If you find yourself
querying and mutating elements manually, you're working against the framework — declare the
value in the template and let reactivity update it instead.

# Common Mistakes

- **Thinking you must choose "Vue vs plain JavaScript" for the whole app.** Vue is
  progressive — you can start with one widget.
- **Confusing the two APIs.** A tutorial using `data() { return {...} }` is the Options API;
  one using `ref()` in `<script setup>` is the Composition API. Know which you're reading.
- **Expecting SFCs to work without a build step.** `.vue` files must be compiled (by Vite);
  the CDN build runs plain JavaScript objects instead.
- **Manipulating the DOM directly** out of habit, instead of changing reactive state.

# Best Practices

- For new projects, start with the **Composition API and `<script setup>`** — it's the
  modern default and what most current docs and libraries assume.
- Scaffold real apps with the official tool: `npm create vue@latest`.
- Keep components small and focused; compose bigger UIs out of smaller components.
- Let reactive state drive the UI; avoid manual DOM manipulation.

# Summary

- Vue is a JavaScript framework for building UIs with **declarative, reactive rendering**.
- It's a **progressive framework**: use it from a CDN for one widget, or with Vite for a
  full app.
- Vue 3 has two supported styles — the **Options API** and the **Composition API**. This
  course uses the **Composition API with `<script setup>`**.
- A **single-file component** bundles `<template>`, `<script setup>`, and `<style>` in one
  `.vue` file.
- You describe the UI; Vue keeps the DOM in sync when your data changes.

# Flash Cards

Q: What does "progressive framework" mean for Vue?
A: You can adopt Vue incrementally — from a single `<script>` tag on one page up to a full build-tool SPA — without rewriting everything.

Q: What are the two APIs Vue 3 supports, and which does this course use?
A: The Options API and the Composition API. This course uses the Composition API with `<script setup>`. Both are fully supported.

Q: What are the three blocks of a single-file component?
A: `<template>` (HTML), `<script>` / `<script setup>` (logic), and `<style>` (CSS).

Q: In one sentence, what is reactivity?
A: Vue automatically tracks which data the UI depends on and re-renders that part when the data changes.

Q: Do single-file components (`.vue` files) run directly in the browser?
A: No — they must be compiled by a build tool like Vite. The CDN build uses plain JavaScript component objects instead.

Q: What is declarative rendering?
A: Describing what the UI should look like for a given state, and letting Vue update the DOM, instead of writing manual step-by-step DOM changes.

# Exercises

### Easy
Create a CDN-based page (like the Worked Example) that shows a `{{ message }}` and a button
that appends `"!"` to `message` each click.

### Medium
Rewrite the counter as a single-file component using `<script setup>` and a `ref`. Add a
second button that resets the count to `0`.

### Challenging
Take a small piece of an existing plain-HTML page (say, a like button that shows a count)
and make just that widget interactive with Vue from a CDN — without converting the rest of
the page. This is the "progressive" idea in practice.

# Further Reading

- [Introduction — Vue.js Guide](https://vuejs.org/guide/introduction.html)
- [Quick Start](https://vuejs.org/guide/quick-start.html)
- [Ways of Using Vue](https://vuejs.org/guide/extras/ways-of-using-vue.html)
- [Single-File Components](https://vuejs.org/guide/scaling-up/sfc.html)
