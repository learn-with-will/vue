---
slug: composable-conventions
title: "Composable Best Practices and Conventions"
topic: composables
kind: pattern
summary: "Master standard Vue composable conventions: return objects of refs, synchronous execution, and cleanup."
tags: [best-practices, conventions, destructuring, composables]
related: [what-is-a-composable, mouse-tracker-composable, composable-arguments]
---
> **In one line:** Return plain objects of refs from composables to preserve reactivity during destructuring.

## The idea

The Vue core team and community have established strict best practices for authoring composables. Following these conventions ensures your composables behave predictably and integrate cleanly across any codebase.

Key rules for composable design:

```tree
Composable Best Practices
  1. Return plain objects of refs
    [Destructuring safe] Consumers can use const { x, y } = useMouse() safely @green
  2. Naming convention
    [usePrefix] Always start function names with "use" in camelCase @blue
  3. Synchronous execution
    [Lifecycle bound] Must be invoked in synchronous setup() scope @blue
  4. Encapsulate cleanup
    [No leaks] Clean up all event listeners and timers in onUnmounted @amber
```

The most crucial rule is **always returning a plain object of refs** rather than a single `reactive()` object. A plain object allows consumers to destructure only the specific properties they need while maintaining full reactivity.

## See it

```typescript
// GOOD: Return a plain object of refs
export function useWindowSize() {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);

  return { width, height };
}

// IN CONSUMER: Destructuring works flawlessly!
// const { width } = useWindowSize(); // width remains reactive!

// BAD: Returning a reactive object
export function useBadWindowSize() {
  const size = reactive({ width: window.innerWidth });
  return size;
}

// IN CONSUMER: Destructuring destroys reactivity!
// const { width } = useBadWindowSize(); // width is now a static number!
```

Returning plain objects containing refs makes your composables completely robust against destructuring bugs.

## Go deeper

If a composable accepts options, pass them as an optional options object as the final parameter: `useFetch(url, options = { immediate: true })`.

> **Tip:** If a composable performs side effects only on the client (like accessing `window`), check `typeof window !== 'undefined'` for Nuxt SSR safety.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Never return a reactive() object directly from a composable without converting it with toRefs().
- Never invoke composables conditionally inside if blocks or inside click event handlers.

## Remember

- Always return a plain JavaScript object containing individual refs.
- This guarantees that consumers can destructure properties without losing reactivity.
- Always invoke composables synchronously at the top level of <script setup>.
