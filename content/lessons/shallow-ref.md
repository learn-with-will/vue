---
slug: shallow-ref
title: "Optimizing Large Objects with shallowRef()"
topic: advanced-reactivity
kind: api
summary: "shallowRef only tracks mutations to the .value property, avoiding deep reactivity overhead for large data sets."
tags: [shallowref, performance, optimization, reactivity]
related: [shallow-reactive, ref-primitive, how-reactivity-works]
---
> **In one line:** shallowRef() tracks only .value reassignment, skipping deep object proxying for performance.

## The idea

Standard `ref()` is deeply reactive: if you pass an object with 10,000 nested items, Vue recursively converts every object and array into a reactive Proxy.

For massive datasets (such as raw JSON payloads from APIs, complex third-party library instances, or three.js / WebGL scene graphs), creating thousands of Proxy wrappers incurs significant memory and CPU overhead.

Vue provides **`shallowRef()`** for performance optimization.

A `shallowRef()` only tracks mutations to its root **`.value` property**:
- `state.value = newObject` **is tracked** and triggers updates.
- `state.value.nestedProperty = 12` is **NOT tracked** and will not trigger re-renders!

```tree
shallowRef Reactivity Boundary
  shallowRef root object
    reassigning root value triggers reactivity @green
    mutating nested property is ignored @amber
```

This provides blazing-fast rendering for large immutable datasets.

## See it

```typescript
import { shallowRef, triggerRef } from 'vue';

// Heavy dataset (e.g. 50,000 table rows)
const largeTable = shallowRef<{ rows: string[] }>({
  rows: ['Row 1', 'Row 2']
});

// Deep mutation does NOT trigger re-renders:
largeTable.value.rows.push('Row 3');

// 1. To trigger updates, replace the root object:
largeTable.value = {
  rows: [...largeTable.value.rows]
};

// 2. OR force an update manually with triggerRef:
triggerRef(largeTable);
```

By bypassing deep Proxy recursion, `shallowRef` loads massive datasets in milliseconds.

## Go deeper

`triggerRef(ref)` forces any effects depending on a `shallowRef` to re-run immediately, even after deep in-place mutations.

> **Tip:** Use `shallowRef` when wrapping third-party class instances (like Chart.js, Leaflet, or Monaco Editor) to prevent Vue from proxying library internals.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Mutating nested properties of a shallowRef will silently fail to update the DOM without triggerRef().
- Do not use shallowRef for small local component state where convenience matters more than microseconds.

## Remember

- shallowRef() only tracks root .value reassignment, bypassing deep proxying.
- Saves memory and CPU when managing massive datasets or external class instances.
- Use triggerRef(myShallowRef) to force a manual reactive update after deep mutations.
