---
slug: class-binding-object
title: "Class Bindings: Object Syntax"
topic: template-directives
kind: technique
summary: "Bind dynamic CSS classes using object syntax where keys are class names and values are boolean conditions."
tags: [class-binding, object-syntax, css, template-syntax]
related: [class-binding-array, style-binding-object, attribute-bindings]
---
> **In one line:** Use :class="{ className: condition }" to dynamically toggle CSS classes based on truthiness.

## The idea

Manipulating CSS classes dynamically is essential for styling active navigation links, error validation states, and disabled controls. Vue provides special enhancements when `v-bind` is used on the `class` attribute.

The most common approach is **object syntax**: you pass an object to `:class`. The keys of the object represent CSS class names, and the values are boolean conditions. When a value is truthy, Vue adds that class to the element; when falsy, Vue removes it.

```html
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
```

Vue also handles **class merging** automatically. If the element already has a static HTML `class` attribute, Vue preserves the static classes and cleanly appends the dynamic classes alongside them.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const isActive = ref(true);
const hasError = ref(false);
</script>

<template>
  <!-- Merges static "btn" with dynamic "btn-active" and "btn-error" -->
  <button
    class="btn"
    :class="{ 'btn-active': isActive, 'btn-error': hasError }"
    @click="isActive = !isActive"
  >
    Toggle Active State
  </button>
</template>

<style scoped>
.btn { padding: 8px 16px; border-radius: 4px; }
.btn-active { background-color: #1f8a60; color: white; }
.btn-error { border: 2px solid #ef4444; }
</style>
```

Clicking the button flips `isActive`, instantly toggling the `btn-active` class on the rendered button.

## Go deeper

If the object syntax becomes long or complex, you can extract the object into a computed property: `<div :class="buttonClasses">`.

> **Tip:** If your CSS class name contains hyphens (like `text-danger`), wrap the key in quotes.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Unquoted hyphenated keys like { text-danger: true } cause JavaScript syntax errors.
- Falsy values like false, null, and undefined all cleanly remove the class.

## Remember

- Pass an object to :class where keys are class names and values are booleans.
- Static class attributes automatically merge with dynamic class bindings.
- Extract complex class objects into computed properties for clean templates.
