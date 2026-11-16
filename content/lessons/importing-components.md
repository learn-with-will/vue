---
slug: importing-components
title: "Importing and Using Child Components"
topic: components
kind: technique
summary: "Import child components in <script setup> and use them directly in templates without registration."
tags: [components, imports, composition, dx]
related: [defining-components, component-naming, define-props]
---
> **In one line:** In <script setup>, imported components can be used directly in templates without registration.

## The idea

In older versions of Vue and the Options API, using a child component required two tedious steps: importing the component file, and manually registering it in a `components: { ChildComponent }` options dictionary.

In modern Vue with `<script setup>`, **imported components are automatically registered**. When you import a `.vue` component file, the imported variable can be used directly in your template as a custom tag:

```html
<script setup lang="ts">
// Simply import it:
import ChildButton from './ChildButton.vue';
</script>

<template>
  <!-- Use it directly as a tag! -->
  <ChildButton />
</template>
```

This matches the mental model of JavaScript modules: you import a symbol, and you use it. It makes refactoring and moving components fast and frictionless.

## See it

```html
<!-- App.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import UserBadge from './UserBadge.vue';
import ActionButton from './ActionButton.vue';

const activeUser = ref('Ada Lovelace');
</script>

<template>
  <div class="dashboard">
    <UserBadge :username="activeUser" />
    <ActionButton @click="console.log('Action performed!')">
      Confirm Action
    </ActionButton>
  </div>
</template>
```

Both `UserBadge` and `ActionButton` are imported and rendered in the template with zero registration boilerplate.

## Go deeper

Dynamic component rendering is also effortless: you can pass an imported component object directly to the built-in `<component :is="ActiveComponent">` tag.

> **Tip:** Self-closing tags like `<UserBadge />` are valid and recommended in Single-File Components when the element has no child content.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Components must be imported with their .vue file extension (e.g. import Card from './Card.vue').
- Never attempt to register components inside a components: {} block when using <script setup>.

## Remember

- Imported components in <script setup> are automatically usable in templates.
- No components: {} registration block is required.
- Use PascalCase for component tags to distinguish them from native HTML elements.
