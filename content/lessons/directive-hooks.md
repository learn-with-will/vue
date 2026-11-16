---
slug: directive-hooks
title: "Directive Lifecycle Hooks"
topic: tooling-typescript
kind: api
summary: "Tap into directive lifecycle hooks: created, beforeMount, mounted, beforeUpdate, updated, and unmounted."
tags: [directives, lifecycle, hooks, dom]
related: [custom-directives-basics, directive-binding-values, lifecycle-hooks]
---
> **In one line:** Directive hook objects mirror component lifecycles: created, mounted, updated, unmounted.

## The idea

A custom directive is defined as an object containing lifecycle hook functions. These hooks closely mirror the component lifecycle:

| Hook | When it executes |
|---|---|
| `created(el, binding, vnode)` | Before element attributes or event listeners are applied |
| `beforeMount` | When element is inserted into DOM, before parent mount |
| `mounted` | Once element is bound and present in the DOM |
| `beforeUpdate` | Before the containing component updates |
| `updated` | After the containing component and its children have updated |
| `beforeUnmount` | Before the containing component is unmounted |
| `unmounted` | After the element has been removed from the DOM |

All hooks receive `(el, binding, vnode, prevVnode)`, giving you complete control over DOM setup, updates, and cleanup.

## See it

```typescript
import type { Directive } from 'vue';

export const vClickOutside: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    // 1. Setup: attach click listener to document
    const handler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value(); // Invoke callback when clicking outside
      }
    };
    (el as any).__clickOutsideHandler__ = handler;
    document.addEventListener('click', handler);
  },
  unmounted(el) {
    // 2. Teardown: remove listener to prevent leaks
    document.removeEventListener('click', (el as any).__clickOutsideHandler__);
  }
};
```

Using it on a dropdown element: `<div v-click-outside="closeMenu">`. When the user clicks outside, `closeMenu` fires automatically.

## Go deeper

If you only care about `mounted` and `updated` behavior and don't need cleanup, you can define a directive simply as a shorthand function: `const vColor = (el, binding) => { el.style.color = binding.value; }`.

> **Tip:** Always use `unmounted` to clean up any global event listeners attached during `mounted`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Avoid mutating other components or reactive state directly inside directive hooks.
- vnode arguments should be treated as read-only; never modify vnodes directly in directive hooks.

## Remember

- Directive hook objects provide mounted, updated, and unmounted stages.
- All hooks receive (el, binding, vnode, prevVnode).
- Always clean up global event listeners inside the unmounted hook.
