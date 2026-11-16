---
slug: lifecycle-hooks
title: "Component Lifecycle Hooks"
topic: lifecycle-watchers
kind: concept
summary: "Lifecycle hooks let you execute custom logic at distinct phases of a component lifetime."
tags: [lifecycle, hooks, composition-api, architecture]
related: [on-mounted, on-unmounted, watch-source]
---
> **In one line:** Lifecycle hooks run your code at key moments: creation, mounting, updating, and unmounting.

## The idea

Every Vue component instance traverses a well-defined lifecycle as it is created, mounted to the DOM, updated when reactive dependencies change, and finally unmounted when removed from the page.

In the Composition API, you tap into these stages using imported **lifecycle hook functions** prefixed with `on`.

```sequence
actor setup: Setup | script setup
actor dom: DOM | document body @blue
setup -> dom: onBeforeMount
note dom: Component inserted into DOM @green
dom -> setup: onMounted
note dom: Reactive state changes @blue
setup -> dom: onBeforeUpdate / onUpdated
note dom: Component removed @amber
dom -> setup: onBeforeUnmount / onUnmounted
```

The most essential hooks are **`onMounted`** (when the DOM is accessible) and **`onUnmounted`** (when tearing down timers and event listeners). You can register multiple hooks of the same type within a single component, which composables use to manage their own cleanup.

## See it

```typescript
import {
  ref,
  onMounted,
  onUpdated,
  onUnmounted
} from 'vue';

const count = ref(0);

onMounted(() => {
  console.log('Component is now mounted in the DOM!');
});

onUpdated(() => {
  console.log('DOM re-rendered with new count:', count.value);
});

onUnmounted(() => {
  console.log('Component removed from DOM; cleaned up resources.');
});
```

Each hook is registered during synchronous `setup()` execution and automatically triggers at the corresponding lifecycle stage.

## Go deeper

Notice there is no `onCreated` or `onBeforeCreate` hook in the Composition API. The code written directly in `<script setup>` executes during the component creation phase itself.

> **Tip:** You can invoke lifecycle hooks inside external composable functions, allowing reusable logic to attach its own mounting and cleanup routines.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Lifecycle hooks must be called synchronously inside setup() or <script setup>.
- Calling onMounted inside an asynchronous setTimeout or after an await will fail to bind to the component instance.

## Remember

- Lifecycle hooks tap into mounting, updating, and unmounting phases.
- <script setup> body acts as the creation phase; no onCreated hook is needed.
- Hooks must be registered synchronously during component setup.
