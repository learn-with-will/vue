---
slug: writable-computed
title: "Writable Computed Properties"
topic: reactivity
kind: technique
summary: "Create two-way writable computed properties by supplying both get and set functions."
tags: [computed, writable-computed, get-set, v-model]
related: [computed-basics, computed-caching, v-model-basics]
---
> **In one line:** Provide a getter and a setter object to computed() to create a writable computed property.

## The idea

While computed properties are read-only by default, Vue allows you to create **writable computed properties** by passing an object with explicit `get` and `set` functions.

The **getter** computes and returns the derived value as usual. The **setter** is called whenever you assign a new value to `.value` (or when a form element writes to it via `v-model`).

```tree
Writable Computed Flow
  Read computed.value
    [get] Returns derived state from source refs @green
  Write computed.value = newValue
    [set] Updates the underlying source refs @blue
```

The setter does not store the value directly on the computed property. Instead, it parses the incoming input and updates the underlying source refs. When the source refs update, the getter re-evaluates naturally.

## See it

```html
<script setup lang="ts">
import { ref, computed } from 'vue';

const firstName = ref('Ada');
const lastName = ref('Lovelace');

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue: string) {
    const parts = newValue.split(' ');
    firstName.value = parts[0] ?? '';
    lastName.value = parts.slice(1).join(' ');
  }
});
</script>

<template>
  <div>
    <!-- v-model writes directly to the writable computed -->
    <input v-model="fullName" placeholder="Full name" />
    <p>First: {{ firstName }} | Last: {{ lastName }}</p>
  </div>
</template>
```

Typing "Grace Hopper" into the input triggers the setter, updating `firstName` to "Grace" and `lastName` to "Hopper".

## Go deeper

Writable computed properties are commonly used as adapters between parent props and local component form controls, ensuring clean two-way synchronization without breaking one-way data flow.

> **Tip:** Ensure the setter gracefully handles unexpected or malformed user input (such as empty strings or missing delimiters).

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Writing to a standard computed without a setter throws a runtime warning.
- The setter must mutate underlying reactive sources, not attempt to assign to itself.

## Remember

- Pass an object with get() and set() to create a writable computed property.
- The setter receives the assigned value and mutates the source refs.
- Writable computed pairs seamlessly with v-model for complex form inputs.
