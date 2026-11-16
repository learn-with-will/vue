---
slug: named-slots
title: "Named Slots"
topic: slots-provide
kind: technique
summary: "Distribute content to multiple distinct outlets using named slots with the # shorthand."
tags: [slots, named-slots, layouts, v-slot]
related: [default-slot, slot-fallback, scoped-slots]
---
> **In one line:** Use <slot name="header"> and <template #header> to distribute markup into multiple outlets.

## The idea

Real-world layout components (like cards, modals, or page layouts) rarely need just one single content outlet. They typically require distinct slots for a header, a main body, and a footer.

Vue accommodates this with **named slots**.

In the child component, assign a `name` attribute to each `<slot>`:
- An unnamed `<slot>` has the implicit name `"default"`.
- Named slots take explicit names: `<slot name="header">`, `<slot name="footer">`.

In the parent component, target a named slot by wrapping content inside a `<template>` tag using the **`v-slot` directive** or its standard shorthand: the **`#`** symbol.

```html
<template v-slot:header>  <!-- Full syntax -->
<template #header>        <!-- Standard shorthand -->
```

## See it

```html
<!-- AppCard.vue (Child) -->
<template>
  <div class="card">
    <header class="card-header">
      <slot name="header"></slot>
    </header>

    <main class="card-body">
      <!-- Default slot for main content -->
      <slot></slot>
    </main>

    <footer class="card-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

Parent usage:

```html
<!-- App.vue (Parent) -->
<script setup lang="ts">
import AppCard from './AppCard.vue';
</script>

<template>
  <AppCard>
    <template #header>
      <h3>System Alert</h3>
    </template>

    <p>Server maintenance scheduled for 02:00 UTC.</p>

    <template #footer>
      <button>Acknowledge</button>
    </template>
  </AppCard>
</template>
```

Vue distributes each chunk of content into its matching slot outlet in the child.

## Go deeper

Any content not explicitly wrapped in a `<template #name>` is automatically assigned to the default slot.

> **Tip:** You can use dynamic slot names with square brackets: `<template #[dynamicSlotName]>`.

## Watch out

- v-slot and # can only be applied to <template> tags (or directly to a single-slot component tag).
- Slot names are case-sensitive; match casing accurately between child and parent.

## Remember

- <slot name="xyz"> defines a named slot outlet in the child component.
- The #xyz shorthand on a <template> targets content to that outlet.
- An un-named <slot> has the implicit name "default" (#default).
