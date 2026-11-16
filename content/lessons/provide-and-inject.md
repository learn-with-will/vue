---
slug: provide-and-inject
title: "Dependency Injection with provide and inject"
topic: slots-provide
kind: api
summary: "provide and inject pass data from an ancestor component to any descendant regardless of depth."
tags: [provide, inject, dependency-injection, composition-api]
related: [prop-drilling-problem, reactive-provide, injection-keys]
---
> **In one line:** provide() supplies data from an ancestor, and inject() retrieves it in any descendant.

## The idea

To solve prop drilling without forcing all data into a global store, Vue provides **Provide and Inject**.

An ancestor component can serve as a **dependency provider** for all of its descendants, no matter how deeply nested the component tree goes:
1. **`provide(key, value)`:** Called in an ancestor component to make a value available to all descendants.
2. **`inject(key, defaultValue?)`:** Called in any descendant component to retrieve the provided value.

```flow
ancestor: Root Provider provide('theme', 'dark') @primary
child1: MiddleComponent (unaware of theme) @neutral
child2: DeepDescendant inject('theme') @green
ancestor -> child1: tree hierarchy
child1 -> child2: tree hierarchy
ancestor -> child2: direct dependency injection
```

Intermediate components in the tree are completely bypassed. They don't declare props, they don't forward bindings, and they remain completely clean and decoupled.

## See it

```html
<!-- Ancestor.vue (Provider) -->
<script setup lang="ts">
import { provide } from 'vue';
import NestedChild from './NestedChild.vue';

// Provide a value under the key 'appTheme'
provide('appTheme', 'dark');
</script>

<template>
  <NestedChild />
</template>
```

In a deeply nested descendant component:

```html
<!-- DeepGrandchild.vue (Consumer) -->
<script setup lang="ts">
import { inject } from 'vue';

// Inject the value using the same key, with an optional fallback
const theme = inject('appTheme', 'light');
</script>

<template>
  <div :class="['card', theme]">
    <p>Active Theme: {{ theme }}</p>
  </div>
</template>
```

`DeepGrandchild` receives `'dark'` directly, without `NestedChild` knowing anything about `theme`.

## Go deeper

If no ancestor provides the requested key, `inject()` returns `undefined` unless you provide a fallback second argument.

> **Tip:** You can supply a factory function as the third argument if the fallback value is expensive to calculate: `inject('key', () => computeExpensiveDefault(), true)`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Both provide() and inject() must be invoked synchronously during <script setup> execution.
- Using string keys across large teams can lead to naming collisions; use Symbol keys instead.

## Remember

- provide(key, value) exposes data to all descendants in the component sub-tree.
- inject(key, fallback) reads provided data from any ancestor.
- Bypasses all intermediate components to cleanly eliminate prop drilling.
