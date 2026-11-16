---
slug: on-unmounted
title: "Cleaning Up with onUnmounted"
topic: lifecycle-watchers
kind: api
summary: "onUnmounted cleans up timers, event listeners, and external subscriptions when a component is destroyed."
tags: [onunmounted, cleanup, memory-leaks, lifecycle]
related: [lifecycle-hooks, on-mounted, mouse-tracker-composable]
---
> **In one line:** onUnmounted() cleans up side effects to prevent memory leaks when a component is removed.

## The idea

Components do not live forever. When a user navigates to another page or a `v-if` condition turns false, Vue unmounts the component from the DOM and removes it from the component hierarchy.

If your component created side effects outside of Vue's direct control—such as starting a `setInterval` timer, attaching a global `window.addEventListener`, or opening a WebSocket connection—those resources **remain active in browser memory** even after the component is gone.

This causes subtle memory leaks, unexpected performance degradation, and errors when dead callbacks attempt to mutate unmounted component state.

To prevent this, use **`onUnmounted()`** to tear down any persistent resources.

## See it

```html
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const windowWidth = ref(window.innerWidth);

function handleResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <p>Current window width: {{ windowWidth }}px</p>
</template>
```

When this component is removed by `v-if`, `onUnmounted` ensures both the interval and the window resize listener are cleanly discarded.

## Go deeper

A companion hook, `onBeforeUnmount`, runs right before the component is torn down, while all DOM nodes and child components are still intact.

> **Tip:** When building composables that listen to browser events, always pair the setup logic with an `onUnmounted` cleanup call.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Failing to remove window event listeners causes silent memory leaks and duplicate handler execution.
- Never attempt to mutate component state inside onUnmounted, as the component has already been unmounted.

## Remember

- onUnmounted executes after the component has been removed from the DOM.
- Always clear setInterval, setTimeout, and WebSockets inside onUnmounted.
- Always remove global window and document event listeners.
