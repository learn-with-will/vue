---
slug: generic-components
title: "Generic Components with generic="T""
topic: tooling-typescript
kind: technique
summary: "Author generic components in Vue 3.3+ using the generic attribute on script setup."
tags: [generics, generic-components, vue-3.3, typescript]
related: [typescript-sfc-setup, typing-props-emits, scoped-slots]
since: "3.3"
---
> **In one line:** Use <script setup lang="ts" generic="T"> to author components that accept generic types.

## The idea

When building reusable data table, select, or dropdown components, you want the component to accept items of *any* type `T`, while preserving that exact type for props, emits, and scoped slots.

In standard TypeScript functions, you use generic type parameters: `function select<T>(items: T[])`.

Starting in Vue 3.3, you can use the **`generic` attribute** on `<script setup>`:

```html
<script setup lang="ts" generic="T extends { id: string }">
defineProps<{
  items: T[];
  selectedItem?: T;
}>();
</script>
```

When a parent uses the component, TypeScript infers the concrete type of `T` from the passed `:items` prop!

## See it

```html
<!-- DataDropdown.vue -->
<script setup lang="ts" generic="T extends { id: string; label: string }">
defineProps<{
  items: T[];
  modelValue?: T;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', item: T): void;
}>();
</script>

<template>
  <ul class="dropdown">
    <li
      v-for="item in items"
      :key="item.id"
      @click="emit('update:modelValue', item)"
    >
      <!-- Scoped slot preserves exact type T! -->
      <slot :item="item">{{ item.label }}</slot>
    </li>
  </ul>
</template>
```

When a parent passes a list of `User` objects, the `#default="{ item }"` slot automatically knows `item` is a `User`!

## Go deeper

You can specify multiple generic parameters separated by commas: `generic="T, K extends keyof T"`.

> **Tip:** You can add generic constraints like `extends string | number` to narrow acceptable inputs.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- The generic attribute requires Vue 3.3 or higher.
- Avoid overly complex generic constraints that make template debugging difficult.

## Remember

- <script setup lang="ts" generic="T"> creates a generic Vue component.
- TypeScript infers T automatically from the props passed by the parent.
- Preserves strict type safety across props, emits, and scoped slots.
