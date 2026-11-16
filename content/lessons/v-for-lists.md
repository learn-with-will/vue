---
slug: v-for-lists
title: "List Rendering with v-for"
topic: template-directives
kind: technique
summary: "v-for renders a list of elements by iterating over arrays, objects, or number ranges."
tags: [v-for, lists, iteration, templates]
related: [v-for-key, avoid-v-if-with-v-for, directives-overview]
---
> **In one line:** v-for iterates over arrays, objects, or number ranges using the item in items syntax.

## The idea

To render an array of items into repeated DOM elements, Vue provides the **`v-for`** directive. Its syntax requires the special expression `item in items`, where `items` is the source array and `item` is an alias for the element currently being iterated.

`v-for` also supports an optional second parameter to access the zero-based index of the current item: `(item, index) in items`.

```tree
v-for Iteration
  Source array: ['Ada', 'Grace', 'Linus']
    Ada at index 0
    Grace at index 1
    Linus at index 2
```

Beyond arrays, `v-for` can also iterate over the properties of a JavaScript object (`(value, key, index) in object`) or generate a sequence of numbers from a range (`n in 10`).

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

interface CourseBite {
  id: string;
  title: string;
  duration: number;
}

const bites = ref<CourseBite[]>([
  { id: 'b1', title: 'What is Vue?', duration: 3 },
  { id: 'b2', title: 'Reactivity Fundamentals', duration: 4 },
  { id: 'b3', title: 'Computed Properties', duration: 3 }
]);
</script>

<template>
  <ul class="bite-list">
    <li v-for="(bite, index) in bites" :key="bite.id">
      {{ index + 1 }}. {{ bite.title }} ({{ bite.duration }} min)
    </li>
  </ul>
</template>
```

The template iterates over `bites`, rendering an `<li>` tag for each element in the array with its index.

## Go deeper

Just like `v-if`, you can use `v-for` on a `<template>` tag to render a block of multiple repeated elements without generating extra wrapper nodes in the DOM.

> **Tip:** You can use `of` instead of `in` as the delimiter (e.g. `item of items`), matching JavaScript iterator syntax.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Always provide a unique key attribute on every v-for item (covered in the next lesson).
- When iterating objects, property order is not guaranteed across all JavaScript engines.

## Remember

- v-for iterates over arrays using the item in items syntax.
- Accepts an optional second parameter for the item index: (item, index).
- Can also iterate over object properties or a numeric range (n in 5).
