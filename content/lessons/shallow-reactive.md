---
slug: shallow-reactive
title: "Shallow Reactivity with shallowReactive()"
topic: advanced-reactivity
kind: api
summary: "shallowReactive creates an object where only top-level properties are reactive, leaving nested objects raw."
tags: [shallowreactive, performance, reactivity, objects]
related: [shallow-ref, reactive-objects, to-raw-and-mark-raw]
---
> **In one line:** shallowReactive() creates an object where only top-level properties are reactive.

## The idea

Just as `shallowRef` limits reactivity to the root `.value` reference, **`shallowReactive()`** limits reactivity to the **root properties of a reactive object**.

In a `shallowReactive` object:
- Reading or mutating top-level properties (e.g. `state.count = 1`) is reactive and triggers DOM updates.
- Nested objects and arrays (e.g. `state.nested.value = 2`) remain **plain, un-proxied JavaScript objects**. Mutating them will not be tracked.

```tree
shallowReactive Boundary
  shallowReactive state
    top-level properties are reactive @green
    nested object properties are plain and untracked @amber
```

This is ideal for state objects containing external instances, SDK clients, or immutable configuration trees.

## See it

```typescript
import { shallowReactive } from 'vue';

const state = shallowReactive({
  activeTab: 'home', // Top-level: reactive!
  settings: {
    theme: 'dark'    // Nested: plain non-reactive object!
  }
});

// Mutating top-level property triggers Vue updates:
state.activeTab = 'profile';

// Mutating nested property does NOT trigger updates:
state.settings.theme = 'light';
```

The top-level `activeTab` property updates the UI normally, while `settings` incurs zero Proxy overhead.

## Go deeper

Unlike `shallowRef`, there is no `triggerReactive` utility. If you need to force updates on deep mutations, prefer `shallowRef` paired with `triggerRef`.

> **Tip:** `shallowReactive` is great for root application stores holding multiple independent large datasets.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Nested objects inside shallowReactive retain their raw identity and do not trigger reactivity.
- Do not mix deep and shallow reactivity expectations within the same component hierarchy.

## Remember

- shallowReactive() proxies only the root properties of an object.
- Nested objects remain raw JavaScript objects with zero reactivity overhead.
- Top-level mutations trigger updates; nested mutations do not.
