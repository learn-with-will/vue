---
slug: directive-binding-values
title: "Directive Values, Arguments, and Modifiers"
topic: tooling-typescript
kind: technique
summary: "Extract dynamic values, arguments, and modifiers from the directive binding object."
tags: [directives, binding, arguments, modifiers]
related: [custom-directives-basics, directive-hooks, event-modifiers]
---
> **In one line:** The binding object provides value, oldValue, arg, and modifiers to custom directives.

## The idea

Custom directives can accept dynamic values, colon arguments, and dot modifiers just like built-in directives:

```html
<div v-pin:top.animated="200"></div>
```

Inside directive hooks, the second parameter—the **`binding` object**—exposes these inputs:
- **`binding.value`**: The evaluated expression value (`200`).
- **`binding.oldValue`**: The previous value (available in `beforeUpdate` and `updated`).
- **`binding.arg`**: The argument passed after the colon (`'top'`).
- **`binding.modifiers`**: An object with modifier flags (e.g. `{ animated: true }`).

## See it

```typescript
import type { Directive } from 'vue';

export const vPin: Directive<HTMLElement, number> = {
  mounted(el, binding) {
    el.style.position = 'fixed';

    // binding.arg represents direction (top, bottom, right, left)
    const direction = (binding.arg || 'top') as 'top' | 'bottom' | 'left' | 'right';
    el.style[direction] = binding.value + 'px';

    // binding.modifiers represents dot flags
    if (binding.modifiers.animated) {
      el.style.transition = 'all 0.3s ease';
    }
  },
  updated(el, binding) {
    const direction = (binding.arg || 'top') as 'top' | 'bottom' | 'left' | 'right';
    el.style[direction] = binding.value + 'px';
  }
};
```

In the template: `<div v-pin:bottom.animated="50">Sticky Banner</div>`. The directive pins the element 50px from the bottom with animated transitions.

## Go deeper

If you need to pass multiple dynamic values to a directive, pass a JavaScript object: `v-demo="{ color: 'red', text: 'hi' }"`. Access it via `binding.value.color`.

> **Tip:** You can use dynamic directive arguments: `<div v-pin:[direction]="20">`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Check if binding.value === binding.oldValue in updated() to avoid redundant DOM work.
- Ensure you handle cases where binding.arg is undefined by providing default values.

## Remember

- The binding object exposes value, oldValue, arg, and modifiers.
- binding.arg extracts colon parameters (e.g. :top -> 'top').
- binding.modifiers extracts dot flags (e.g. .animated -> { animated: true }).
