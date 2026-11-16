---
slug: v-show-toggling
title: "Toggling Visibility with v-show"
topic: template-directives
kind: technique
summary: "v-show toggles element visibility using the CSS display property while keeping it in the DOM."
tags: [v-show, css-display, toggling, performance]
related: [v-if-conditional, v-if-vs-v-show, directives-overview]
---
> **In one line:** v-show keeps elements in the DOM and toggles their visibility with CSS display: none.

## The idea

While `v-if` mounts and destroys DOM elements on condition changes, **`v-show`** takes a different approach: it always renders the element into the DOM, and simply toggles the CSS `display` property.

When the expression evaluates to truthy, the element uses its default CSS display (such as `block` or `flex`). When the expression evaluates to falsy, Vue sets inline `style="display: none;"`.

```tree
v-show mechanism
  v-show="isOpen"
    [true] Element rendered with normal CSS display @green
    [false] Element remains in DOM with style="display: none" @amber
```

Because the DOM node and any child components remain alive in the DOM tree, their internal state, scroll positions, and DOM event listeners are completely preserved.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);
</script>

<template>
  <div>
    <button @click="isMenuOpen = !isMenuOpen">
      {{ isMenuOpen ? 'Close Menu' : 'Open Menu' }}
    </button>

    <!-- Always present in DOM; toggled via CSS display: none -->
    <nav v-show="isMenuOpen" class="menu-dropdown">
      <a href="#profile">Profile</a>
      <a href="#settings">Settings</a>
    </nav>
  </div>
</template>
```

Inspecting the elements in DevTools reveals that the `<nav>` element remains in the document tree even when closed.

## Go deeper

Because `v-show` toggles CSS rather than rebuilding the DOM, it does not support `v-else` or the grouping `<template>` tag.

> **Tip:** Use `v-show` for tabs, collapsible accordions, and modals that open and close frequently.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- v-show does not support v-else or <template> elements.
- The initial render cost of v-show is higher than v-if because the element renders regardless of condition.

## Remember

- v-show toggles element visibility using inline CSS display: none.
- Elements remain in the DOM, preserving internal component state.
- v-show does not support v-else or grouping <template> tags.
