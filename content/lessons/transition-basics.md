---
slug: transition-basics
title: "Animating Elements with <Transition>"
topic: advanced-reactivity
kind: api
summary: "The Transition built-in component applies automated enter and leave animations on conditional elements."
tags: [transition, animation, css, built-in-components]
related: [transition-classes, named-transitions, transition-modes]
---
> **In one line:** <Transition> automatically adds CSS animation classes when elements enter or leave the DOM.

## The idea

Sudden visual jumps when elements appear or disappear via `v-if` or `v-show` feel unpolished. Adding CSS animations manually requires tracking animation end events, toggling class names, and delaying DOM removal.

Vue automates this entire process with the **`<Transition>`** built-in component.

When an element wrapped in `<Transition>` enters or leaves:
1. Vue automatically sniffs whether the element has CSS transitions or animations applied.
2. Vue adds and removes specific CSS transition classes at exact moments during the transition.
3. On leave, Vue delays removing the element from the DOM until the CSS transition finishes!

```flow
enter: Element toggles v-if=true @primary
classes: Vue applies enter CSS classes @blue
dom: Element transitions smoothly into view @green
enter -> classes
classes -> dom
```

`<Transition>` works with elements toggled by `v-if`, `v-show`, or dynamic components using `<component :is="...">`.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';
const showBox = ref(true);
</script>

<template>
  <button @click="showBox = !showBox">Toggle</button>
  <Transition>
    <div v-if="showBox" class="box">Smooth Fade Box</div>
  </Transition>
</template>

<style scoped>
.box { padding: 16px; border: 1px solid #1f8a60; }
.v-enter-active, .v-leave-active {
  transition: opacity 0.4s ease;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
}
</style>
```

Toggling the button smoothly fades the box in and out without writing any manual JavaScript animation code.

## Go deeper

`<Transition>` only renders its child element; it does not introduce an extra wrapper element in the DOM tree.

> **Tip:** You can animate dynamic component switching by placing `<Transition>` around `<component :is="CurrentView" />`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- <Transition> only supports animating a single child element or component at a time (use <TransitionGroup> for lists).
- Ensure the element inside <Transition> has a v-if, v-show, or :key binding to trigger transitions.

## Remember

- <Transition> automates CSS enter and leave transitions on conditional elements.
- Delays DOM removal on exit until the CSS transition completes.
- Works seamlessly with v-if, v-show, and dynamic components.
