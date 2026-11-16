---
slug: define-model
title: "Two-Way Binding with defineModel()"
topic: events-vmodel
kind: api
summary: "defineModel in Vue 3.4+ declares a two-way reactive binding in a single line, replacing boilerplate."
tags: [definemodel, v-model, vue-3.4, macro]
related: [component-v-model, multiple-v-models, define-emits]
since: "3.4"
---
> **In one line:** defineModel() declares a two-way binding ref that automatically syncs with the parent.

## The idea

Prior to Vue 3.4, supporting `v-model` on a custom component required manually declaring a `modelValue` prop, declaring an `update:modelValue` emit, and writing a helper method to emit changes.

Vue 3.4 made the **`defineModel()`** compiler macro stable, completely revolutionizing this workflow.

`defineModel()` returns a **reactive ref**. You can read and write to it like any standard ref (`model.value = 'new'`). Behind the scenes, Vue:
1. Automatically registers the incoming prop.
2. Automatically listens for parent updates.
3. Automatically emits the `update:modelValue` event whenever `model.value` is mutated!

```flow
parent: Parent Component @primary
macro: defineModel in Child @green
input: Child Template Input @blue
parent -> macro: two-way model sync
macro -> input: standard ref binding
```

This eliminates virtually all boilerplate for custom input components.

## See it

```html
<!-- SearchBox.vue -->
<script setup lang="ts">
// One single line declares prop, emit, and local reactive ref!
const query = defineModel<string>({ default: '' });
</script>

<template>
  <div class="search-box">
    <!-- Bind query directly with v-model -->
    <input v-model="query" placeholder="Type to search..." />
    <button v-if="query" @click="query = ''">Clear</button>
  </div>
</template>
```

In the parent component: `<SearchBox v-model="searchTerm" />`. Typing in the child or clicking "Clear" synchronizes `searchTerm` seamlessly.

## Go deeper

`defineModel` supports options like `{ required: true }`, `{ default: 'default text' }`, and type constraints: `defineModel<number>()`.

> **Tip:** `defineModel()` is a compiler macro available in Vue 3.4+ without any imports.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- defineModel requires Vue 3.4 or higher; ensure your package.json dependencies are up to date.
- Do not manually declare modelValue in defineProps if you are already using defineModel().

## Remember

- defineModel() simplifies component two-way binding in Vue 3.4+.
- Returns a reactive ref that automatically emits update events upon mutation.
- Can be bound directly to child template inputs with v-model.
