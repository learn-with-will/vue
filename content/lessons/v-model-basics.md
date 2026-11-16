---
slug: v-model-basics
title: "Two-Way Binding with v-model"
topic: events-forms
kind: technique
summary: "v-model creates two-way data binding between form inputs and reactive state."
tags: [v-model, two-way-binding, forms, inputs]
related: [v-model-inputs, v-model-modifiers, component-v-model]
---
> **In one line:** v-model binds input value and input event together for seamless two-way synchronization.

## The idea

When building forms, keeping input field values synchronized with component state normally requires two steps: binding the element's `:value` attribute, and attaching an `@input` event handler to update the variable.

To eliminate this boilerplate, Vue provides the **`v-model`** directive for **two-way data binding**.

```sequence
actor state: State | reactive ref @primary
actor input: Input | DOM element @blue
state -> input: updates value attribute | DOM sync
input -> state: emits input event | updates .value
```

Under the hood on a standard text input, `v-model="text"` is syntactic sugar for:

```html
<input
  :value="text"
  @input="text = ($event.target as HTMLInputElement).value"
/>
```

Any change to the state immediately updates the input box, and any keystroke in the input box immediately updates the reactive state.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const message = ref('');
</script>

<template>
  <div class="form-group">
    <label for="msg">Your Message:</label>
    <input id="msg" v-model="message" placeholder="Type something..." />

    <p>Live Preview: {{ message }}</p>
    <button @click="message = ''">Clear</button>
  </div>
</template>
```

As you type into the input, the live preview updates in real time. Clicking "Clear" resets the ref, which instantly clears the input box.

## Go deeper

`v-model` handles Japanese, Chinese, and Korean IME (Input Method Editor) compositions intelligently: it waits until composition completes before firing updates.

> **Tip:** `v-model` works seamlessly on native HTML inputs as well as custom Vue components.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not combine v-model with :value on the same element; they conflict with each other.
- For IME composition inputs, if you need updates on every raw keystroke, use manual :value and @input instead.

## Remember

- v-model provides two-way binding between form inputs and reactive state.
- Combines dynamic :value binding with automated @input event handling.
- Updates flow seamlessly from state to DOM and from user typing back to state.
