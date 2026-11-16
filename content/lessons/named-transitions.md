---
slug: named-transitions
title: "Named Transitions"
topic: advanced-reactivity
kind: technique
summary: "Create reusable custom transition styles by assigning a name attribute to Transition."
tags: [transition, named-transitions, reusability, css]
related: [transition-basics, transition-classes, transition-modes]
---
> **In one line:** Use <Transition name="fade"> to prefix transition classes with fade- instead of v-.

## The idea

When you use `<Transition>` without attributes, Vue prefixes all generated CSS classes with `v-` (such as `.v-enter-active`).

If your application has multiple distinct animation styles—such as a `fade` for notifications, a `slide-left` for drawers, and a `bounce` for modals—using `v-` for everything causes CSS collisions.

You can customize the prefix by giving the transition a **`name` attribute**:

```html
<Transition name="fade">
  <div v-if="ok">Content</div>
</Transition>
```

Setting `name="fade"` replaces the `v-` prefix with `fade-`:
- `.fade-enter-from`, `.fade-enter-active`, `.fade-enter-to`
- `.fade-leave-from`, `.fade-leave-active`, `.fade-leave-to`

This lets you build a shared library of named animation utility classes across your design system.

## See it

```html
<template>
  <div>
    <!-- Fade Transition -->
    <Transition name="fade">
      <p v-if="isOpen">Fading paragraph</p>
    </Transition>

    <!-- Slide Transition -->
    <Transition name="slide">
      <div v-if="isOpen" class="drawer">Sliding drawer</div>
    </Transition>
  </div>
</template>

<style>
/* Global or scoped reusable transition classes */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
```

Both transitions operate independently on the page with dedicated animation styles.

## Go deeper

You can also supply custom class names using props like `enter-active-class="animate__animated animate__fadeIn"` to integrate external CSS animation libraries like Animate.css.

> **Tip:** Store named transition styles in a global `transitions.css` file so any component can reuse them by name.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Mismatching the name attribute with the CSS class prefix causes the transition to fail silently.
- Class names must match exactly: name="slide-fade" produces .slide-fade-enter-active.

## Remember

- <Transition name="xyz"> replaces the v- prefix with xyz-.
- Enables multiple distinct, coexisting animation styles in an app.
- Ideal for shared design system transitions (fade, slide, zoom, bounce).
