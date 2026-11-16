---
slug: class-binding-array
title: "Class Bindings: Array Syntax"
topic: template-directives
kind: technique
summary: "Apply a list of dynamic CSS classes using array syntax and nested objects for conditional classes."
tags: [class-binding, array-syntax, css, template-syntax]
related: [class-binding-object, style-binding-object, attribute-bindings]
---
> **In one line:** Use :class="[classA, classB]" to apply multiple dynamic class strings to an element.

## The idea

While object syntax is perfect for toggling individual classes on and off with booleans, **array syntax** is ideal when you want to apply multiple dynamic class names computed from different variables.

In array syntax, each element in the array is evaluated as a JavaScript expression that resolves to a class string:

```html
<div :class="[baseClass, themeClass]"></div>
```

You can also **nest object syntax inside an array**. This allows you to combine always-applied dynamic classes with conditionally toggled classes in a single binding:

```html
<div :class="[baseClass, { 'is-active': isActive }]"></div>
```

Vue flattens the array and object conditions into a clean, space-separated class list on the final DOM element.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const sizeClass = ref('btn-lg');
const variantClass = ref('btn-primary');
const isHovered = ref(false);
</script>

<template>
  <!-- Combines string classes with an inline conditional object -->
  <button
    :class="[
      sizeClass,
      variantClass,
      { 'btn-elevated': isHovered }
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    Dynamic Button
  </button>
</template>
```

The rendered button receives `btn-lg btn-primary`, and adds `btn-elevated` whenever the mouse enters.

## Go deeper

You can use ternary operators directly inside the array: `:class="[isActive ? activeClass : '', errorClass]"`. However, nesting an object `{ [activeClass]: isActive }` is often cleaner.

> **Tip:** Array syntax is especially useful when building reusable UI components with configurable variant and size props.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not accidentally pass literal strings when you intended variable names; :class="[active]" is a variable, :class="['active']" is literal.
- Avoid deeply nested ternaries inside arrays; move complex logic into a computed property.

## Remember

- Array syntax :class="[a, b]" applies multiple dynamic class names.
- Nest objects inside arrays to combine static strings with conditional classes.
- Ternary expressions can be used within array bindings for inline choices.
