---
slug: custom-directives-basics
title: "Authoring Custom Directives"
topic: tooling-typescript
kind: technique
summary: "Create custom directives using the vFocus naming convention for direct low-level DOM manipulations."
tags: [custom-directives, dom, directives, composition-api]
related: [directive-hooks, directive-binding-values, vue-plugins]
---
> **In one line:** Declare custom directives in <script setup> using the vName camelCase convention.

## The idea

In Vue, the primary form of code reuse is components and composables. However, there are cases where you need direct, low-level access to raw DOM elements: auto-focusing an input, binding a third-party tooltip, or detecting clicks outside an element.

For these low-level DOM tasks, Vue allows you to define **custom directives**.

In `<script setup>`, any camelCase variable that begins with the letter **`v`** (like `vFocus` or `vHighlight`) is automatically registered as a custom directive:

```typescript
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
};
```

In the template, you use it in kebab-case: `<input v-focus />`.

## See it

```html
<script setup lang="ts">
import type { Directive } from 'vue';

// Custom directive definition: automatically focuses the input upon mount
const vFocus: Directive<HTMLInputElement> = {
  mounted(el) {
    el.focus();
  }
};
</script>

<template>
  <div>
    <h2>Search Portal</h2>
    <!-- Applying our custom directive: -->
    <input v-focus placeholder="Input auto-focused by v-focus directive" />
  </div>
</template>
```

When this component mounts, the input field receives browser focus automatically.

## Go deeper

To register a directive globally so it can be used across all components, register it on the application instance: `app.directive('focus', vFocus)`.

> **Tip:** Do not use custom directives to render HTML or manage state; use components for UI and directives solely for low-level DOM manipulations.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Directive names in <script setup> must start with lowercase v followed by a capital letter (vFocus).
- Custom directives do not work on component root nodes when components have multiple root elements.

## Remember

- Custom directives encapsulate direct, low-level DOM manipulations.
- In <script setup>, name the directive object vName (e.g. vFocus).
- Use in templates with standard kebab-case (e.g. v-focus).
