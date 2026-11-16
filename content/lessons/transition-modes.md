---
slug: transition-modes
title: "Transition Modes: out-in and in-out"
topic: advanced-reactivity
kind: technique
summary: "Coordinate entering and leaving elements using mode="out-in" to prevent simultaneous layout clashes."
tags: [transition, transition-modes, out-in, ux]
related: [transition-basics, named-transitions, router-link-view]
---
> **In one line:** Use mode="out-in" to wait for the leaving element to finish before mounting the entering element.

## The idea

When transitioning between two mutually exclusive elements (using `v-if` and `v-else`, or switching dynamic components), Vue's default behavior is to animate **both elements simultaneously**:
- The entering element starts animating in.
- The leaving element starts animating out.

Because both elements exist in the DOM at the exact same moment, they push and bump each other visually, breaking layout flow and causing jarring glitches.

To solve this, Vue provides the **`mode` attribute**:

```html
<Transition mode="out-in">
  <button v-if="isEditing" key="save">Save</button>
  <button v-else key="edit">Edit</button>
</Transition>
```

`mode="out-in"` coordinates the sequence: the leaving element transitions **out first**, and only when it has completely finished does the entering element transition **in**.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';
const isEditing = ref(false);
</script>

<template>
  <Transition name="fade" mode="out-in">
    <button v-if="isEditing" key="save" @click="isEditing = false">Save</button>
    <button v-else key="edit" @click="isEditing = true">Edit</button>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

The leaving button fades away completely before the new button appears in its exact position.

## Go deeper

When transitioning between identical HTML elements (like two `<button>` tags), you **must provide a unique `key` attribute** on each element so Vue recognizes them as distinct nodes.

> **Tip:** `mode="out-in"` is the standard choice when animating page transitions inside `<RouterView>`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Forgetting keys on mutually exclusive same-tag elements prevents transitions from firing.
- in-out mode does the reverse (new enters first, old leaves second), which is rarely what you want for layout buttons.

## Remember

- Default transitions animate entering and leaving elements simultaneously.
- mode="out-in" waits for the leaving element to finish before entering the new one.
- Always add distinct key attributes when transitioning between same-tag elements.
