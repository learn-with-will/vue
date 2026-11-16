---
slug: define-emits
title: "Declaring Component Events with defineEmits"
topic: events-vmodel
kind: api
summary: "defineEmits declares custom component events that children emit to communicate with parents."
tags: [emits, defineemits, events, communication]
related: [emitting-events, component-v-model, define-model]
---
> **In one line:** defineEmits() declares the custom events a child component can send to its parent.

## The idea

While props flow data down from parent to child, **events flow notifications up from child to parent**.

In modern Vue with `<script setup>`, you declare the custom events your component can emit using the **`defineEmits`** compiler macro.

`defineEmits` serves several purposes:
1. It documents all events the component emits.
2. It returns an `emit` function used in JavaScript to fire events.
3. It provides TypeScript type safety for event names and payload parameters.

```tree
Event Communication Flow
  Child Component
    [emit('delete', id)] Fires custom event with payload @primary
  Parent Component
    [v-on:delete="handleDelete"] Listens with @ and receives payload @green
```

Explicitly declaring emits allows Vue to cleanly distinguish custom component events from native DOM bubbling events.

## See it

```html
<!-- TodoItem.vue -->
<script setup lang="ts">
// 1. Declare custom events with TypeScript call signatures
const emit = defineEmits<{
  (e: 'remove', id: string): void;
  (e: 'toggle', id: string, completed: boolean): void;
}>();

const props = defineProps<{
  id: string;
  title: string;
}>();

function handleDelete() {
  // 2. Fire the event with payload data
  emit('remove', props.id);
}
</script>

<template>
  <div class="todo-row">
    <span>{{ title }}</span>
    <button @click="handleDelete">Delete</button>
  </div>
</template>
```

The parent listens with standard event syntax: `<TodoItem @remove="onItemRemoved" />`.

## Go deeper

In Vue 3.3+, you can use the more concise type syntax for `defineEmits`: `defineEmits<{ remove: [id: string]; toggle: [id: string, completed: boolean] }>()`.

> **Tip:** Like `defineProps`, `defineEmits` is a compiler macro that does not need to be imported from `'vue'`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not import defineEmits; it is globally available in <script setup>.
- Event names are case-insensitive in HTML templates; prefer kebab-case (@item-selected) or camelCase in SFCs.

## Remember

- defineEmits declares custom component events fired by children.
- Returns an emit() function used to dispatch events with arguments.
- TypeScript typing provides compile-time checking for event payloads.
