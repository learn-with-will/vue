---
slug: v-once-directive
title: "Render-Once with v-once"
topic: tooling-typescript
kind: technique
summary: "v-once renders an element or component once and skips all future reactive updates."
tags: [v-once, optimization, performance, directives]
related: [v-memo-directive, how-reactivity-works, directives-overview]
---
> **In one line:** v-once renders an element once and treats all content and children as static forever.

## The idea

In many applications, certain parts of the user interface contain dynamic expressions on initial load (like rendering a user's account registration date or loading Terms of Service text), but are **guaranteed to never change again** during the user session.

Even if data doesn't change, Vue's virtual DOM reconciliation would normally inspect those nodes during subsequent component re-renders.

Applying the **`v-once`** directive instructs Vue to treat the element, component, and all of its nested children as **static content**:
- Vue evaluates the element and mustaches once on initial mount.
- On all future re-renders, Vue completely skips diffing and updating this subtree.

```tree
v-once Optimization
  Initial render: evaluates mustaches and builds DOM nodes @green
  Subsequent renders: skips Virtual DOM diffing entirely @blue
```

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const appVersion = ref('v3.5.0');
const clicks = ref(0);
</script>

<template>
  <div>
    <!-- Rendered once; never checked on subsequent re-renders: -->
    <header v-once class="app-header">
      <h1>Documentation Hub</h1>
      <span>Build: {{ appVersion }}</span>
    </header>

    <button @click="clicks++">Clicks: {{ clicks }}</button>
  </div>
</template>
```

Clicking the button re-renders the component, but the `v-once` header is bypassed completely by the virtual DOM.

## Go deeper

`v-once` is also useful for large static lists rendered from immutable data sources.

> **Tip:** You can also apply `v-once` to child components: `<HeavyWidget v-once />`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Any future reactive changes to variables inside a v-once block will be completely ignored.
- Do not apply v-once to elements that need to react to language or theme toggles.

## Remember

- v-once renders an element and its children once on initial mount.
- Completely skips virtual DOM diffing on all subsequent component re-renders.
- Ideal for heavy static sections, terms of service, and immutable headers.
