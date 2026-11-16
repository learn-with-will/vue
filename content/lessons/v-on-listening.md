---
slug: v-on-listening
title: "Listening to Events with v-on"
topic: events-forms
kind: technique
summary: "Listen to DOM events using the v-on directive or its standard @ shorthand."
tags: [v-on, events, event-listeners, shorthand]
related: [event-modifiers, key-modifiers, v-model-basics]
---
> **In one line:** v-on (shorthand @) attaches DOM event listeners to elements and components.

## The idea

Web applications respond to user actions: button clicks, mouse movements, keystrokes, and form submissions. In Vue, you listen to native DOM events using the **`v-on`** directive, or its ubiquitous shorthand: the **`@`** symbol.

```html
<!-- Full syntax -->
<button v-on:click="handleClick">Click</button>

<!-- Standard shorthand -->
<button @click="handleClick">Click</button>
```

The handler value can be either:
1. **An inline statement:** Simple code executed directly when the event fires (e.g. `@click="count++"`).
2. **A method handler:** A function reference defined in your component logic (e.g. `@click="handleSubmit"`).

When using a method handler, Vue automatically passes the native browser `MouseEvent` or `KeyboardEvent` as the first argument. If you need to access the native event inside an inline statement, pass the special **`$event`** variable: `@click="warn('Form submitted', $event)"`.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

function handleIncrement(event: MouseEvent) {
  console.log('Button clicked at coordinates:', event.clientX, event.clientY);
  count.value++;
}
</script>

<template>
  <div>
    <p>Clicks: {{ count }}</p>
    <!-- Method handler receives the native DOM event -->
    <button @click="handleIncrement">Click with Event Info</button>

    <!-- Inline statement modifies ref directly -->
    <button @click="count = 0">Reset</button>
  </div>
</template>
```

Clicking the first button runs `handleIncrement`, logging the mouse coordinates and incrementing the count.

## Go deeper

Method handlers provide better debugging, cleaner templates, and easier unit testing than long inline statements.

> **Tip:** In `<script setup>`, any function declared at the top level is immediately available to `@event` bindings in your template.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Writing @click="handleClick()" invokes the function with custom args; omitting parentheses passes the native event.
- Do not perform heavy multi-line JavaScript inside inline template handlers.

## Remember

- Use v-on or the @ shorthand to attach DOM event listeners.
- Handlers can be inline expressions (@click="count++") or method references.
- Method references automatically receive the native DOM event as an argument.
