---
slug: ref-primitive
title: "Reactive State with ref()"
topic: reactivity
kind: api
summary: "ref wraps any value in a reactive container object accessed through the .value property."
tags: [reactivity, ref, state, value-property]
related: [template-auto-unwrapping, reactive-objects, ref-vs-reactive]
---
> **In one line:** ref() takes an initial value and returns a reactive object with a .value property.

## The idea

In standard JavaScript, primitive types like numbers, strings, and booleans are passed by value, not by reference. If a function reads a variable `let count = 0` and later modifies `count = 1`, JavaScript provides no native mechanism for other functions or DOM nodes to know that the value changed.

To solve this, Vue provides the **`ref()`** function. It takes any inner value—primitive or complex—and wraps it inside a reactive container object.

```tree
How ref() stores reactive state
  const count = ref(0)
    [wrapper] Returns RefImpl object @blue
      [.value] Holds inner primitive: 0 @green
```

The returned object exposes a single property: **`.value`**. In JavaScript or TypeScript code inside `<script setup>`, you must always read and write through `.value`. When you read `.value`, Vue tracks the active effect. When you assign a new value to `.value`, Vue triggers all dependent effects and re-renders the DOM.

## See it

```typescript
import { ref } from 'vue';

// Initialize a reactive reference
const count = ref<number>(0);

console.log(count.value); // 0

// Modifying .value triggers reactive updates
count.value++;
console.log(count.value); // 1

// Works with any type: string, boolean, array, object
const username = ref('Ada');
username.value = 'Grace';
```

Whenever you mutate `count.value` or `username.value`, any template expression or computed property that reads those variables is automatically updated.

## Go deeper

If you pass an object or array to `ref()`, Vue internally converts that object with `reactive()` so that deeply nested properties are also reactive.

> **Tip:** Always declare variables holding refs with `const` rather than `let` to prevent accidentally replacing the ref container itself.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Forgetting .value in JavaScript compares or assigns to the ref object instead of the actual data.
- Assigning directly to the ref variable (e.g. count = 5) breaks reactivity completely.

## Remember

- ref() wraps any primitive or object in a reactive container.
- Access and mutate the value using the .value property in JavaScript.
- Mutating .value triggers dependency tracking and DOM updates.
