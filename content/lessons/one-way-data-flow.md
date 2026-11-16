---
slug: one-way-data-flow
title: "One-Way Data Flow"
topic: components
kind: concept
summary: "Props follow strict one-way data flow from parent to child; children must never mutate props."
tags: [props, one-way-data-flow, architecture, best-practices]
related: [define-props, define-emits, define-model]
---
> **In one line:** Data flows strictly down from parent to child via props; children must never mutate props.

## The idea

All props form a **one-way-down binding** between the child property and the parent: when the parent property updates, it flows down to the child, but not the other way around.

This architectural rule prevents child components from accidentally mutating parent state, which would make your application's data flow unpredictable and hard to debug.

```sequence
actor parent: Parent | owns state @primary
actor child: Child | renders view @blue
parent -> child: Passes state down as read-only props
child -> parent: Emits event requesting parent state update
```

If a child attempts to mutate a prop directly (e.g. `props.title = 'New'`), Vue emits a console warning. If a child needs to modify the data, it must either derive local state with a `ref()` or emit an event to ask the parent to update it.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  initialCount: number;
}>();

// RIGHT: If the prop is just an initial seed, copy it to a local ref
const localCount = ref(props.initialCount);

function increment() {
  // Good: mutates local state, leaving the parent prop intact
  localCount.value++;
}
</script>

<template>
  <button @click="increment">Local count: {{ localCount }}</button>
</template>
```

`localCount` is local component state initialized from `props.initialCount`, preserving parent isolation.

## Go deeper

If the prop is an object or array, JavaScript passes it by reference. While Vue cannot prevent you from mutating `props.user.name`, doing so violates one-way data flow and should always be avoided.

> **Tip:** If you need two-way communication between parent and child, use `v-model` or emit events instead of prop mutation.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Mutating properties of an object prop alters the parent object by reference, breaking predictable state flow.
- Copying a prop to a local ref means the local ref will NOT automatically update if the parent prop changes later.

## Remember

- Props follow strict one-way-down data flow from parent to child.
- Child components must never reassign or mutate received props.
- Use local refs for initial seeds, or emit events to request parent changes.
