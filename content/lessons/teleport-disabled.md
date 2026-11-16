---
slug: teleport-disabled
title: "Conditional Teleport with :disabled"
topic: advanced-reactivity
kind: technique
summary: "Conditionally disable teleporting using the disabled prop to adapt layouts between mobile and desktop."
tags: [teleport, responsive, disabled-prop, layout]
related: [teleport-basics, transition-basics, keep-alive-component]
---
> **In one line:** Use <Teleport :disabled="isMobile"> to conditionally disable teleportation on small screens.

## The idea

While modal dialogs should always be teleported to `body`, other components need responsive placement:
- On desktop screens, a filter sidebar should remain in-place inside the page layout grid.
- On mobile devices, that same filter sidebar should be teleported to `body` as a full-screen drawer overlay.

Instead of writing two duplicate components with conditional `v-if` statements, you can use the **`disabled` prop** on `<Teleport>`.

```html
<Teleport to="body" :disabled="isDesktop">
  <FilterDrawer />
</Teleport>
```

When `:disabled="true"`, Vue leaves the element right where it was declared inside the parent component. When `:disabled="false"`, Vue teleports it to the target container.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';
const isMobile = ref(false);
</script>

<template>
  <div class="page-layout">
    <button @click="isMobile = !isMobile">Toggle Layout</button>
    <!-- Teleported to body on mobile; stays in-place on desktop -->
    <Teleport to="body" :disabled="!isMobile">
      <aside class="sidebar-panel">
        <h3>Filters</h3>
        <p>Active filter list</p>
      </aside>
    </Teleport>
    <main class="main-content">
      <h2>Products List</h2>
    </main>
  </div>
</template>
```

On desktop, the sidebar renders inside `.page-layout`; on mobile, it teleports to `body` to function as an overlay.

## Go deeper

Switching the `disabled` prop dynamically causes Vue to move the existing DOM nodes between destinations without destroying component state.

> **Tip:** Pair dynamic `<Teleport :disabled>` with media query composables for clean responsive component architectures.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Ensure CSS styles adapt properly when switching between in-place and teleported states.
- The destination element must exist even when disabled is initially true.

## Remember

- <Teleport :disabled="condition"> conditionally toggles teleportation.
- When disabled is true, markup renders in-place in its original parent container.
- Ideal for responsive layouts that switch between inline panels and mobile modals.
