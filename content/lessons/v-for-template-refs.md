---
slug: v-for-template-refs
title: "Template Refs inside v-for"
topic: advanced-reactivity
kind: technique
summary: "Collect arrays of DOM nodes or components when using template refs inside v-for loops."
tags: [template-refs, v-for, arrays, dom]
related: [template-refs-dom, v-for-lists, component-refs]
---
> **In one line:** In Vue 3, placing ref on a v-for element populates a ref containing an array of elements.

## The idea

When rendering lists with `v-for`, you sometimes need direct DOM access to every rendered item: measuring the height of list rows, or managing focus across a list of inputs using arrow keys.

In Vue 3, placing a `ref` attribute on an element inside a `v-for` loop automatically populates the template ref with an **array of matching DOM elements**.

```tree
v-for Template Ref Resolution
  v-for item in items with ref itemRefs
    itemRefs.value contains array of DOM elements
```

The array contains the real DOM nodes in the order they were rendered. When items are added or removed from the list, Vue updates the elements in the array accordingly.

## See it

```html
<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue';

const tags = ref(['TypeScript', 'Vue 3', 'Vite', 'Pinia']);

// Array of HTML list elements
const tagElements = useTemplateRef<HTMLLIElement[]>('tagElements');

onMounted(() => {
  if (tagElements.value) {
    console.log('Total list items rendered:', tagElements.value.length);
    // Focus or measure the first item:
    tagElements.value[0]?.scrollIntoView();
  }
});
</script>

<template>
  <ul class="tag-list">
    <li v-for="tag in tags" :key="tag" ref="tagElements">
      {{ tag }}
    </li>
  </ul>
</template>
```

`tagElements.value` contains an array of the four rendered `<li>` DOM elements.

## Go deeper

Alternatively, you can bind `:ref` to a custom function: `:ref="(el) => { if (el) list.push(el) }"`. Function refs give you complete control over how DOM references are collected and keyed.

> **Tip:** Do not assume the ref array elements will be strictly in source order if list items can be re-sorted dynamically; key by IDs using a Map if order is critical.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- The ref array does not guarantee stable order when list items are filtered or sorted dynamically.
- Remember that the ref array is reset and repopulated on every list re-render.

## Remember

- Placing ref on a v-for element populates an array of elements.
- Supports useTemplateRef<Element[]> in Vue 3.5+.
- Function refs (:ref="fn") provide custom collection and cleanup logic.
