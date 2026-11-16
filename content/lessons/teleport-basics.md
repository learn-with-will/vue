---
slug: teleport-basics
title: "Rendering Modals with <Teleport>"
topic: advanced-reactivity
kind: api
summary: "Teleport renders a component's template content into a different part of the DOM tree outside its parent."
tags: [teleport, modals, popups, built-in-components]
related: [teleport-disabled, suspense-component, transition-basics]
---
> **In one line:** <Teleport to="..."> renders template markup into a different DOM node outside the component hierarchy.

## The idea

When building modal dialogs, global notification toasts, or tooltips, CSS styling creates frustrating issues: if a parent component has `overflow: hidden` or a CSS `transform` applied, child modal dialogs become clipped or fail to center correctly on screen.

Logically, the modal belongs inside the component that controls it. Visually and structurally, however, the modal element should live directly under `<body>`.

Vue resolves this architectural dilemma with the **`<Teleport>`** built-in component.

`<Teleport to="selector">` allows you to specify a target DOM destination (like `to="body"` or `to="#modal-target"`). Vue takes the rendered DOM nodes and injects them directly into that target container, while keeping all component state, props, and events inside the original component!

## See it

```html
<!-- ConfirmModal.vue -->
<script setup lang="ts">
import { ref } from 'vue';
const isOpen = ref(false);
</script>

<template>
  <button @click="isOpen = true">Open Dialog</button>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-backdrop">
      <div class="modal-card">
        <h3>Confirm Action</h3>
        <button @click="isOpen = false">Cancel</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
</style>
```

Even though the modal markup lives under `<body>`, it accesses `isOpen` and receives events from `ConfirmModal` seamlessly.

## Go deeper

Multiple `<Teleport>` components can target the exact same DOM node (e.g. multiple notifications targeting `#toast-container`). Vue appends them in order of mount.

> **Tip:** You can use any valid CSS selector for the `to` attribute, such as `to="#modals"` or `to="body"`.

## Watch out

- The target DOM element (e.g. #modal-target) must already exist in the DOM when Teleport mounts.
- Teleport changes only the physical DOM node location; Vue component hierarchy and Provide/Inject remain unchanged.

## Remember

- <Teleport to="..."> transports rendered markup into a different DOM container.
- Eliminates CSS overflow: hidden and z-index clipping for modals and tooltips.
- Component logic, reactive state, and event bubbling remain logically tied to the parent.
