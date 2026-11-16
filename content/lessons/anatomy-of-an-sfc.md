---
slug: anatomy-of-an-sfc
title: "Anatomy of a Single-File Component"
topic: foundations
kind: concept
summary: "A Single-File Component encapsulates template, script setup, and scoped style in one unified .vue file."
tags: [sfc, template, script-setup, scoped-style]
related: [what-is-vue, defining-components, scoped-styles]
---
> **In one line:** A Single-File Component (.vue) bundles template, script setup, and scoped styles in one file.

## The idea

In traditional web development, HTML markup, JavaScript logic, and CSS stylesheets were separated into three distinct files. In component-driven architectures, however, a component represents a cohesive visual and behavioral unit: a button, a user avatar, or a navigation drawer.

Vue embraces this cohesion through the **Single-File Component** (SFC), saved with a `.vue` extension. An SFC packages the three fundamental building blocks of a component together:

| Block | Role | Highlights |
|---|---|---|
| `<script setup>` | Component logic & state | Standard JavaScript/TypeScript execution |
| `<template>` | Component layout & markup | Declarative HTML with Vue directives |
| `<style scoped>` | Component styling | CSS automatically scoped to this element |

Because all three concerns live in one file, you never have to jump between distant folders to understand how a component works or what styles affect it.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const isOnline = ref(true);
</script>

<template>
  <div class="status-badge" :class="{ online: isOnline }">
    <span>{{ isOnline ? 'Active' : 'Offline' }}</span>
  </div>
</template>

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 9999px;
  background-color: #eee;
}
.online {
  background-color: #d1f4e2;
  color: #1f8a60;
}
</style>
```

Here all three blocks work in concert. The template uses state from `<script setup>`, and `<style scoped>` styles the markup without leaking to other components.

## Go deeper

The `<script setup>` tag is a compile-time syntactic sugar. Top-level variables and imported components declared within it are automatically exposed to the template without manual return statements.

> **Note:** The build tool (Vite) extracts the `<style>` block and compiles the `<template>` into an optimized render function.

## Watch out

- Each .vue file can contain at most one <template> and at most one <script setup> block.
- Browser engines cannot execute .vue files directly; they must be compiled by a bundler like Vite.

## Remember

- An SFC encapsulates template, script setup, and scoped styles in a single .vue file.
- <script setup> automatically exposes top-level bindings to the template.
- Scoped styles prevent CSS rules from leaking to other components.
