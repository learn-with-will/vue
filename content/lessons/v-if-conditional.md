---
slug: v-if-conditional
title: "Conditional Rendering with v-if"
topic: template-directives
kind: technique
summary: "v-if, v-else-if, and v-else conditionally insert or destroy elements in the DOM."
tags: [v-if, v-else, conditionals, dom-manipulation]
related: [v-show-toggling, v-if-vs-v-show, directives-overview]
---
> **In one line:** v-if conditionally renders a block by adding or destroying real DOM elements.

## The idea

To conditionally render blocks of markup based on reactive state, Vue provides the **`v-if`** directive family: `v-if`, `v-else-if`, and `v-else`.

Unlike CSS-based toggling, `v-if` is **real conditional rendering**: when the expression evaluates to falsy, the element and all of its child components and event listeners are completely unmounted and destroyed from the DOM. When the expression becomes truthy, Vue compiles and mounts the element from scratch.

```flow
cond: isLoggedIn | condition @primary
yes: Dashboard | rendered on true @green
no: Login | rendered on false @amber
cond -> yes: truthy
cond -> no: falsy
```

To link adjacent conditions together, `v-else-if` and `v-else` elements must immediately follow the `v-if` element in the template, with no other elements intervening.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const status = ref<'loading' | 'success' | 'error'>('loading');
</script>

<template>
  <div class="card">
    <p v-if="status === 'loading'">Fetching records...</p>
    <p v-else-if="status === 'success'">Records loaded successfully!</p>
    <p v-else>An unexpected error occurred.</p>

    <button @click="status = 'success'">Mark Complete</button>
  </div>
</template>
```

Depending on the value of `status`, only one matching paragraph exists in the DOM at any given moment.

## Go deeper

If you need to conditionally toggle multiple elements together without wrapping them in an extra DOM `<div>`, you can apply `v-if` to a **`<template>`** tag: `<template v-if="ok">`. Vue strips the `<template>` tag from the final rendered output.

> **Tip:** `v-if` is lazy: if the condition is false on initial page render, the block is never created until the condition turns true.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- An element with v-else or v-else-if must immediately follow the v-if sibling element.
- Child components inside a destroyed v-if block lose their internal state upon unmounting.

## Remember

- v-if conditionally inserts or destroys elements in the real DOM.
- Pair with v-else-if and v-else for multi-branch conditionals.
- Use <template v-if="..."> to group elements without introducing wrapper tags.
