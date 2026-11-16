---
slug: reactive-objects
title: "Reactive Objects with reactive()"
topic: reactivity
kind: api
summary: "reactive wraps objects in a JavaScript Proxy for deep reactivity without requiring .value."
tags: [reactive, proxy, deep-reactivity, objects]
related: [ref-primitive, ref-vs-reactive, to-ref-and-to-refs]
---
> **In one line:** reactive() wraps objects in a deep Proxy so properties can be accessed directly without .value.

## The idea

While `ref()` is universal, Vue also provides **`reactive()`**, an alternative API tailored specifically for objects, arrays, and collection types like Map and Set.

Instead of wrapping the value in a `.value` container, `reactive()` returns a **JavaScript Proxy** of the original object. Because it is a Proxy, you can read and mutate properties directly without referencing `.value`.

```flow
obj: Plain object { count: 0 } @neutral
proxy: Proxy via reactive() @primary
dom: DOM / Computed @green
obj -> proxy: wrapped
proxy -> dom: get/set traps intercept mutations
```

The reactivity is **deep by default**: any nested object or array accessed within a reactive object is also automatically converted into a reactive Proxy. When you change `state.user.profile.age`, Vue detects the mutation and triggers updates.

## See it

```typescript
import { reactive } from 'vue';

interface UserState {
  name: string;
  preferences: {
    theme: 'light' | 'dark';
  };
}

const state = reactive<UserState>({
  name: 'Ada',
  preferences: {
    theme: 'dark'
  }
});

// Mutate properties directly without .value:
state.name = 'Grace';
state.preferences.theme = 'light';
```

Property access and reassignment feel like manipulating standard JavaScript objects, but every read and write is intercepted by Proxy handlers.

## Go deeper

Because `reactive()` returns a Proxy, the proxy is not equal by reference to the raw original object (`state !== rawObject`). Always interact exclusively with the returned proxy.

> **Note:** `reactive()` cannot wrap primitive values like strings or numbers; attempting to pass `reactive(0)` throws a runtime warning.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Never pass primitive values (string, number, boolean) to reactive(); use ref() instead.
- Reassigning the whole reactive object breaks the reactive proxy connection.

## Remember

- reactive() returns a Proxy that intercepts property reads and writes.
- Properties are accessed directly without .value in both script and template.
- Reactivity is deep: nested objects and arrays are automatically Proxies.
