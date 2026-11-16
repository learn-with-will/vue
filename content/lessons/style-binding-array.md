---
slug: style-binding-array
title: "Style Bindings: Array Syntax"
topic: template-directives
kind: technique
summary: "Apply multiple style objects to a single element using array syntax to merge base and override styles."
tags: [style-binding, array-syntax, inline-styles, composition]
related: [style-binding-object, class-binding-array, attribute-bindings]
---
> **In one line:** Use :style="[baseStyles, overridingStyles]" to apply multiple style objects to an element.

## The idea

When building modular UI widgets, you frequently have a common set of base styles (like dimensions and positioning) that need to be augmented by user-customized theme styles or temporary state styles.

Vue supports **array syntax for `:style`**. It allows you to pass an array of style objects:

```html
<div :style="[baseStyles, themeStyles]"></div>
```

Vue merges all the objects in the array from left to right. If both objects specify the same CSS property (such as `color` or `padding`), the property in the later object takes precedence and overrides the earlier one.

## See it

```html
<script setup lang="ts">
import { ref, computed } from 'vue';

const baseCardStyle = {
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #dcdfe5'
};

const isHighlight = ref(true);

const highlightStyle = computed(() => ({
  borderColor: isHighlight.value ? '#1f8a60' : '#dcdfe5',
  boxShadow: isHighlight.value ? '0 4px 12px rgba(31, 138, 96, 0.15)' : 'none'
}));
</script>

<template>
  <div :style="[baseCardStyle, highlightStyle]">
    <h3>Card Title</h3>
    <button @click="isHighlight = !isHighlight">Toggle Highlight</button>
  </div>
</template>
```

The card receives the structural padding and border from `baseCardStyle`, while `highlightStyle` dynamically overrides the border color and shadow.

## Go deeper

Array syntax is especially clean when working with component props, allowing parent components to pass custom style overrides that merge cleanly onto internal component defaults.

> **Tip:** You can include conditional style objects using ternary operators inside the array: `:style="[base, isSelected ? selectedStyles : null]"`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Conflicting properties in style arrays override from left to right; order matters.
- Passing null or undefined items in the array is safely ignored by Vue.

## Remember

- :style="[obj1, obj2]" merges multiple style objects onto a single element.
- Later objects in the array override earlier ones when properties conflict.
- Ideal for separating base structural styles from dynamic theme overrides.
