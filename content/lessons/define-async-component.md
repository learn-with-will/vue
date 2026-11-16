---
slug: define-async-component
title: "Lazy Loading with defineAsyncComponent"
topic: tooling-typescript
kind: api
summary: "Lazy load components on demand using defineAsyncComponent to reduce initial bundle size."
tags: [defineasynccomponent, lazy-loading, code-splitting, performance]
related: [route-level-code-splitting, keep-alive-component, suspense-component]
---
> **In one line:** defineAsyncComponent() loads a component over the network only when it is actually rendered.

## The idea

In large applications, importing heavy components (like rich text editors, markdown previewers, or complex 3D charts) synchronously adds hundreds of kilobytes to your initial JavaScript bundle, slowing down initial page loads.

Vue provides **`defineAsyncComponent()`** to enable lazy loading.

Instead of bundling the component into the main JavaScript chunk, `defineAsyncComponent()` splits it into an independent chunk. The browser only downloads that chunk over the network when the component is actually rendered on screen!

```flow
entry: App.vue loaded @primary
trigger: User clicks "Open Chart" @blue
network: Browser downloads Chart.js chunk @amber
render: Async component mounts in DOM @green
entry -> trigger
trigger -> network
network -> render
```

The function accepts a loader function that returns a Promise resolving to a component (typically an ES dynamic `import()`).

## See it

```html
<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';

const showModal = ref(false);

// Heavy component is only downloaded when showModal becomes true!
const HeavyModal = defineAsyncComponent(() =>
  import('./HeavyModal.vue')
);
</script>

<template>
  <div>
    <button @click="showModal = true">Open Heavy Modal</button>
    <HeavyModal v-if="showModal" @close="showModal = false" />
  </div>
</template>
```

Users who never click "Open Heavy Modal" will never download its code.

## Go deeper

`defineAsyncComponent` can accept an advanced options object with a `loadingComponent`, an `errorComponent`, a `delay`, and a `timeout`.

> **Tip:** Pair `defineAsyncComponent` with `<Suspense>` to coordinate loading spinners cleanly.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not async-load small, trivial components; the network request overhead exceeds the savings.
- Always handle network failure cases with an errorComponent or error boundary.

## Remember

- defineAsyncComponent() splits components into separate on-demand bundles.
- Downloads the chunk only when the component is first mounted.
- Reduces initial application bundle size and speeds up first paint.
