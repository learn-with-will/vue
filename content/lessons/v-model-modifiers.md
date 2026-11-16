---
slug: v-model-modifiers
title: "v-model Modifiers"
topic: events-forms
kind: technique
summary: "Use .lazy, .number, and .trim modifiers to format and control input synchronization."
tags: [v-model, modifiers, forms, typecasting]
related: [v-model-basics, v-model-inputs, component-v-model]
---
> **In one line:** Modifiers like .lazy, .number, and .trim refine how v-model syncs and transforms input data.

## The idea

Native HTML input elements often need minor transformations before storing their data in your application state. For example, inputs naturally return strings even when `type="number"` is set, and trailing whitespace from mobile auto-correct can spoil usernames.

Vue provides three built-in modifiers for `v-model`:

```tree
v-model Modifiers
  v-model.lazy
    [Sync on change] Updates state on blur/enter rather than every keystroke @blue
  v-model.number
    [Typecast] Automatically runs parseFloat() on the input value @green
  v-model.trim
    [Whitespace] Automatically strips leading and trailing whitespace @blue
```

These modifiers can be combined, such as `v-model.lazy.trim="username"`, to apply multiple transformations at once.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const age = ref<number>(25);
const email = ref('');
const bio = ref('');
</script>

<template>
  <div class="form">
    <!-- .number typecasts string to number via parseFloat -->
    <input type="number" v-model.number="age" placeholder="Age" />

    <!-- .trim strips leading/trailing whitespace -->
    <input type="email" v-model.trim="email" placeholder="Email" />

    <!-- .lazy only syncs on 'change' event (blur or enter), not on every keypress -->
    <textarea v-model.lazy="bio" placeholder="Bio"></textarea>
  </div>
</template>
```

`age` is stored as a true JavaScript number instead of a string, and `email` automatically discards accidental trailing spaces.

## Go deeper

If the value cannot be parsed by `parseFloat()` (for example, if the input is empty or invalid), `.number` falls back to the original string value.

> **Tip:** Use `.lazy` for heavy search inputs or markdown editors where syncing on every keystroke causes unnecessary lag.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- HTML input type="number" still produces string values without the .number modifier in Vue.
- Do not use .number on inputs that expect non-numeric characters like phone numbers or zip codes.

## Remember

- .number automatically typecasts input strings to JavaScript numbers.
- .trim automatically strips leading and trailing whitespace from input text.
- .lazy syncs state after change/blur events instead of on every input event.
