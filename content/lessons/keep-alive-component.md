---
slug: keep-alive-component
title: "Caching Components with <KeepAlive>"
topic: tooling-typescript
kind: api
summary: "KeepAlive caches inactive component instances in memory to preserve state across switches."
tags: [keepalive, caching, performance, built-in-components]
related: [define-async-component, v-if-vs-v-show, router-link-view]
---
> **In one line:** <KeepAlive> caches inactive component instances in memory instead of destroying them.

## The idea

When switching between dynamic components or tabs using `v-if` or `<component :is="...">`, Vue's default behavior is to destroy the old component instance and create the new one from scratch.

This means form inputs, scroll positions, and fetched data inside the old component are lost. When the user returns to that tab, everything must be re-rendered and re-fetched.

To preserve component state across switches, wrap dynamic components inside **`<KeepAlive>`**.

`<KeepAlive>` caches inactive component instances in memory without unmounting them. When a component is switched back into view, Vue reactivates the cached instance instantly!

## See it

```html
<script setup lang="ts">
import { shallowRef } from 'vue';
import PostsTab from './PostsTab.vue';
import ArchiveTab from './ArchiveTab.vue';

const currentTab = shallowRef(PostsTab);
</script>

<template>
  <div class="tabs">
    <button @click="currentTab = PostsTab">Posts</button>
    <button @click="currentTab = ArchiveTab">Archive</button>

    <!-- KeepAlive caches inactive tab instances in memory! -->
    <KeepAlive>
      <component :is="currentTab" />
    </KeepAlive>
  </div>
</template>
```

Any text typed into `PostsTab` remains intact even after navigating to `ArchiveTab` and back.

## Go deeper

Cached components gain access to two specialized lifecycle hooks: **`onActivated()`** (called when re-inserted into the DOM) and **`onDeactivated()`** (called when removed).

> **Tip:** Use the `include` and `exclude` props on `<KeepAlive>` to restrict which components are cached by name.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Components cached by KeepAlive do not run onMounted or onUnmounted when switched; use onActivated.
- Use the max prop to prevent uncontrolled memory usage from caching too many components.

## Remember

- <KeepAlive> caches inactive component instances in memory.
- Preserves user input, scroll position, and component state across tab switches.
- Provides onActivated and onDeactivated lifecycle hooks for cached components.
