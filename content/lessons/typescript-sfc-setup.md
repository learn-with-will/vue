---
slug: typescript-sfc-setup
title: "Enabling TypeScript in SFCs with lang="ts""
topic: tooling-typescript
kind: technique
summary: "Enable TypeScript checking inside Single-File Components using <script setup lang="ts">."
tags: [typescript, sfc, setup, tooling]
related: [typing-props-emits, typing-refs, type-checking-vue-tsc]
---
> **In one line:** Add lang="ts" to <script setup> to unlock full TypeScript type checking and autocomplete.

## The idea

Vue 3 was written completely from scratch in TypeScript, providing the finest TypeScript integration of any modern UI framework.

To enable TypeScript in a Single-File Component, add **`lang="ts"`** to the `<script setup>` opening tag:

```html
<script setup lang="ts">
// Full TypeScript syntax is enabled!
</script>
```

With `lang="ts"` enabled:
1. You can use TypeScript type annotations, interfaces, generics, and enums.
2. The template compiler type-checks expressions against the declared types.
3. Code editors provide instant autocompletion, refactoring, and inline error diagnostics.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

interface User {
  id: string;
  name: string;
  role: 'admin' | 'viewer';
}

const user = ref<User>({
  id: 'u-1',
  name: 'Ada Lovelace',
  role: 'admin'
});
</script>

<template>
  <div>
    <h3>{{ user.name }}</h3>
    <p>Role: {{ user.role }}</p>
    <button @click="user.role = 'viewer'">Switch Role</button>
  </div>
</template>
```

Passing an invalid role string like `'superuser'` triggers an instant compile-time error.

## Go deeper

TypeScript interfaces declared in `<script setup lang="ts">` can be exported and imported by other files using standard ES module syntax.

> **Tip:** Use the official **Vue - Official** VS Code extension for the best TypeScript editing experience in `.vue` files.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Forgetting lang="ts" causes TypeScript syntax like interface or type annotations to throw parse errors.
- Ensure your project tsconfig.json includes "moduleResolution": "bundler" or "node".

## Remember

- Add lang="ts" to <script setup> to activate TypeScript in SFCs.
- Enables interfaces, type annotations, and strict template expression checking.
- Seamlessly supported by Vite and the Vue Official editor extension.
