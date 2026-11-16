---
slug: template-refs-dom
title: "Accessing DOM Elements with Template Refs"
topic: advanced-reactivity
kind: api
summary: "Obtain direct references to real DOM elements using the ref attribute and useTemplateRef in Vue 3.5+."
tags: [template-refs, dom, usetemplateref, focus]
related: [component-refs, on-mounted, next-tick]
---
> **In one line:** Template refs provide direct access to real DOM elements after component rendering.

## The idea

While Vue's declarative rendering handles almost all DOM operations automatically, there are legitimate scenarios where you need direct access to raw underlying DOM nodes: focusing an input, scrolling to a specific container offset, or calculating an element's bounding client rectangle.

In Vue templates, you mark target elements using the **`ref` attribute**:

```html
<input ref="inputRef" />
```

In `<script setup>`, Vue 3.5 introduced the clean **`useTemplateRef()`** helper function. You pass the template ref key name, and Vue returns a typed ref that will be automatically populated with the real DOM element once the component mounts!

```tree
Template Ref Lifecycle
  1. Setup phase: inputRef.value is null (DOM doesn't exist yet)
  2. Component mounts: Vue sets inputRef.value = HTMLInputElement
  3. onMounted callback fires: safe to access inputRef.value.focus()
  4. Component unmounts: Vue resets inputRef.value = null
```

## See it

```html
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';

// Vue 3.5+ useTemplateRef helper
const textInput = useTemplateRef<HTMLInputElement>('textInput');

onMounted(() => {
  // Directly focus the input element upon mount
  textInput.value?.focus();
});

function selectAll() {
  textInput.value?.select();
}
</script>

<template>
  <div>
    <input ref="textInput" placeholder="Focused on load" />
    <button @click="selectAll">Select All Text</button>
  </div>
</template>
```

The template ref provides safe, typed access to native DOM APIs like `focus()` and `select()`.

## Go deeper

Prior to Vue 3.5, template refs were declared as a standard `ref(null)` with a variable name matching the `ref` attribute in the template. `useTemplateRef()` is preferred because it decouples variable naming and supports dynamic ref keys.

> **Tip:** Always use optional chaining (`textInput.value?.focus()`) because refs are null until mounting completes.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not access template refs before onMounted; they are guaranteed to be null during synchronous setup.
- Template refs are reset to null when the target element is destroyed by v-if.

## Remember

- Use ref="name" in templates to mark target DOM elements.
- Use useTemplateRef<T>('name') in Vue 3.5+ for type-safe element access.
- Template refs are only populated after the component is mounted in the DOM.
