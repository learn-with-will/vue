---
slug: watch-effect
title: "Automatic Tracking with watchEffect()"
topic: lifecycle-watchers
kind: api
summary: "watchEffect runs a callback immediately and automatically tracks any reactive state accessed inside it."
tags: [watcheffect, reactivity, side-effects, auto-tracking]
related: [watch-source, watch-options, watch-flush-timing]
---
> **In one line:** watchEffect() runs immediately and automatically tracks all reactive dependencies read in its body.

## The idea

While `watch()` requires you to explicitly declare which sources to observe, **`watchEffect()`** automates dependency tracking.

When you pass a function to `watchEffect()`, Vue:
1. Runs the function **immediately** during component initialization.
2. Automatically **tracks every reactive property** (`.value` or proxy property) accessed during its execution.
3. Automatically re-runs the entire function whenever any of those tracked dependencies change in the future.

| Feature | watch() | watchEffect() |
|---|---|---|
| Dependency list | Explicit (you list sources) | Automatic (detected at runtime) |
| Initial execution | Lazy by default | Immediate by default |
| Old value access | Yes (`oldValue` provided) | No (only runs the function) |

`watchEffect` is extraordinarily clean when a side effect depends on multiple variables and you don't want to maintain a manual list of sources.

## See it

```typescript
import { ref, watchEffect } from 'vue';

const userId = ref('12');
const section = ref('billing');

// Automatically tracks both userId and section!
watchEffect(() => {
  console.log(`Syncing URL to /user/${userId.value}/${section.value}`);
  document.title = `User ${userId.value} - ${section.value}`;
});

// Changing either ref automatically re-runs the watchEffect callback:
userId.value = '45';
section.value = 'security';
```

You never have to maintain an array of sources; accessing `userId.value` and `section.value` inside the callback registers them automatically.

## Go deeper

`watchEffect` accepts an **`.onCleanup()`** argument inside the callback function, allowing you to cancel in-flight HTTP requests before re-running: `watchEffect((onCleanup) => { ... })`.

> **Tip:** If you need to know what the previous value was, use `watch()` instead of `watchEffect()`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Only dependencies accessed synchronously during the callback execution are tracked.
- Properties accessed after an await statement inside an async callback will not be tracked.

## Remember

- watchEffect() runs immediately and tracks dependencies automatically.
- Re-runs whenever any reactive property accessed inside the callback changes.
- Ideal for side effects depending on multiple reactive variables.
