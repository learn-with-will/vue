---
slug: typing-props-emits
title: "Typing Props and Emits with TypeScript"
topic: tooling-typescript
kind: technique
summary: "Use pure TypeScript type arguments for defineProps and defineEmits for strict compile-time checking."
tags: [props, emits, typescript, types]
related: [typescript-sfc-setup, typing-props, define-emits]
---
> **In one line:** Type defineProps<Props>() and defineEmits<Emits>() with TypeScript interfaces.

## The idea

While Vue supports runtime prop and emit definitions, TypeScript developers should always use **type-based declarations**.

Instead of writing runtime objects with constructors, you supply a generic type argument:

```typescript
// Props:
const props = defineProps<{
  title: string;
  count?: number;
}>();

// Emits:
const emit = defineEmits<{
  change: [id: string];
  update: [value: number];
}>();
```

The Vue compiler inspects these type parameters at build time and automatically synthesizes runtime validations, ensuring you never have to duplicate type information twice!

## See it

```html
<!-- ProductCard.vue -->
<script setup lang="ts">
export interface Props {
  id: string;
  title: string;
  price: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  addToCart: [id: string, qty: number];
}>();
</script>

<template>
  <div class="product">
    <h4>{{ title }} - ${{ price }}</h4>
    <button @click="emit('addToCart', props.id, 1)">Add</button>
  </div>
</template>
```

Parent templates receive full TypeScript autocompletion and prop validation when using `<ProductCard />`.

## Go deeper

In Vue 3.3+, you can import external types and interfaces directly into `defineProps<ImportedInterface>()` without compiler limitations!

> **Tip:** Use named tuple syntax for emits: `defineEmits<{ (e: 'save', payload: string): void }>` or `defineEmits<{ save: [payload: string] }>()`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not supply both runtime arguments and generic type parameters to defineProps; pick one.
- Ensure all optional props in the interface have corresponding defaults in withDefaults().

## Remember

- Use defineProps<T>() for type-only prop declarations.
- Use defineEmits<T>() for type-only event and payload declarations.
- In Vue 3.3+, imported types can be used directly inside defineProps.
