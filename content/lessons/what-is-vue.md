---
slug: what-is-vue
title: "What is Vue?"
topic: foundations
kind: concept
summary: "Vue is a progressive JavaScript framework for building user interfaces with declarative rendering and reactivity."
tags: [fundamentals, progressive-framework, declarative-rendering]
related: [progressive-framework, options-vs-composition-api, anatomy-of-an-sfc]
---
> **In one line:** Vue is a progressive JavaScript framework that pairs declarative HTML templates with reactive state.

## The idea

Modern web interfaces respond to user clicks, incoming messages, and live server updates. Doing this with imperative DOM manipulation like `document.getElementById` quickly degrades into fragile spaghetti code where state and presentation drift apart.

Vue solves this by providing **declarative rendering**: you describe how the user interface should look for any given state using familiar HTML templates, and Vue automatically updates the real DOM whenever that state changes.

Under the hood, Vue operates an engine called the **reactivity system**. Vue tracks every reactive variable your template touches. When you change a value in JavaScript, Vue knows exactly which DOM nodes depend on it and updates only those specific elements.

```tree
How Vue updates the screen
  State changes in JavaScript
    [track] Vue tracks reactive dependencies @blue
      [render] Re-renders only affected DOM nodes @green
```

Vue is designed from the ground up to be incrementally adoptable. You can sprinkle it into an existing backend-rendered page as a lightweight enhancement library, or you can build enterprise-scale single-page applications with official routing and state management tools.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const message = ref('Hello, Vue 3!');
</script>

<template>
  <main>
    <h1>{{ message }}</h1>
    <button @click="message = 'Welcome to modern Vue!'">
      Update Greeting
    </button>
  </main>
</template>
```

In this single-file component, `message` is reactive state created by `ref()`. The template renders `{{ message }}`. When the user clicks the button, assigning a new string automatically updates the heading on screen without any manual DOM code.

## Go deeper

Declarative rendering means you never have to think about "how" to manipulate nodes, add classes, or remove child elements. You only declare "what" the DOM should represent for a given JavaScript state.

> **Tip:** Treat state as the single source of truth; never query or mutate DOM nodes directly when writing Vue components.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Avoid reaching for document.querySelector to modify text; always bind your data through Vue reactive state instead.
- Do not confuse the template syntax with static HTML; templates compile to optimized JavaScript render functions.

## Remember

- Vue is a progressive framework for building declarative user interfaces.
- Declarative rendering pairs HTML templates with reactive JavaScript state.
- Vue automatically tracks dependencies and updates the DOM when state changes.
