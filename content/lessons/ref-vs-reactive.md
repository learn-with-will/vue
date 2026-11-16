---
slug: ref-vs-reactive
title: "ref() vs reactive()"
topic: reactivity
kind: pattern
summary: "Understand the architectural trade-offs between ref and reactive, and why ref is the recommended default."
tags: [ref, reactive, best-practices, trade-offs]
related: [ref-primitive, reactive-objects, to-ref-and-to-refs]
---
> **In one line:** ref() is the recommended default because it handles all data types and survives destructuring.

## The idea

A classic debate for Vue developers is choosing between `ref()` and `reactive()`. While both APIs create reactive state, they exhibit critical architectural trade-offs.

`reactive()` has significant limitations:
1. **Type limitations:** It only works on objects, arrays, and collections. It cannot wrap primitive numbers, strings, or booleans.
2. **Cannot replace the object:** Reassigning the variable replaces the proxy and disconnects reactivity.
3. **Destructuring caveat:** Destructuring properties (e.g. `const { name } = state`) disconnects the variable from the proxy traps.

| Capability | ref() | reactive() |
|---|---|---|
| Accepts primitives | Yes (string, number, etc.) | No (objects/arrays only) |
| Syntax in JS | `variable.value` | `state.property` |
| Syntax in template | `variable` (auto-unwrapped) | `state.property` |
| Destructuring safe | Yes (refs can be passed freely) | No (loses reactivity without `toRefs`) |

Because `ref()` works everywhere and never silently loses reactivity during destructuring or function returns, the official Vue documentation recommends **`ref()` as the primary default**.

## See it

```typescript
import { ref, reactive } from 'vue';

// Caveat with reactive: destructuring loses reactivity
const state = reactive({ count: 0 });
let { count } = state; // count is now a static number!
count++; // Does NOT trigger Vue reactivity

// With ref: destructuring an object of refs preserves reactivity
const x = ref(0);
const y = ref(0);
const position = { x, y };

const { x: currentX } = position;
currentX.value++; // Still fully reactive!
```

Using `ref()` ensures consistent behavior across composables, function arguments, and component state.

## Go deeper

If you prefer the clean dot-syntax of `reactive()`, you can still use it for complex local form state. Just remember to convert it using `toRefs(state)` before destructuring.

> **Tip:** Standardize on `ref()` across your team to avoid the cognitive overhead of deciding on an API for every variable.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not destructure properties from a reactive() object without toRefs().
- Do not replace an entire reactive object with Object.assign unless you understand the mutation implications.

## Remember

- ref() works for all types; reactive() only works for objects and collections.
- Destructuring reactive() breaks reactivity unless converted with toRefs().
- ref() is the officially recommended default for modern Vue 3.
