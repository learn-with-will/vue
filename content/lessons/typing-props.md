---
slug: typing-props
title: "Typing Props with TypeScript"
topic: components
kind: technique
summary: "Use pure TypeScript generic type arguments with defineProps and withDefaults for compile-time safety."
tags: [props, typescript, withdefaults, type-safety]
related: [define-props, prop-validation, one-way-data-flow]
---
> **In one line:** Use defineProps<Props>() with withDefaults() for type-safe props with default values.

## The idea

When writing Vue with TypeScript, declaring props using runtime objects (like `{ title: String }`) is repetitive and less expressive than native TypeScript interfaces.

Vue 3 allows you to declare props using **type-only generic arguments**:

```typescript
const props = defineProps<{
  title: string;
  count?: number;
  tags: string[];
}>();
```

The Vue compiler inspects the TypeScript interface at build time and automatically generates the appropriate runtime prop options.

To assign default values to optional props when using type-based declaration, Vue provides the companion **`withDefaults()`** compiler macro.

## See it

```html
<!-- UserBadge.vue -->
<script setup lang="ts">
export interface UserBadgeProps {
  name: string;
  role?: string;
  avatarUrl?: string;
  badgeCount?: number;
}

// withDefaults supplies fallback values for optional props
const props = withDefaults(defineProps<UserBadgeProps>(), {
  role: 'Member',
  avatarUrl: '/images/default-avatar.png',
  badgeCount: 0
});
</script>

<template>
  <div class="badge">
    <img :src="avatarUrl" :alt="name" />
    <span>{{ name }} ({{ role }})</span>
    <span v-if="badgeCount > 0" class="count">{{ badgeCount }}</span>
  </div>
</template>
```

Parents get full TypeScript autocompletion and compile-time type errors if required props like `name` are omitted or given the wrong type.

## Go deeper

In Vue 3.5+, reactive prop destructuring is fully supported: you can write `const { role = 'Member' } = defineProps<UserBadgeProps>()` and `role` remains completely reactive!

> **Tip:** Export your props interface so parent components and unit test files can import and reuse the type definition.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- withDefaults is also a compiler macro and does not need to be imported from 'vue'.
- Complex default values (arrays/objects) in withDefaults should be returned from arrow functions: () => []

## Remember

- defineProps<PropsInterface>() provides compile-time TypeScript type checking.
- Pair with withDefaults() to declare default values for optional props.
- Eliminates duplicate runtime type declarations.
