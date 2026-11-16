---
slug: scoped-styles
title: "Component-Scoped CSS with <style scoped>"
topic: components
kind: technique
summary: "Prevent CSS leaks across components by scoping styles with the scoped attribute and deep selector."
tags: [css, scoped-css, styling, sfc]
related: [anatomy-of-an-sfc, defining-components, class-binding-object]
---
> **In one line:** <style scoped> scopes CSS rules to the current component using unique data attributes.

## The idea

In standard CSS, all selectors are global. A rule like `.button { padding: 10px; }` written in one file can unintentionally alter buttons across every page in your application.

Vue solves this effortlessly with **`<style scoped>`**.

When you add the `scoped` attribute to a `<style>` block in an SFC, PostCSS automatically rewrites your styles at compile time by appending a unique attribute selector (like `[data-v-7ba5bd90]`) to each CSS rule. It adds that same attribute to the component's rendered HTML elements.

```tree
Scoped CSS Compilation
  You write:
    .title { color: #1f8a60; }
  Vue compiles to:
    .title[data-v-7ba5bd90] { color: #1f8a60; }
  Rendered HTML:
    <h1 class="title" data-v-7ba5bd90>Hello</h1>
```

As a result, your styles apply strictly to elements inside this component and can never leak to the rest of the application.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const title = ref('Scoped Styling');
</script>

<template>
  <div class="panel">
    <h2 class="title">{{ title }}</h2>
  </div>
</template>

<style scoped>
/* Only affects .panel and .title inside this component! */
.panel {
  border: 1px solid #dcdfe5;
  padding: 16px;
  border-radius: 8px;
}

.title {
  color: #1f8a60;
  margin: 0;
}
</style>
```

Other components in the project with a class named `.title` will not be affected by this color rule.

## Go deeper

If you need a scoped rule to target elements inside a child component (for example, styling a slot outlet or third-party widget), use the **`:deep()` pseudo-class**: `:deep(.child-class) { font-weight: bold; }`.

> **Tip:** You can have both a `<style scoped>` block and a global `<style>` block in the same component.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Scoped styles do not leak down into child component interiors, except for the child's root element.
- Overusing :deep() defeats the purpose of style scoping; use it sparingly.

## Remember

- <style scoped> prevents CSS rules from leaking to other components.
- Uses unique data attributes added at compile time for CSS isolation.
- Use the :deep() selector to target elements nested inside child components.
