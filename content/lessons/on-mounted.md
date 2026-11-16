---
slug: on-mounted
title: "Performing Side Effects with onMounted"
topic: lifecycle-watchers
kind: api
summary: "onMounted runs code after the component has finished initial rendering and created its DOM nodes."
tags: [onmounted, dom, side-effects, async]
related: [lifecycle-hooks, on-unmounted, template-refs-dom]
---
> **In one line:** onMounted() runs after the component has rendered and its DOM nodes are accessible.

## The idea

When code in `<script setup>` runs, the component has not yet been rendered to the screen. If you attempt to access DOM elements or measure element dimensions at the top level of `<script setup>`, they will be `null` or undefined.

**`onMounted()`** registers a callback that executes immediately after the component has finished its initial render and inserted its real DOM nodes into the document.

```tree
Component Initialization Order
  1. <script setup> executes
    [Setup state] Refs and computed created, DOM does not exist yet @blue
  2. Vue renders template
    [DOM mounted] Real HTML elements created @blue
  3. onMounted callback fires
    [Safe access] DOM measurements, focus, third-party canvas charts @green
```

This makes `onMounted` the canonical location for:
- Accessing or focusing native DOM elements.
- Initializing third-party non-Vue libraries (like D3, Chart.js, or Leaflet maps).
- Triggering initial HTTP data fetches for the component.

## See it

```html
<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue';

const searchInput = useTemplateRef<HTMLInputElement>('searchInput');
const data = ref<string[]>([]);

onMounted(async () => {
  searchInput.value?.focus();
  const res = await fetch('/api/items');
  data.value = await res.json();
});
</script>

<template>
  <div>
    <input ref="searchInput" placeholder="Search..." />
    <ul>
      <li v-for="item in data" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
```

The search input receives focus as soon as the component renders, and initial data loading begins.

## Go deeper

`onMounted` does not guarantee that all child components inside the tree have also finished rendering. If you need to wait until the entire view is fully painted, wrap your code in `nextTick()`.

> **Tip:** Keep `onMounted` callbacks lean; extract complex setup tasks into separate helper functions or composables.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not access DOM template refs outside of onMounted or event handlers, as they will be null.
- Remember that onMounted only fires once during a component lifetime.

## Remember

- onMounted executes after initial DOM nodes have been created and inserted.
- It is the primary hook for DOM queries, focus, charts, and initial data fetches.
- Template refs are guaranteed to be populated inside onMounted.
