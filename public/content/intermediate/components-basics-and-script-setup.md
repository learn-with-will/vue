---
id: lesson-09
slug: components-basics-and-script-setup
title: "Components Basics & <script setup>"
level: intermediate
order: 9
duration: 18
summary: "Build apps from reusable components: define a single-file component, import and use child components, and understand the anatomy of a <script setup> SFC."
tags:
  - components
  - script-setup
  - sfc
  - reusability
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a component is and why apps are built from them.
- Read the three blocks of a `<script setup>` single-file component.
- Import and use a child component inside another.
- Follow Vue's naming conventions for components.

# Why It Matters

A real application isn't one giant template — it's a **tree of components**. Each component
owns a small, focused piece of UI and logic, and you compose them into pages. Components make
your app reusable, testable, and easy to reason about. `<script setup>` is the modern, concise
way to write them.

# Concept Explanation

### What a component is

A **component** is a reusable, self-contained unit of UI: its own template, logic, and
(optionally) styles. You use a component many times, each with different data, and each
instance keeps its own state.

### The anatomy of an SFC with `<script setup>`

A single-file component has up to three blocks:

```html
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">Count: {{ count }}</button>
</template>

<style scoped>
button { font-weight: 600; }
</style>
```

`<script setup>` is a compile-time sugar over the Composition API. Everything you declare in
it — variables, functions, imported components — is **automatically available to the
template**. There's no `return` statement and no `components:` option to fill in.

### Using child components

To use one component inside another, **import it** in `<script setup>` and reference it in the
template. Importing is enough — it's registered locally for you:

```html
<script setup lang="ts">
import BaseButton from './BaseButton.vue'
</script>

<template>
  <BaseButton />
  <BaseButton />
</template>
```

Each `<BaseButton />` is an independent instance with its own state.

### Passing data down with props

Parents pass data to children through **props** — custom attributes on the component tag.
The next lesson covers props in depth; here's the shape:

```html
<template>
  <UserCard :name="'Ada'" :online="true" />
</template>
```

### Naming and structure

- Name components in **PascalCase** (`UserCard`, `BaseButton`) — in SFC templates Vue matches
  `<UserCard>` to the imported `UserCard`.
- A component in Vue 3 may have **multiple root elements** in its template (fragments) — a
  single wrapper is no longer required.
- Keep components small and focused; lift shared UI into base components (`BaseButton`,
  `BaseInput`).

# Key Terminology

- **Component** — a reusable unit of UI with its own template, logic, and style.
- **`<script setup>`** — compile-time sugar for the Composition API in an SFC; its bindings
  are auto-exposed to the template.
- **Child / parent component** — a component used inside another, and the one using it.
- **Instance** — one usage of a component, with its own state.

# Options and Trade-offs

| Option | What it is | Use when | Watch out for |
| ------ | ---------- | -------- | ------------- |
| `<script setup>` | Concise Composition API in an SFC | Almost always in new code | Macros (`defineProps`) are compile-time only |
| Plain `<script>` with `setup()` | Explicit `setup()` returning bindings | You need options like `name` alongside setup | More boilerplate |
| One big component | Everything in one file | Tiny apps / prototypes | Hard to reuse and test as it grows |
| Many small components | Composed tree | Real apps | Slight overhead of more files |

# Worked Example

A parent that renders a reusable child several times:

```html
<!-- StatCard.vue -->
<script setup lang="ts">
defineProps<{ label: string; value: number }>()
</script>

<template>
  <div class="stat">
    <p class="value">{{ value }}</p>
    <p class="label">{{ label }}</p>
  </div>
</template>

<style scoped>
.stat { border: 1px solid #ddd; border-radius: 8px; padding: 12px; }
.value { font-size: 1.5rem; font-weight: 700; }
</style>
```

```html
<!-- Dashboard.vue -->
<script setup lang="ts">
import StatCard from './StatCard.vue'
</script>

<template>
  <div class="grid">
    <StatCard label="Users" :value="1200" />
    <StatCard label="Sales" :value="87" />
    <StatCard label="Errors" :value="3" />
  </div>
</template>
```

`StatCard` is defined once and reused three times with different props. Importing it in
`Dashboard.vue` is all the registration needed.

# Real World Analogy

Components are like **LEGO bricks**. Each brick is simple and self-contained, but you snap
them together into anything. A `StatCard` brick can appear once or a hundred times; the
`Dashboard` is just an arrangement of bricks.

# Examples

## Example 1 — Basic: a self-contained counter

```html
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

**Why this works:** Everything in `<script setup>` is available to the template with no
`return` — Vue's compiler wires it up.

## Example 2 — Real-world: composing a page

```html
<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import ArticleList from './ArticleList.vue'
import AppFooter from './AppFooter.vue'
</script>

<template>
  <AppHeader />
  <ArticleList />
  <AppFooter />
</template>
```

**Why this works:** Importing the children registers them locally; the page is a small,
readable arrangement of components (and needs no single root wrapper in Vue 3).

## Example 3 — Trade-off / pitfall: forgetting to import a child

```html
<template>
  <!-- BaseButton was never imported -->
  <BaseButton />
</template>
```

**Why this bites:** In `<script setup>` a child must be imported to be used. Without the
import, Vue can't resolve `<BaseButton>` and it won't render (you'll see a warning). Import it.

# Common Mistakes

- **Not importing a child component** in `<script setup>` before using it.
- **Trying to mutate a prop** from the child (props are read-only — next lesson).
- **Building one enormous component** instead of composing smaller ones.
- **Inconsistent naming** — use PascalCase for component names and files.

# Best Practices

- Use `<script setup lang="ts">` for new components — it's concise and type-friendly.
- Keep components small and single-purpose; extract reusable UI into `Base*` components.
- Name components in PascalCase and match the file name to the component.
- Compose pages from components rather than writing monolithic templates.

# Summary

- Apps are **trees of components**; each is a reusable unit of template + logic + style.
- `<script setup>` auto-exposes its bindings to the template — no `return`, no `components:`.
- **Import** a child component in `<script setup>` to use it; each use is an independent
  instance.
- Vue 3 allows multiple root elements; name components in **PascalCase**.

# Flash Cards

Q: In a <script setup> SFC, how do you make a child component available to the template?
A: Import it in <script setup> — that registers it locally, so you can use its tag directly with no components: option.

Q: What does <script setup> expose to the template automatically?
A: Every top-level binding you declare — refs, functions, computed values, and imported components — with no return statement.

Q: Does a Vue 3 component template need a single root element?
A: No — Vue 3 supports multiple root nodes (fragments), so a wrapping element is optional.

Q: What casing should you use for component names?
A: PascalCase (e.g. UserCard, BaseButton), matching the imported name and, by convention, the file name.

Q: If you use <BaseButton /> but nothing renders and you get a warning, what's a likely cause?
A: You forgot to import BaseButton in <script setup>; without the import Vue can't resolve the tag.

# Exercises

### Easy
Create a `Greeting.vue` component that shows a fixed message, then import and use it twice in
a parent component.

### Medium
Build a `TagPill.vue` that takes a `label` prop and renders a styled pill. Render a list of
tags by using `TagPill` inside a `v-for` in the parent.

### Challenging
Refactor a single large "profile page" template into at least three components
(`ProfileHeader`, `ProfileStats`, `ProfileBio`) composed by a parent `ProfilePage`. Keep each
child focused and pass the data it needs via props.

# Further Reading

- [Components Basics](https://vuejs.org/guide/essentials/component-basics.html)
- [`<script setup>`](https://vuejs.org/api/sfc-script-setup.html)
- [Single-File Components](https://vuejs.org/guide/scaling-up/sfc.html)
