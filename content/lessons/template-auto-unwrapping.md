---
slug: template-auto-unwrapping
title: "Template Auto-Unwrapping"
topic: reactivity
kind: concept
summary: "Top-level refs used in templates are automatically unwrapped so you do not type .value in markup."
tags: [ref, templates, auto-unwrapping, dx]
related: [ref-primitive, ref-vs-reactive, text-interpolation]
---
> **In one line:** Vue automatically unwraps top-level refs in templates, eliminating the need for .value.

## The idea

Having to type `.value` in JavaScript is essential for preserving reactivity across functions. In HTML templates, however, writing `count.value` everywhere would be tedious and cluttered.

To keep templates clean, Vue provides **automatic ref unwrapping**: when a ref is bound as a top-level property in a template, Vue automatically reads its `.value` property for you.

```html
<!-- You write clean markup: -->
<p>{{ count }}</p>

<!-- Vue evaluates behind the scenes: -->
<p>{{ count.value }}</p>
```

The same auto-unwrapping applies to event handlers: you can write `@click="count++"` instead of `@click="count.value++"`. The template compiler detects that `count` is a ref and generates code that operates on its internal value.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(10);
const title = ref('Bite-sized Vue');
</script>

<template>
  <div>
    <!-- Top-level refs are auto-unwrapped: no .value needed! -->
    <h1>{{ title }}</h1>
    <p>Current count: {{ count }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
```

Inside the template, `title` and `count` behave just like plain values, while retaining full reactivity.

## Go deeper

Auto-unwrapping only applies to **top-level properties** in the template scope. If a ref is nested inside a plain object (e.g. `const obj = { id: ref(1) }`), writing `{{ obj.id + 1 }}` will not unwrap because `obj.id` is an object.

> **Tip:** If a ref is nested inside an object, destructure it into a top-level variable or use `toRefs` so templates can unwrap it.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Writing .value inside template mustaches (e.g. {{ count.value }}) works but is redundant and unidiomatic.
- Refs nested inside plain JavaScript objects do not automatically unwrap in template expressions.

## Remember

- Top-level refs in templates automatically unwrap without .value.
- Event handlers in templates can mutate refs directly (e.g. @click="count++").
- Refs nested inside plain objects require explicit .value or destructuring.
