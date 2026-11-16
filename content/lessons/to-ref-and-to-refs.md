---
slug: to-ref-and-to-refs
title: "Reactivity Utilities: toRef and toRefs"
topic: advanced-reactivity
kind: api
summary: "Convert reactive object properties into individual refs while maintaining two-way reactive connections."
tags: [toref, torefs, reactivity, destructuring]
related: [ref-vs-reactive, reactive-objects, unref-and-is-ref]
---
> **In one line:** toRef() and toRefs() convert reactive object properties into linked, destructure-safe refs.

## The idea

As discussed in the `ref` vs `reactive` lesson, destructuring a reactive object disconnects the extracted variables from Vue's reactivity tracking.

Vue provides two essential utilities to solve this:
1. **`toRefs(object)`:** Converts an entire reactive object into a plain object where every single property is a `Ref` pointing back to the original source.
2. **`toRef(object, 'key')`:** Converts a single specific property of a reactive object into a `Ref`.

```tree
toRefs Conversion
  reactive state object
    toRefs converts properties into individual Refs
      destructuring { count, title } preserves reactivity
```

Crucially, these returned refs maintain a **two-way connection**: mutating the ref updates the source object property, and mutating the source object updates the ref!

## See it

```typescript
import { reactive, toRefs, toRef } from 'vue';

const state = reactive({
  count: 0,
  username: 'Ada'
});

// 1. toRefs: Safe to destructure!
const { count, username } = toRefs(state);

// Mutating the destructured ref updates state:
count.value++;
console.log(state.count); // 1

// Mutating state updates the destructured ref:
state.username = 'Grace';
console.log(username.value); // 'Grace'

// 2. toRef: Create a ref for a single property
const userRef = toRef(state, 'username');
userRef.value = 'Linus';
console.log(state.username); // 'Linus'
```

Both properties remain in perfect two-way synchronization with the parent `state` object.

## Go deeper

In Vue 3.3+, `toRef()` was enhanced: you can pass a getter function to create a read-only ref: `const double = toRef(() => state.count * 2)`.

> **Tip:** Use `toRefs` when writing composables that accept reactive objects or props, so consumers can destructure your return object cleanly.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Passing a plain non-reactive object to toRefs will create refs that do NOT update reactively.
- Do not confuse toRef (singular, single key) with toRefs (plural, all keys).

## Remember

- toRefs() converts all properties of a reactive object into individual refs.
- Destructuring the output of toRefs preserves full two-way reactivity.
- toRef() extracts a single property into a linked ref.
