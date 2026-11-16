---
slug: watch-options
title: "Watch Options: immediate and deep"
topic: lifecycle-watchers
kind: technique
summary: "Configure watch behavior using immediate to run on creation and deep to observe nested mutations."
tags: [watch, immediate, deep, configuration]
related: [watch-source, watch-effect, watch-flush-timing]
---
> **In one line:** Use { immediate: true } to run on creation and { deep: true } to track nested object mutations.

## The idea

By default, `watch()` is lazy (it only runs after the first mutation) and shallow (it tracks identity, not nested object properties). You can customize this behavior using the optional third argument: the **options object**.

The two most important options are:

```tree
Watch Options
  { immediate: true }
    [Initial run] Executes callback immediately on creation with initial value @green
  { deep: true }
    [Nested tracking] Traverses all nested object properties, triggering on any deep mutation @blue
```

`immediate: true` is ideal when you want to load data both on initial component mount and whenever a query parameter updates.

`deep: true` forces Vue to recursively traverse an entire object tree so that updating `settings.theme.fontSize` triggers the watcher even though `settings` itself was not reassigned.

## See it

```typescript
import { ref, watch } from 'vue';

const query = ref('vue');

// 1. immediate: true runs immediately upon setup AND on subsequent changes
watch(
  query,
  (newQuery) => {
    console.log('Fetching results for:', newQuery);
  },
  { immediate: true }
);

// 2. deep: true tracks mutations inside nested objects
const userSettings = ref({
  notifications: { email: true, push: false }
});

watch(
  userSettings,
  (newSettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
  },
  { deep: true }
);
```

The first watcher runs immediately on load; the second watcher detects toggling `userSettings.value.notifications.email = false`.

## Go deeper

In Vue 3.5+, you can pass a number to `deep` (e.g. `{ deep: 2 }`) to specify maximum traversal depth for performance.

> **Tip:** `deep: true` requires traversing all object properties, which can be expensive on massive data structures. Only use it when truly necessary.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- When deep watching a reactive object, the newValue and oldValue point to the same object reference.
- Avoid deep watching huge arrays or nested API trees without considering performance overhead.

## Remember

- immediate: true forces the watcher callback to execute immediately on creation.
- deep: true recursively traverses nested properties to detect deep mutations.
- Combine options in a single configuration object: { immediate: true, deep: true }.
