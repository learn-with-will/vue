---
slug: defining-components
title: "Defining Components with <script setup>"
topic: components
kind: concept
summary: "Define modern Vue components using <script setup> single-file components for concise logic."
tags: [components, script-setup, sfc, composition-api]
related: [importing-components, component-naming, define-props]
---
> **In one line:** <script setup> is the concise syntactic sugar for using the Composition API in Single-File Components.

## The idea

Components are the foundational building blocks of modern user interfaces. A complex web application is constructed as a nested tree of components: buttons, cards, modal dialogs, and navigation headers.

In Vue 3, the standard way to author components is inside a Single-File Component using **`<script setup>`**.

`<script setup>` is compile-time syntactic sugar that executes every time an instance of the component is created. It offers major ergonomic advantages over standard `setup()`:

```tree
Advantages of <script setup>
  Top-level bindings exposed
    [No return statement] Variables, functions, and imports usable in template directly @green
  Compiler macros
    [Zero runtime cost] defineProps, defineEmits compiled away @blue
  Superior TypeScript support
    [Pure types] Props and emits typed with pure TypeScript interfaces @blue
```

Any top-level variable, function, or imported utility declared inside `<script setup>` can be used directly in the companion `<template>` block without any manual return object.

## See it

```html
<!-- UserCard.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const isExpanded = ref(false);

function toggle() {
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <div class="user-card">
    <h3>Ada Lovelace</h3>
    <button @click="toggle">
      {{ isExpanded ? 'Hide Details' : 'Show Details' }}
    </button>
    <p v-if="isExpanded">Pioneer of computer programming.</p>
  </div>
</template>
```

Variables like `isExpanded` and methods like `toggle` are immediately accessible in the template.

## Go deeper

Behind the scenes, Vue's compiler transforms `<script setup>` into a standard component `setup()` function, optimizing variable lookups to avoid unnecessary object wrapper allocations.

> **Tip:** You do not need to export anything from `<script setup>`; the component itself is the default export.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not include an export default statement inside <script setup>.
- Code in <script setup> executes on every component instance creation, not once globally.

## Remember

- <script setup> is the standard syntax for modern Vue 3 components.
- Top-level variables, functions, and imports are automatically exposed to templates.
- Eliminates boilerplate return statements and enhances TypeScript performance.
