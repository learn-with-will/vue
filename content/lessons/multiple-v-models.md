---
slug: multiple-v-models
title: "Multiple and Named v-model Bindings"
topic: events-vmodel
kind: technique
summary: "Bind multiple independent v-models on a single component using argument names with defineModel."
tags: [v-model, named-models, multiple-v-models, forms]
related: [define-model, component-v-model, define-emits]
since: "3.4"
---
> **In one line:** Use v-model:name="var" and defineModel('name') to bind multiple models on one component.

## The idea

Real-world forms frequently have complex components that need to synchronize multiple independent values: a user name component needing both `firstName` and `lastName`, or a date range picker needing `startDate` and `endDate`.

In Vue 3.4+, declaring named models is effortless: pass the model name as the argument to **`defineModel()`**: `const firstName = defineModel<string>('firstName')`, and bind it in parent templates with `<UserName v-model:first-name="first" />`.

Vue maps `v-model:first-name` to `firstName` and `v-model:last-name` to `lastName`, creating completely independent synchronization channels on a single component instance.

## See it

```html
<!-- NameFields.vue (Child) -->
<script setup lang="ts">
const firstName = defineModel<string>('firstName', { default: '' });
const lastName = defineModel<string>('lastName', { default: '' });
</script>

<template>
  <div class="name-fields">
    <input v-model="firstName" placeholder="First Name" />
    <input v-model="lastName" placeholder="Last Name" />
  </div>
</template>
```

Parent component:

```html
<!-- App.vue (Parent) -->
<script setup lang="ts">
import { ref } from 'vue';
import NameFields from './NameFields.vue';

const first = ref('Ada');
const last = ref('Lovelace');
</script>

<template>
  <div>
    <NameFields v-model:first-name="first" v-model:last-name="last" />
    <p>Full Name: {{ first }} {{ last }}</p>
  </div>
</template>
```

Both fields update independently and keep the parent's `first` and `last` refs synchronized.

## Go deeper

You can even support custom modifiers on named models using `defineModel()` modifier destructuring: `const [title, modifiers] = defineModel('title')`.

> **Tip:** You can combine an unnamed default `v-model` alongside multiple named `v-model:other` bindings on the same component.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Ensure the argument name in template (kebab-case or camelCase) matches the defineModel argument.
- Each named model operates its own independent update:propName event.

## Remember

- Components can have multiple v-model bindings by specifying argument names.
- In child, declare each with defineModel('modelName').
- In parent, bind with v-model:modelName="stateVariable".
