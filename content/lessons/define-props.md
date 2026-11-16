---
slug: define-props
title: "Declaring Props with defineProps"
topic: components
kind: api
summary: "defineProps declares the custom inputs a component accepts from its parent."
tags: [props, defineprops, macro, communication]
related: [typing-props, one-way-data-flow, prop-validation]
---
> **In one line:** defineProps() declares the input properties a component accepts from its parent.

## The idea

Components need to receive data from their parents to be reusable. In Vue, these inputs are called **props** (short for properties).

In `<script setup>`, you declare which props your component accepts using the **`defineProps`** compiler macro.

`defineProps` is a **compile-time macro**:
- You do **not** need to import it (it is globally available in `<script setup>`).
- It is processed away when the SFC is compiled.
- It returns an object containing the resolved props for access inside JavaScript.

```flow
parent: Parent Component @primary
child: Child Component @green
template: Child Template @blue
parent -> child: passes :title and :count props
child -> template: renders props in template
```

In your template, declared props are automatically exposed directly by name: you can write `{{ title }}` directly without prefixing with `props.`.

## See it

```html
<!-- StatusCard.vue -->
<script setup lang="ts">
// Runtime declaration syntax
const props = defineProps({
  title: String,
  likes: Number,
  isPublished: Boolean
});

console.log('Component initialized with title:', props.title);
</script>

<template>
  <div class="card">
    <!-- Props are exposed directly in template: -->
    <h3>{{ title }}</h3>
    <p>Likes: {{ likes }}</p>
    <span v-if="isPublished" class="badge">Live</span>
  </div>
</template>
```

The parent passes data: `<StatusCard title="Vue Bites" :likes="42" is-published />`.

## Go deeper

Props declared with camelCase in JavaScript (like `isPublished`) can be passed using either camelCase or kebab-case in templates (`:is-published`), matching HTML convention.

> **Tip:** If you only need to use props in the template, you do not even need to assign the return value of `defineProps()` to a variable.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- defineProps is a compiler macro; do NOT import it from 'vue'.
- Props are read-only; never assign a new value to props.title inside the child.

## Remember

- defineProps declares the input parameters accepted by a component.
- It is a compiler macro that does not need to be imported.
- Props are directly accessible in templates by their property name.
