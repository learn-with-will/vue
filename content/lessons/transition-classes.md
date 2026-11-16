---
slug: transition-classes
title: "The Six Transition Classes"
topic: advanced-reactivity
kind: concept
summary: "Master the six CSS classes applied during enter and leave transition phases in Vue."
tags: [transition, css-classes, animation, lifecycle]
related: [transition-basics, named-transitions, transition-modes]
---
> **In one line:** Vue applies six transition classes: enter-from, enter-active, enter-to, leave-from, leave-active, leave-to.

## The idea

To gain complete visual control over your animations, you must understand the **six transition classes** that Vue applies during the enter and leave lifecycles:

```tree
Transition Phases
  Enter Phase (Element appearing)
    v-enter-from starting state before insertion
    v-enter-active applied during entire enter transition
    v-enter-to ending state after insertion
  Leave Phase (Element disappearing)
    v-leave-from starting state when leave triggered
    v-leave-active applied during entire leave transition
    v-leave-to ending state before DOM removal
```

In your CSS:
- Define the duration, easing, and properties (like `opacity` or `transform`) on **`-active`** classes.
- Define the hidden or shifted starting/ending points on **`-from`** and **`-to`** classes.

## See it

```html
<template>
  <Transition>
    <div v-if="isVisible" class="slide-panel">Slide Panel</div>
  </Transition>
</template>

<style scoped>
.v-enter-active, .v-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.v-enter-from, .v-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.v-enter-to, .v-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
```

The panel slides down from -20px while fading in, and reverses the movement when fading out.

## Go deeper

You can use CSS `@keyframes` animations instead of transitions. Simply specify the animation on `.v-enter-active` and `.v-leave-active`.

> **Tip:** You can combine multiple properties (e.g. `opacity` and `transform`) inside the same transition rule.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Note the naming change in Vue 3: v-enter was renamed to v-enter-from for symmetry with v-leave-from.
- If CSS properties do not have transition rules specified, elements will disappear abruptly.

## Remember

- Enter classes: v-enter-from, v-enter-active, v-enter-to.
- Leave classes: v-leave-from, v-leave-active, v-leave-to.
- Place transition timing in active classes, and style coordinates in from/to classes.
