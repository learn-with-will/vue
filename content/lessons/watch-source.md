---
slug: watch-source
title: "Watching State with watch()"
topic: lifecycle-watchers
kind: api
summary: "watch observes specific reactive sources and triggers a callback when their values change."
tags: [watch, reactivity, side-effects, async]
related: [watch-options, watch-effect, watch-flush-timing]
---
> **In one line:** watch() observes specific reactive sources and runs a side-effect callback on change.

## The idea

While computed properties are designed for pure derived state, you often need to perform **side effects in response to state changes**: sending network requests, modifying `localStorage`, or logging analytics.

Vue provides the **`watch()`** function for this purpose. Unlike `computed`, `watch` is designed specifically to perform imperative side effects.

`watch()` takes two primary arguments:
1. **The source:** What to observe. This can be a ref, a getter function returning a value, or an array of sources.
2. **The callback:** The function to execute when the source changes. It receives `(newValue, oldValue)`.

```flow
source: count ref (old: 1, new: 2) @primary
callback: (newVal, oldVal) => { ... } @green
dom: LocalStorage / API call @blue
source -> callback: triggers on change
callback -> dom: executes side effect
```

By default, `watch` is **lazy**: it does not run the callback on initialization, but waits until the watched source actually changes.

## See it

```typescript
import { ref, watch } from 'vue';

const userId = ref('user-101');
const userProfile = ref<any>(null);

// Watch a single ref
watch(userId, async (newId, oldId) => {
  console.log(`User switched from ${oldId} to ${newId}`);
  const res = await fetch(`/api/users/${newId}`);
  userProfile.value = await res.json();
});

// Watch a specific property of an object using a getter function
const state = ref({ count: 0, title: 'Intro' });
watch(
  () => state.value.count,
  (newCount) => {
    console.log('Count updated to:', newCount);
  }
);
```

Whenever `userId.value` changes, the watch callback fetches the new profile data.

## Go deeper

You can watch multiple sources simultaneously by passing an array of sources: `watch([foo, bar], ([newFoo, newBar], [oldFoo, oldBar]) => { ... })`.

> **Tip:** To watch a property on a reactive object, always pass a getter function like `() => obj.count` rather than passing the raw property value directly.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Passing obj.count directly (instead of () => obj.count) passes a raw static number, which watch cannot track.
- Do not use watch when computed would suffice; watch is only for side effects, not for calculating values.

## Remember

- watch() observes specific reactive sources and runs a callback when they change.
- The callback receives both the new value and old value (newValue, oldValue).
- watch is lazy by default and will not fire until the source updates.
