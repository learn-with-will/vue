---
slug: options-vs-composition-api
title: "Options API vs Composition API"
topic: foundations
kind: concept
summary: "Vue supports both Options and Composition APIs; Composition API with script setup is the modern default for scaling."
tags: [composition-api, options-api, script-setup]
related: [what-is-vue, anatomy-of-an-sfc, ref-primitive]
---
> **In one line:** The Composition API organizes code by logical feature, while the Options API groups by option type.

## The idea

Vue components can be written in two primary styles: the traditional **Options API** and the modern **Composition API**. Both are first-class, fully supported citizen APIs that share the same underlying reactivity engine.

In the Options API, you define component logic using an options object containing properties like `data()`, `methods`, and `computed`. This structure is approachable for newcomers, but as components grow to hundreds of lines, logic for a single feature gets scattered across separate option sections.

The Composition API solves this by letting you define component logic using imported functions inside `<script setup>`. You group reactive state, helper functions, and lifecycle hooks together by feature, making code easier to read, refactor, and extract into reusable composables.

```tree
How component logic is grouped
  Options API
    [Type] Split across data, methods, computed @amber
  Composition API
    [Feature] Grouped together by logical feature @green
```

This course exclusively teaches the Composition API with `<script setup>`, which is the officially recommended default for modern Vue 3 applications.

## See it

```html
<!-- Modern: Composition API with <script setup> -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const price = ref(50);
const quantity = ref(2);
const total = computed(() => price.value * quantity.value);

function addOne() {
  quantity.value++;
}
</script>

<template>
  <p>Total: ${{ total }}</p>
  <button @click="addOne">Add Item</button>
</template>
```

Notice how `price`, `quantity`, `total`, and `addOne` live right next to each other as standard JavaScript variables and functions.

## Go deeper

The Composition API provides first-class TypeScript integration because variables and functions are typed naturally. In contrast, the Options API requires complex `this` context typing.

> **Tip:** You can mix both APIs in the same project, but stick to the Composition API for all new code to maximize consistency.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- The Options API is not deprecated; it remains supported for backwards compatibility and simpler components.
- Inside Composition API setup, you do not use "this"; access variables directly by name.

## Remember

- Composition API groups code by logical feature rather than option type.
- Modern Vue 3 uses Composition API with <script setup> as the default.
- Both APIs compile down to the exact same high-performance reactivity engine.
