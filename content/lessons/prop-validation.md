---
slug: prop-validation
title: "Runtime Prop Validation"
topic: components
kind: technique
summary: "Validate props at runtime with types, required flags, defaults, and custom validator functions."
tags: [props, validation, runtime, defensive-programming]
related: [define-props, typing-props, one-way-data-flow]
---
> **In one line:** Runtime prop validation ensures components receive expected data formats and values.

## The idea

When building component libraries or working on large teams without strict TypeScript checking, **runtime prop validation** acts as a defensive guard. Vue verifies incoming prop values in development mode and logs descriptive console warnings if requirements are breached.

When using object-based `defineProps`, you can configure:

| Key | Purpose | Example |
|---|---|---|
| `type` | Expected constructor | `String`, `Number`, `Boolean`, `Array`, `Object` |
| `required` | Whether parent must pass it | `true` or `false` |
| `default` | Fallback value if absent | Primitive, or factory function: `() => []` |
| `validator` | Custom validation logic | `(val) => ['info', 'warning'].includes(val)` |

Custom validator functions return a boolean indicating whether the value passed validation.

## See it

```html
<script setup lang="ts">
defineProps({
  label: { type: String, required: true },
  rating: { type: Number, default: 5 },
  status: {
    type: String,
    validator: (v: string) => ['draft', 'review', 'published'].includes(v)
  }
});
</script>

<template>
  <div class="status-box">
    <span>{{ label }}</span>
    <span>Status: {{ status }} (Rating: {{ rating }}/5)</span>
  </div>
</template>
```

Passing `status="archived"` triggers an immediate Vue console warning during development.

## Go deeper

Default values for objects and arrays **must always be returned from a factory function** (e.g. `default: () => ({})`) to ensure distinct component instances do not share the same memory reference.

> **Tip:** Prop validation executes *before* the component instance is created, so validator functions cannot access component state.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Object and array defaults must be factory functions: default() { return []; }.
- Prop validation runs only in development builds; it is stripped in production for performance.

## Remember

- Runtime prop validation provides development warnings for invalid inputs.
- Configure type, required, default, and custom validator functions.
- Object and array defaults must always be returned from factory functions.
