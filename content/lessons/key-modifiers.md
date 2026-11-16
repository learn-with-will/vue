---
slug: key-modifiers
title: "Keyboard and Mouse Modifiers"
topic: events-forms
kind: technique
summary: "Filter keyboard and mouse events using key aliases like .enter, .esc, and mouse buttons."
tags: [key-modifiers, keyboard-events, keyboard, shortcuts]
related: [v-on-listening, event-modifiers, v-model-inputs]
---
> **In one line:** Key modifiers filter keyboard events to specific keys like @keyup.enter or @keydown.esc.

## The idea

When listening to keyboard events (`@keyup`, `@keydown`), you often only want to trigger action when a specific key is pressed, such as pressing Enter to submit or Escape to dismiss a dialog.

Instead of writing manual checks like `if (event.key === 'Enter')` inside your handler, Vue allows you to append **key modifiers** directly to the event directive:

```html
<!-- Only call submit when the Enter key is pressed -->
<input @keyup.enter="submit" />
```

Vue provides aliases for the most common keys: `.enter`, `.tab`, `.delete` (captures both Delete and Backspace), `.esc`, `.space`, `.up`, `.down`, `.left`, and `.right`. You can also use any valid `KeyboardEvent.key` value converted to kebab-case (e.g. `.page-down`).

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const todoText = ref('');
const todos = ref<string[]>([]);

function addTodo() {
  if (todoText.value.trim()) {
    todos.value.push(todoText.value.trim());
    todoText.value = '';
  }
}
</script>

<template>
  <input
    v-model="todoText"
    @keydown.enter="addTodo"
    @keydown.esc="todoText = ''"
    placeholder="Enter to add, Esc to clear"
  />
  <ul>
    <li v-for="t in todos" :key="t">{{ t }}</li>
  </ul>
</template>
```

Typing a task and pressing Enter immediately adds it to the list without requiring an explicit button click.

## Go deeper

Vue also supports **system modifier keys** (`.ctrl`, `.alt`, `.shift`, `.meta`) and **mouse button modifiers** (`.left`, `.right`, `.middle`). Combine them with `.exact` to require strictly that key combination: `@click.ctrl.exact="doSomething"`.

> **Tip:** Use `.exact` to prevent handlers from firing when extraneous keys are held down.

## Watch out

- System modifiers like .ctrl trigger on keydown even if other keys are held unless restricted with .exact.
- Key modifiers only trigger on elements that can receive keyboard focus (inputs, textareas, or elements with tabindex).

## Remember

- Key modifiers like @keyup.enter filter keyboard events declaratively.
- Aliases exist for common keys: .enter, .esc, .tab, .space, and arrows.
- System modifiers (.ctrl, .shift) can be paired with .exact for strict shortcuts.
