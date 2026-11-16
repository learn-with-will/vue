---
slug: style-binding-object
title: "Style Bindings: Object Syntax"
topic: template-directives
kind: technique
summary: "Bind dynamic inline styles using JavaScript objects with camelCase or kebab-case CSS properties."
tags: [style-binding, inline-styles, css, template-syntax]
related: [style-binding-array, class-binding-object, attribute-bindings]
---
> **In one line:** Use :style="{ color: activeColor, fontSize: size + 'px' }" to bind dynamic inline styles.

## The idea

For values that cannot easily be expressed as static CSS classes—such as progress bar percentages, dynamic coordinates, or custom theme colors—you can bind inline styles directly using `:style`.

Vue supports **object syntax** for `:style`. The object closely resembles JavaScript DOM style objects:

```html
<div :style="{ color: textColor, fontSize: fontSize + 'px' }"></div>
```

Vue supports both **camelCase** (recommended, e.g. `fontSize`) and **kebab-case** (`'font-size'`, which requires quotes). Furthermore, Vue automatically adds vendor prefixes where required by older browser engines.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const progress = ref(65);
const primaryColor = ref('#1f8a60');
</script>

<template>
  <div class="progress-bar-container">
    <div
      class="progress-fill"
      :style="{
        width: progress + '%',
        backgroundColor: primaryColor,
        height: '8px'
      }"
    ></div>
  </div>
</template>

<style scoped>
.progress-bar-container { background-color: #eee; border-radius: 4px; }
.progress-fill { transition: width 0.3s ease; }
</style>
```

As `progress.value` changes, Vue updates the inline `width` and `background-color` properties seamlessly.

## Go deeper

When a style property requires multiple values for browser fallbacks, you can pass an array of strings: `:style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"`.

> **Tip:** Prefer CSS classes over inline styles for general design tokens, reserving `:style` for continuous values like coordinates or percentages.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not forget unit suffixes (e.g. "px", "%") where CSS requires them.
- Kebab-case property names like "background-color" must be wrapped in quotes.

## Remember

- :style accepts an object mapping CSS properties to dynamic values.
- Use camelCase (fontSize) or quoted kebab-case ('font-size') for properties.
- Vue automatically handles browser vendor prefixes on inline styles.
