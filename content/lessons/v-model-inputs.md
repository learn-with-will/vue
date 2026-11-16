---
slug: v-model-inputs
title: "v-model on Checkboxes, Radios, and Selects"
topic: events-forms
kind: technique
summary: "v-model adapts intelligently to checkboxes, radio buttons, and select dropdowns."
tags: [v-model, forms, checkbox, radio, select]
related: [v-model-basics, v-model-modifiers, component-v-model]
---
> **In one line:** v-model automatically adapts its property and event based on the form element type.

## The idea

While a text input binds to the `value` property and listens to `input` events, other form controls use different DOM properties and events.

`v-model` handles this distinction automatically:

| Element Type | Bound Property | Listened Event | Value Type |
|---|---|---|---|
| Text input / Textarea | `value` | `input` | `string` |
| Single Checkbox | `checked` | `change` | `boolean` |
| Multiple Checkboxes | `checked` | `change` | `Array` of values |
| Radio Buttons | `checked` | `change` | Selected radio's `value` |
| Select Dropdown | `value` | `change` | Selected option's `value` |

When multiple checkboxes share the same `v-model` bound to an array, Vue automatically adds or removes each checkbox's `value` string from that array as they are toggled.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const subscribe = ref(false);
const frameworks = ref<string[]>(['vue']);
const role = ref('developer');
</script>

<template>
  <form>
    <label><input type="checkbox" v-model="subscribe" /> Newsletter</label>
    <div>
      <label><input type="checkbox" value="vue" v-model="frameworks" /> Vue</label>
      <label><input type="checkbox" value="react" v-model="frameworks" /> React</label>
    </div>
    <select v-model="role">
      <option value="developer">Developer</option>
      <option value="designer">Designer</option>
    </select>
  </form>
</template>
```

Checking or unchecking the "Vue" box automatically adds or removes `"vue"` from the `frameworks` array.

## Go deeper

On a `<select multiple>`, binding `v-model` to an array allows users to select multiple options simultaneously.

> **Tip:** For radio buttons and checkboxes, you can bind dynamic values to the `:value` attribute using Vue expressions.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- When binding multiple checkboxes together, ensure the initial state is initialized as an empty array [].
- If the initial value of a select does not match any option, the select will render unselected.

## Remember

- v-model adapts to checkboxes, radio buttons, and select dropdowns automatically.
- Multiple checkboxes bound to a single array add and remove values automatically.
- Radio buttons bound to the same ref select exclusively based on value.
