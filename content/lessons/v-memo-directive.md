---
slug: v-memo-directive
title: "Subtree Memoization with v-memo"
topic: tooling-typescript
kind: technique
summary: "v-memo conditionally skips virtual DOM updates for subtrees unless specified dependencies change."
tags: [v-memo, memoization, performance, v-for]
related: [v-once-directive, v-for-lists, how-reactivity-works]
since: "3.2"
---
> **In one line:** v-memo="[deps]" memoizes a template subtree, skipping re-renders unless dependencies change.

## The idea

While `v-once` skips updates permanently, what if you have a heavy template subtree (such as a list of 1,000 items) and want to skip re-rendering each item **unless specific properties of that item changed**?

Vue provides the **`v-memo`** directive for conditional subtree memoization.

`v-memo` takes an array of dependency values: `v-memo="[item.id, selected === item.id]"`.

When the component re-renders:
- If every value in the dependency array is strictly equal (`===`) to its previous value, Vue skips diffing and updating the entire subtree!
- If any value changed, Vue re-renders the subtree and caches the new result.

```tree
v-memo in Large Lists
  Item 42: selected === false (unchanged) --> RE-RENDER SKIPPED @green
  Item 43: selected changed to true       --> RE-RENDER EXECUTED @blue
```

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, text: `Item ${i}` })));
const selectedId = ref<number | null>(null);
</script>

<template>
  <ul class="large-list">
    <!-- v-memo only re-renders the 2 items whose selection state changed! -->
    <li
      v-for="item in items"
      :key="item.id"
      v-memo="[item.id, selectedId === item.id]"
      :class="{ active: selectedId === item.id }"
      @click="selectedId = item.id"
    >
      {{ item.text }} ({{ selectedId === item.id ? 'Selected' : 'Idle' }})
    </li>
  </ul>
</template>
```

Clicking an item only updates the previously selected row and newly selected row; 998 rows skip reconciliation completely.

## Go deeper

`v-memo="[]"` with an empty array is functionally identical to `v-once`.

> **Tip:** `v-memo` is a targeted performance optimization for massive lists (`> 1,000 items`); do not prematurely sprinkle it on standard small lists.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- v-memo dependencies must include all variables used inside the subtree that should trigger updates.
- v-memo with v-for requires a unique :key on the same element.

## Remember

- v-memo="[deps]" memoizes a template subtree based on dependency equality.
- Skips virtual DOM diffing when dependencies remain strictly identical (===).
- Provides massive performance gains for large interactive lists (>1000 items).
