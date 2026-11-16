---
slug: next-tick
title: "Waiting for DOM Updates with nextTick()"
topic: advanced-reactivity
kind: api
summary: "nextTick waits for Vue to finish batching reactive mutations and flush DOM updates."
tags: [nexttick, dom-updates, batching, microtasks]
related: [template-refs-dom, watch-flush-timing, how-reactivity-works]
---
> **In one line:** nextTick() returns a Promise that resolves after Vue has flushed batched DOM updates.

## The idea

When you modify reactive state in Vue, the DOM is **not updated synchronously**.

If Vue updated the real DOM immediately on every single variable change, a function that updates 100 array items in a loop would trigger 100 separate browser reflows and repaints, dragging UI performance to a halt.

Instead, Vue **batches mutations asynchronously**: it queues all state changes on the current tick and flushes the DOM updates once as a single batch using a JavaScript microtask.

```tree
Vue Asynchronous DOM Batching
  count.value = 1
  count.value = 2   --> Vue queues updates in microtask
  count.value = 3
  DOM still shows 0 synchronously!
  nextTick() resolves --> DOM updates to 3 in a single flush
```

If you need to read or measure the DOM immediately after changing a reactive variable, you must wait for **`nextTick()`** to resolve.

## See it

```html
<script setup lang="ts">
import { ref, nextTick, useTemplateRef } from 'vue';

const message = ref('Hello');
const textRef = useTemplateRef<HTMLParagraphElement>('textRef');

async function updateAndMeasure() {
  message.value = 'Updated sentence text!';
  // Wait for Vue to flush batched DOM updates
  await nextTick();
  console.log('DOM height:', textRef.value?.offsetHeight);
}
</script>

<template>
  <p ref="textRef">{{ message }}</p>
  <button @click="updateAndMeasure">Update & Measure</button>
</template>
```

`await nextTick()` guarantees that the DOM has been fully patched before measuring `offsetHeight`.

## Go deeper

`nextTick()` can also accept a callback function (`nextTick(() => { ... })`), but awaiting it with `async/await` is the modern standard.

> **Tip:** `nextTick()` is especially useful when focusing an input that was just revealed via a `v-if` condition.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Reading DOM dimensions synchronously immediately after mutating state reads old layout values.
- Do not overuse nextTick; most data-driven UI should be expressed declaratively with templates.

## Remember

- Vue batches state mutations asynchronously to optimize DOM performance.
- DOM updates are flushed on the next microtask.
- await nextTick() pauses execution until DOM reconciliation has completed.
