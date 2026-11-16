---
slug: custom-ref
title: "Custom Refs with customRef()"
topic: advanced-reactivity
kind: technique
summary: "Create custom reactive refs with explicit control over track and trigger timing, such as debouncing."
tags: [customref, debouncing, reactivity, advanced]
related: [ref-primitive, how-reactivity-works, v-model-basics]
---
> **In one line:** customRef() grants explicit control over when dependency tracking and triggering occur.

## The idea

Standard refs track dependencies on every read and trigger updates on every write. But what if you want to **debounce user typing** before triggering updates, or sync state with browser `sessionStorage` synchronously?

Vue provides the **`customRef()`** factory function.

`customRef` accepts a factory function that receives explicit `track` and `trigger` callbacks, and must return an object with `get` and `set` methods:

```typescript
customRef((track, trigger) => ({
  get() {
    track(); // Manually tell Vue to track this read
    return value;
  },
  set(newValue) {
    value = newValue;
    trigger(); // Manually tell Vue to trigger updates
  }
}))
```

By controlling when `trigger()` is called, you can delay or throttle updates with complete precision.

## See it

```typescript
// useDebouncedRef.ts
import { customRef } from 'vue';

export function useDebouncedRef<T>(initialValue: T, delayMs = 300) {
  let timeoutId: number | undefined;
  let value = initialValue;

  return customRef((track, trigger) => ({
    get() {
      track(); // Record dependency
      return value;
    },
    set(newValue: T) {
      clearTimeout(timeoutId);
      // Debounce the trigger call!
      timeoutId = window.setTimeout(() => {
        value = newValue;
        trigger(); // Only trigger DOM updates after delay
      }, delayMs);
    }
  }));
}
```

In your component:

```html
<script setup lang="ts">
import { useDebouncedRef } from './useDebouncedRef';

// Input updates only trigger after user pauses typing for 500ms!
const searchQuery = useDebouncedRef('', 500);
</script>

<template>
  <input v-model="searchQuery" placeholder="Search with debounced updates..." />
  <p>Search query: {{ searchQuery }}</p>
</template>
```

Typing rapidly delays DOM updates until the user stops typing for 500 milliseconds.

## Go deeper

`customRef` is also widely used to synchronize reactive state directly with browser storage or URL hash queries.

> **Tip:** Always invoke `track()` inside `get()` and `trigger()` inside `set()` to maintain contract integrity.

## Watch out

- Forgetting to call track() inside get() prevents templates from reacting to changes.
- Remember to clear pending timeouts when the component unmounts to prevent stale triggers.

## Remember

- customRef((track, trigger) => ({ get, set })) creates customized refs.
- Provides explicit control over dependency tracking and trigger dispatch.
- Commonly used for debounced inputs and synchronized external state.
