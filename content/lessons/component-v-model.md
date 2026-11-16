---
slug: component-v-model
title: "Component Two-Way Binding with v-model"
topic: events-vmodel
kind: pattern
summary: "Implement two-way data binding on custom components using modelValue prop and update:modelValue emit."
tags: [v-model, components, two-way-binding, architecture]
related: [define-emits, define-model, multiple-v-models]
---
> **In one line:** v-model on a component pairs a modelValue prop with an update:modelValue event.

## The idea

Earlier you saw how `v-model` creates two-way binding on native HTML inputs. Vue components can also support `v-model` to build custom reusable inputs, date pickers, and rich toggles.

Under the hood, when you write `<CustomInput v-model="searchText" />`, Vue translates it into:

```html
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

To implement this contract manually in a custom component, you need:
1. A prop named **`modelValue`** declared with `defineProps`.
2. An event named **`update:modelValue`** declared with `defineEmits`.

Whenever the internal input changes, emit `update:modelValue` with the new data.

## See it

```html
<!-- ToggleSwitch.vue -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function toggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <button
    class="switch"
    :class="{ active: modelValue }"
    @click="toggle"
  >
    {{ modelValue ? 'ON' : 'OFF' }}
  </button>
</template>
```

The parent uses it cleanly: `<ToggleSwitch v-model="isNotificationsEnabled" />`.

## Go deeper

While manual `modelValue` / `update:modelValue` was required in older Vue versions, Vue 3.4 introduced `defineModel()`, which drastically simplifies this pattern.

> **Tip:** You can customize the prop name by passing an argument to `v-model`: `v-model:title="pageTitle"`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- The default prop name must be exact: modelValue (with capital V).
- The default event name must be exact: update:modelValue.
- Do not directly mutate modelValue inside the child; always emit update:modelValue.

## Remember

- Component v-model desugars to modelValue prop and update:modelValue event.
- Child receives current value via modelValue prop.
- Child notifies parent of changes by emitting update:modelValue.
