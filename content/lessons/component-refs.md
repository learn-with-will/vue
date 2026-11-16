---
slug: component-refs
title: "Component Refs and defineExpose"
topic: advanced-reactivity
kind: technique
summary: "Access child component instances via template refs and selectively expose public APIs using defineExpose."
tags: [component-refs, defineexpose, components, encapsulation]
related: [template-refs-dom, defining-components, define-props]
---
> **In one line:** useTemplateRef accesses child instances, which must explicitly expose methods with defineExpose.

## The idea

When you place a `ref` attribute on a custom child component rather than a native HTML element:

```html
<CustomModal ref="modalRef" />
```

Vue populates the template ref with the **child component's internal instance**.

However, components authored with `<script setup>` are **closed by default**. A parent component holding a reference to a child component cannot access any of its internal variables or functions.

To explicitly grant the parent access to specific methods or properties, the child must declare them using the **`defineExpose`** compiler macro.

```flow
child: Child Component (defines open(), close()) @primary
expose: defineExpose({ open, close }) @blue
parent: Parent calls modalRef.value.open() @green
child -> expose: selectively exposes public API
expose -> parent: accessible to parent ref
```

This guarantees strict encapsulation: internal implementation details remain private while exposing a deliberate public API.

## See it

```html
<!-- ModalDialog.vue (Child) -->
<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(false);
const open = () => { isVisible.value = true; };
const close = () => { isVisible.value = false; };

// Explicitly declare public API for parents
defineExpose({ open, close });
</script>

<template>
  <div v-if="isVisible" class="modal">
    <p>Modal Dialog Content</p>
    <button @click="close">Close</button>
  </div>
</template>
```

In the parent:

```html
<!-- Parent.vue -->
<script setup lang="ts">
import { useTemplateRef } from 'vue';
import ModalDialog from './ModalDialog.vue';

// Type the template ref with the child component instance
const modal = useTemplateRef<InstanceType<typeof ModalDialog>>('modal');

function triggerOpen() {
  modal.value?.open();
}
</script>

<template>
  <button @click="triggerOpen">Open Modal</button>
  <ModalDialog ref="modal" />
</template>
```

The parent invokes `modal.value.open()` safely without having access to unexposed private variables.

## Go deeper

`defineExpose` is a compiler macro available inside `<script setup>` that does not require an import.

> **Tip:** Always prefer props and events for communication; reserve component refs and `defineExpose` for imperative UI controls like video players, modals, or canvas animations.

## Watch out

- <script setup> components expose nothing by default; defineExpose is required.
- Do not overuse component refs to pass data; props and events preserve clean declarative architectures.

## Remember

- Placing a ref on a custom component retrieves the child component instance.
- <script setup> components are closed by default; use defineExpose() to expose APIs.
- Use InstanceType<typeof Component> in TypeScript to type component refs.
