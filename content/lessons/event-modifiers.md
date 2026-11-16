---
slug: event-modifiers
title: "Event Modifiers"
topic: events-forms
kind: technique
summary: "Streamline event handling with modifiers like .prevent, .stop, and .once instead of manual DOM calls."
tags: [event-modifiers, prevent-default, stop-propagation, v-on]
related: [v-on-listening, key-modifiers, v-model-basics]
---
> **In one line:** Event modifiers let you call preventDefault or stopPropagation declaratively in your template.

## The idea

It is very common to call `event.preventDefault()` or `event.stopPropagation()` inside event handlers. Doing this imperatively inside your JavaScript methods clutters your business logic with DOM details.

To keep methods purely focused on data logic, Vue provides **event modifiers**: postfix flags appended to directive names with a dot (`.`).

| Modifier | DOM Equivalent | Use Case |
|---|---|---|
| `.prevent` | `event.preventDefault()` | Prevent form submit page reload, prevent link jump |
| `.stop` | `event.stopPropagation()` | Prevent click from bubbling to parent containers |
| `.once` | `{ once: true }` | Trigger event at most once, then remove listener |
| `.self` | Checks `event.target === event.currentTarget` | Only trigger if click was directly on this element |
| `.capture` | `{ capture: true }` | Use capture mode instead of bubbling mode |
| `.passive` | `{ passive: true }` | Optimize scroll performance on touch/wheel events |

Modifiers can be **chained together**: `@click.stop.prevent="doThis"` stops event propagation and cancels the default action simultaneously.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const query = ref('');

function performSearch() {
  console.log('Searching for:', query.value);
}
</script>

<template>
  <!-- .prevent stops the browser from submitting the form and reloading the page -->
  <form @submit.prevent="performSearch">
    <input v-model="query" placeholder="Search..." />
    <button type="submit">Search</button>
  </form>

  <!-- .stop prevents the click event from bubbling up to parent cards -->
  <button @click.stop="console.log('Inner button clicked')">
    Isolated Click
  </button>
</template>
```

The search form submits smoothly via JavaScript without causing a full-page reload, and without needing `e.preventDefault()` inside `performSearch`.

## Go deeper

When chaining modifiers, **order matters**. Using `@click.prevent.self` prevents all clicks on the element, whereas `@click.self.prevent` only prevents clicks on the element itself.

> **Tip:** Always use `.passive` with `@scroll` and `@touchstart` on mobile to keep scroll performance smooth and unblocked.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not use .passive alongside .prevent, as passive specifically promises never to call preventDefault().
- Chaining order affects evaluation; @click.stop.prevent runs stop before prevent.

## Remember

- Event modifiers replace imperative DOM methods like preventDefault().
- Common modifiers include .prevent, .stop, .once, and .self.
- Modifiers can be chained in sequence (e.g. @submit.stop.prevent).
