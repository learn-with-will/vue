---
slug: composable-arguments
title: "Flexible Composable Arguments with toValue()"
topic: composables
kind: technique
summary: "Use toValue and MaybeRefOrGetter to accept plain values, refs, or getters as composable arguments."
tags: [tovalue, maybereforgetter, vue-3.3, composables]
related: [fetch-composable, what-is-a-composable, composable-conventions]
since: "3.3"
---
> **In one line:** toValue() normalizes raw values, refs, and getters into plain values for flexible arguments.

## The idea

When authoring composables that accept parameters (like URLs, IDs, or threshold numbers), your consumers might pass:
1. A static raw value: `useTitle('My Page')`
2. A reactive ref: `useTitle(pageTitleRef)`
3. A getter function: `useTitle(() => `Item ${id.value}`)`

Prior to Vue 3.3, supporting all three forms required cumbersome manual checks.

Vue 3.3 introduced two standard primitives to solve this:
- **`MaybeRefOrGetter<T>`**: A TypeScript type that accepts `T | Ref<T> | (() => T)`.
- **`toValue(source)`**: A runtime utility that normalizes any ref, getter, or plain value into its unwrapped current value.

```tree
How toValue() resolves inputs
  toValue(5)                --> returns 5
  toValue(ref(5))           --> returns 5 (reads .value)
  toValue(() => count * 2)  --> returns 10 (invokes getter)
```

Using `toValue()` makes your composables remarkably versatile and user-friendly.

## See it

```typescript
import { watchEffect, toValue, type MaybeRefOrGetter } from 'vue';

// Accept raw number, Ref<number>, or getter function () => number
export function useMultiplier(
  base: MaybeRefOrGetter<number>,
  factor: MaybeRefOrGetter<number>
) {
  watchEffect(() => {
    // toValue seamlessly normalizes all three input styles!
    const result = toValue(base) * toValue(factor);
    console.log('Current multiplied total:', result);
  });
}
```

Now consumers have total flexibility:

```typescript
import { ref } from 'vue';

const price = ref(25);

// Style 1: Static values
useMultiplier(10, 2);

// Style 2: Passing a ref
useMultiplier(price, 4);

// Style 3: Passing a getter expression
useMultiplier(() => price.value + 5, 2);
```

All three calls work seamlessly without any extra conditional logic inside the composable.

## Go deeper

Unlike `unref()` which only unwraps refs, `toValue()` unwraps both refs and executes getter functions, making it the superior choice for composable parameters.

> **Tip:** Pair `toValue()` with `watchEffect` or `watch` so the composable automatically responds to changes in the passed input.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- toValue was introduced in Vue 3.3; verify your project uses Vue 3.3 or higher.
- Do not invoke toValue on things that are not values (like raw objects of methods).

## Remember

- Use MaybeRefOrGetter<T> to type flexible composable input parameters.
- toValue() normalizes raw primitives, refs, and getter functions.
- Allows consumers to pass static values, reactive refs, or computed getters freely.
