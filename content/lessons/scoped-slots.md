---
slug: scoped-slots
title: "Scoped Slots"
topic: slots-provide
kind: technique
summary: "Scoped slots pass data from the child outlet back to the parent slot template."
tags: [scoped-slots, slots, renderless-components, data-passing]
related: [default-slot, named-slots, what-is-a-composable]
---
> **In one line:** Scoped slots pass data from child component outlets back into parent template slots.

## The idea

Normally, slot content cannot access data that lives inside the child component. However, many powerful UI patterns—like list views, data tables, or autocomplete dropdowns—need the child to manage the data fetching and layout, while letting the **parent customize how each item looks**.

Vue solves this with **scoped slots**.

In the child component, bind attributes to the `<slot :item="item" :index="index">` outlet just like passing props. In the parent component, receive those bound properties using `<template #default="{ item, index }">`.

## See it

```html
<!-- GenericList.vue (Child) -->
<script setup lang="ts">
defineProps<{
  items: string[];
}>();
</script>

<template>
  <ul class="list">
    <li v-for="(item, index) in items" :key="item">
      <!-- Expose item and index to the parent -->
      <slot :item="item" :index="index">
        {{ item }} <!-- Fallback if parent provides no custom template -->
      </slot>
    </li>
  </ul>
</template>
```

Parent usage:

```html
<!-- App.vue (Parent) -->
<script setup lang="ts">
import { ref } from 'vue';
import GenericList from './GenericList.vue';

const languages = ref(['TypeScript', 'Rust', 'Go', 'Python']);
</script>

<template>
  <GenericList :items="languages">
    <!-- Parent customizes the item presentation using child slot data -->
    <template #default="{ item, index }">
      <span class="badge">#{{ index + 1 }}</span>
      <strong>{{ item }}</strong>
    </template>
  </GenericList>
</template>
```

The parent receives `item` and `index` from the child for every row and renders custom markup.

## Go deeper

Scoped slots are the foundation of **headless components**: components that contain complex logic (keyboard navigation, selection, sorting) but leave all visual rendering to the consumer.

> **Tip:** You can combine named slots with scoped slots: `<template #item="{ data }">`.

## Watch out

- Data passed to a scoped slot is only accessible inside that specific <template> tag.
- Destructuring scoped slot props with default values (e.g. #default="{ item = {} }") works just like standard JS.

## Remember

- Bind attributes to <slot :prop="val"> to pass data from child to parent.
- Receive slot data in parent with #slotName="slotProps" or object destructuring.
- Enables headless and data-table components with custom row rendering.
