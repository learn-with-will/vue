---
slug: computed-caching
title: "Computed Caching vs Methods"
topic: reactivity
kind: concept
summary: "Computed properties cache their result based on reactive dependencies, unlike methods which run on every render."
tags: [computed, caching, performance, methods]
related: [computed-basics, writable-computed, v-for-lists]
---
> **In one line:** Computed properties cache their result and only re-evaluate when reactive dependencies change.

## The idea

You can often achieve the same visual result in a template by calling a regular method instead of a computed property. However, their execution models are radically different.

A **method call** executes *every single time* a component re-renders, regardless of whether the underlying data changed. If your method filters a list of 5,000 items, calling it on every minor UI re-render destroys performance.

In contrast, a **computed property is cached based on its reactive dependencies**. A computed property will only re-evaluate when at least one of its tracked reactive dependencies changes. If the component re-renders because an unrelated timer ticked, reading the computed property returns the cached result instantly.

| Feature | Computed Property | Method Call |
|---|---|---|
| Caching | Yes (cached by dependency) | No (runs on every render) |
| Arguments | No arguments allowed | Accepts parameters |
| Intended use | Derived state / transformations | Actions, event handlers |

If a calculation depends on reactive state and does not require arguments, always prefer a computed property.

## See it

```html
<script setup lang="ts">
import { ref, computed } from 'vue';

const list = ref(['Apple', 'Banana', 'Orange', 'Avocado']);
const query = ref('A');
const unrelatedCounter = ref(0);

// Cached: only re-runs when list or query changes
const filteredList = computed(() => {
  console.log('Calculating filtered list...');
  return list.value.filter(item => item.startsWith(query.value));
});
</script>

<template>
  <input v-model="query" />
  <ul>
    <li v-for="item in filteredList" :key="item">{{ item }}</li>
  </ul>

  <!-- Clicking this re-renders the component, but filteredList is NOT re-calculated! -->
  <button @click="unrelatedCounter++">Counter: {{ unrelatedCounter }}</button>
</template>
```

Clicking the button re-renders the template, but the console log does not fire because `list` and `query` did not change.

## Go deeper

If a computed property depends on non-reactive values (such as `Date.now()`), it will not update when time advances because non-reactive variables cannot be tracked by Vue's reactivity system.

> **Tip:** Use methods when you need to pass parameters to the calculation (e.g. formatting a specific item inside a `v-for` loop).

## Watch out

- Do not rely on computed properties to update when reading non-reactive globals like Date.now() or window.innerWidth.
- Avoid calling expensive methods directly in template mustaches if they can be cached with computed.

## Remember

- Computed properties cache results based on their tracked reactive dependencies.
- Methods re-execute on every render pass, making them unsuited for expensive derived state.
- Use computed for derived state and methods for parameterized logic or event actions.
