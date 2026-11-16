---
slug: unref-and-is-ref
title: "Reactivity Utilities: isRef and unref"
topic: advanced-reactivity
kind: api
summary: "Inspect and unwrap values defensively using isRef and unref in generic composable logic."
tags: [isref, unref, reactivity, type-narrowing]
related: [ref-primitive, to-ref-and-to-refs, composable-arguments]
---
> **In one line:** isRef() checks if a value is a ref; unref() unwraps .value if it is a ref, or returns it as-is.

## The idea

When writing generic utilities or reusable composables, you often do not know whether the consumer passed a raw primitive value or a Vue `Ref`.

Writing manual checks like `if (val && val._isRef) val.value` is verbose and error-prone.

Vue provides two built-in utilities:
- **`isRef(val)`:** A type guard that returns `true` if the value is a Vue ref object, narrowing the TypeScript type to `Ref<T>`.
- **`unref(val)`:** A convenience helper that returns `val.value` if `val` is a ref, or returns `val` as-is if it is not.

```tree
unref() Evaluation
  unref(ref(10))  --> reads .value --> returns 10
  unref(10)       --> not a ref    --> returns 10
```

`unref(val)` is equivalent to: `isRef(val) ? val.value : val`.

## See it

```typescript
import { ref, isRef, unref } from 'vue';

const countRef = ref(42);
const plainNumber = 100;

// 1. isRef checks identity
console.log(isRef(countRef));    // true
console.log(isRef(plainNumber)); // false

// 2. unref normalizes access
function printValue(input: number | ReturnType<typeof ref<number>>) {
  // Unwraps ref if present, otherwise returns number directly
  const value = unref(input);
  console.log('Unwrapped numeric value:', value);
}

printValue(countRef);    // 42
printValue(plainNumber); // 100
```

`printValue` handles both raw values and reactive refs with equal ease.

## Go deeper

While `unref` handles values and refs, modern Vue 3.3+ provides `toValue()`, which additionally evaluates getter functions (`() => val`). Prefer `toValue()` for composable parameters.

> **Tip:** Use `isRef` in defensive code to determine whether to attach a `watch` listener to a parameter.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- unref does not unwrap reactive() proxy objects; it only operates on refs.
- unref does not evaluate getter functions; use toValue() if supporting getters.

## Remember

- isRef(val) returns true if the input is a Vue ref object.
- unref(val) is sugar for isRef(val) ? val.value : val.
- Enables polymorphic functions that accept either raw values or reactive refs.
