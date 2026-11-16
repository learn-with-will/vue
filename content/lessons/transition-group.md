---
slug: transition-group
title: "List Animations with <TransitionGroup>"
topic: advanced-reactivity
kind: api
summary: "Animate list additions, removals, and smooth position reordering using TransitionGroup."
tags: [transitiongroup, lists, animations, v-move]
related: [transition-basics, v-for-key, v-for-lists]
---
> **In one line:** <TransitionGroup> animates elements in a v-for list, including smooth FLIP reordering with v-move.

## The idea

While `<Transition>` only animates a single element, **`<TransitionGroup>`** animates multiple elements rendered inside a `v-for` list.

`<TransitionGroup>` features:
1. It applies enter and leave CSS transitions to items as they are added or deleted from the list.
2. It introduces a special CSS class: **`v-move`**!

`v-move` uses the **FLIP (First, Last, Invert, Play)** animation technique behind the scenes. When items change order (through sorting or filtering), Vue smoothly animates surviving elements to their new physical coordinates instead of jumping abruptly!

```tree
TransitionGroup Capabilities
  Item added   --> v-enter-from / v-enter-active
  Item removed --> v-leave-from / v-leave-active (position: absolute)
  Items sorted --> v-move (smoothly slides items to new coordinates)
```

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';
const items = ref([1, 2, 3, 4, 5]);
const shuffle = () => items.value.reverse();
</script>

<template>
  <button @click="shuffle">Shuffle</button>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </TransitionGroup>
</template>

<style scoped>
.list-move, .list-enter-active, .list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-leave-active { position: absolute; }
</style>
```

Shuffling the list smoothly slides each item to its new vertical position.

## Go deeper

Every item inside `<TransitionGroup>` **must have a unique `key` attribute**; array indices are strictly forbidden as keys.

> **Tip:** To ensure leaving items don't block the smooth movement of remaining items, set `position: absolute` on `.v-leave-active`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Every child of TransitionGroup MUST have a unique key; without keys, animation is impossible.
- TransitionGroup does not support mode="out-in".

## Remember

- <TransitionGroup> animates item insertions, removals, and reordering in lists.
- v-move class smoothly animates position changes using FLIP animations.
- Every child element requires a unique, non-index key attribute.
