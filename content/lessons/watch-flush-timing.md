---
slug: watch-flush-timing
title: "Watcher Flush Timing"
topic: lifecycle-watchers
kind: technique
summary: "Control whether watcher callbacks fire before or after DOM updates with flush pre, post, or sync."
tags: [flush-timing, dom-updates, watchposteffect, internals]
related: [watch-source, watch-effect, next-tick]
---
> **In one line:** Flush timing controls whether watchers execute before (pre), after (post), or synchronously with DOM updates.

## The idea

When you mutate reactive state in Vue, DOM updates do not happen immediately. Vue batches DOM updates and applies them asynchronously on the next tick to maximize rendering performance.

By default, watcher callbacks run **before the DOM is updated** (flush timing: `'pre'`). This means that if you inspect a template ref or DOM node inside a standard watcher, the DOM still displays the *old* value.

Vue allows you to configure the **flush timing** using the options object:

| Flush Option | Timing | Convenience Alias | Use Case |
|---|---|---|---|
| `'pre'` (default) | Runs *before* DOM updates | Standard `watch` / `watchEffect` | State updates, business logic |
| `'post'` | Runs *after* DOM has re-rendered | `watchPostEffect` | Reading DOM dimensions, canvas drawing |
| `'sync'` | Runs synchronously on mutation | `watchSyncEffect` | Low-level debugging, data validation |

When you need to read or measure the updated DOM inside a watcher, always use **`flush: 'post'`** or the **`watchPostEffect`** helper.

## See it

```html
<script setup lang="ts">
import { ref, watch, watchPostEffect, useTemplateRef } from 'vue';

const count = ref(0);
const paragraphRef = useTemplateRef<HTMLParagraphElement>('paragraphRef');

// Default 'pre': DOM has NOT updated yet
watch(count, () => {
  console.log('Pre-flush DOM text:', paragraphRef.value?.textContent); // Old text!
});

// 'post': Runs after Vue updates the real DOM
watchPostEffect(() => {
  console.log('Post-flush updated DOM text:', paragraphRef.value?.textContent); // New text!
});
</script>

<template>
  <div>
    <p ref="paragraphRef">Current count: {{ count }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
```

When `count` increases, the post-flush watcher accurately reads the freshly rendered text from the DOM.

## Go deeper

`watchSyncEffect` fires synchronously the exact moment a reactive variable is mutated. It should be used with extreme caution because it bypasses batching and can harm rendering performance.

> **Tip:** Use `watchPostEffect` whenever a watcher needs to scroll a container to the bottom after new messages are appended.

## Watch out

- Attempting to measure updated DOM inside a default pre-flush watcher reads stale dimensions.
- Overusing sync watchers causes repeated redundant recalculations.

## Remember

- Default pre-flush watchers run before Vue updates the DOM.
- Use flush: 'post' or watchPostEffect when you must inspect the updated DOM.
- Use post-flush watchers for DOM measurements, scroll positioning, and canvas drawing.
