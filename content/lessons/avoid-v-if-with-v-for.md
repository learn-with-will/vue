---
slug: avoid-v-if-with-v-for
title: "Avoiding v-if with v-for"
topic: template-directives
kind: pitfall
summary: "Never place v-if and v-for on the same element; in Vue 3, v-if has higher priority and cannot access loop variables."
tags: [pitfall, v-if, v-for, best-practices]
related: [v-if-conditional, v-for-lists, computed-basics]
---
> **In one line:** Never put v-if and v-for on the same element; filter with computed properties instead.

## The idea

A frequent temptation when building lists is to filter items by placing `v-if` and `v-for` directly on the same HTML tag.

In Vue 3, **`v-if` has a higher priority than `v-for`**. This means the `v-if` condition is evaluated before the `v-for` loop begins. Because the loop variable does not exist yet at that moment, referring to it throws a JavaScript error:

```html
<!-- WRONG: Throws error because "task" is undefined when v-if evaluates -->
<li v-for="task in tasks" v-if="task.isComplete" :key="task.id">
  {{ task.title }}
</li>
```

The idiomatic, high-performance solution is to **filter the list with a computed property** before it reaches the template. If you truly need conditional rendering per item, wrap the list items inside a `<template v-for="...">` with an inner `v-if`.

## See it

```html
<script setup lang="ts">
import { ref, computed } from 'vue';

const tasks = ref([
  { id: 't1', title: 'Buy milk', isComplete: true },
  { id: 't2', title: 'Write code', isComplete: false },
  { id: 't3', title: 'Clean desk', isComplete: true }
]);

// Right: filter the list beforehand using computed
const completedTasks = computed(() => {
  return tasks.value.filter(task => task.isComplete);
});
</script>

<template>
  <ul>
    <!-- Clean, fast, and completely safe -->
    <li v-for="task in completedTasks" :key="task.id">
      {{ task.title }}
    </li>
  </ul>
</template>
```

The computed property filters the items once and caches the result, keeping template logic simple and bug-free.

## Go deeper

If you want to conditionally render the entire list container (e.g. only render the `<ul>` if `tasks.length > 0`), put the `v-if` on the parent `<ul>` or a wrapper element.

> **Tip:** Linters like ESLint and vue-tsc automatically flag `v-if` and `v-for` on the same element as an error.

## Watch out

- In Vue 3, v-if evaluates before v-for; attempting to access the loop variable throws a ReferenceError.
- Filtering large arrays inside templates directly without computed properties hurts render performance.

## Remember

- Never place v-if and v-for on the same DOM element.
- Filter lists with computed properties for cleaner code and optimal caching.
- Place v-if on parent containers when deciding whether to render the whole list.
