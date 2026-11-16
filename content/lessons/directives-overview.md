---
slug: directives-overview
title: "Understanding Directives"
topic: foundations
kind: concept
summary: "Directives are special v- prefixed attributes that apply reactive side effects to DOM elements."
tags: [directives, template-syntax, modifiers, v-prefix]
related: [attribute-bindings, v-if-conditional, v-on-listening]
---
> **In one line:** Directives are special v- prefixed attributes that apply reactive updates to the DOM.

## The idea

In Vue templates, a **directive** is a special attribute prefixed with `v-`. Directives instruct Vue to apply specific reactive behaviors or DOM manipulations whenever the value of their expression changes.

A directive's syntax consists of four distinct parts:

```text
v-directive:argument.modifier="expression"
│           │        │        └─ reactive JS expression
│           │        └─ special postfix flag (e.g. .prevent)
│           └─ target parameter (e.g. click, href)
└─ directive name (e.g. v-bind, v-on, v-model)
```

The **argument** denotes which attribute or event the directive targets, separated by a colon (such as `:href` or `:click`). **Modifiers** are special postfixes denoted by a dot (`.`), which signal that the directive should be bound in a specialized way (like `.prevent` or `.trim`).

Vue provides a concise suite of built-in directives for conditionals (`v-if`, `v-show`), lists (`v-for`), events (`v-on`), and forms (`v-model`).

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const isVisible = ref(true);
</script>

<template>
  <div>
    <!-- v-if conditionally adds or removes the element -->
    <p v-if="isVisible">Current count: {{ count }}</p>

    <!-- v-on listens to DOM events, with shorthand @ and .prevent modifier -->
    <form @submit.prevent="count++">
      <button type="submit">Increment</button>
    </form>
  </div>
</template>
```

Here `v-if` conditionally renders the paragraph, and `@submit.prevent` attaches an event listener while intercepting the default form submission.

## Go deeper

Directives can take **dynamic arguments** wrapped in square brackets: `<a v-bind:[attributeName]="url">`. When `attributeName` evaluates to `"href"`, the binding dynamically targets the `href` attribute.

> **Tip:** You can write your own custom directives for direct low-level DOM manipulations, such as auto-focusing inputs.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Directive attribute values are evaluated as JavaScript expressions, not raw strings.
- Dynamic argument expressions must evaluate to a string or null; spaces and quotes are forbidden.

## Remember

- Directives are v- prefixed attributes that apply reactive DOM updates.
- Syntax includes directive name, optional :argument, and optional .modifier.
- Built-in directives handle conditionals, loops, events, and form bindings.
