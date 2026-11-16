---
slug: computed-basics
title: "Derived State with computed()"
topic: reactivity
kind: api
summary: "computed derives cached, read-only reactive values from other reactive dependencies."
tags: [computed, derived-state, caching, reactivity]
related: [ref-primitive, computed-caching, writable-computed]
---
> **In one line:** computed() derives a reactive value that automatically recalculates when its dependencies change.

## The idea

In many user interfaces, state must be transformed before display: formatting dates, filtering an array of products, or summing shopping cart totals. Putting complex logic directly inside template mustaches clutters markup and makes testing difficult.

Vue provides **`computed()`** to create derived reactive state. You pass a getter function that performs the calculation. Vue returns a read-only **computed ref** whose value is accessed via `.value` in script and automatically unwrapped in templates.

```flow
items: items ref @primary
filter: activeFilter ref @primary
res: filteredItems computed @green
items -> res
filter -> res: automatically recomputes
```

Vue tracks which reactive dependencies the getter reads. Whenever any of those dependencies change, the computed property automatically updates and signals downstream templates to re-render.

## See it

```html
<script setup lang="ts">
import { ref, computed } from 'vue';

const firstName = ref('Ada');
const lastName = ref('Lovelace');

// Derived computed property
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>

<template>
  <p>Full Name: {{ fullName }}</p>
  <button @click="lastName = 'King'">Change Name</button>
</template>
```

When `lastName` changes, `fullName` automatically recalculates and updates the template.

## Go deeper

Computed properties are read-only by default. Attempting to assign `fullName.value = 'Grace Hopper'` will trigger a runtime warning in development.

> **Tip:** Keep computed getters pure: never perform side effects like HTTP calls or DOM mutations inside a computed getter.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not perform asynchronous operations (like fetch) inside a computed getter; use watch instead.
- Do not mutate other reactive state from within a computed getter function.

## Remember

- computed() derives reactive values from other reactive dependencies.
- Computed properties are read-only refs accessed via .value in JavaScript.
- Getters must be pure functions free of side effects.
