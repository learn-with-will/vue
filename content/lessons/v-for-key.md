---
slug: v-for-key
title: "The key Attribute in v-for"
topic: template-directives
kind: pattern
summary: "A unique key gives Vue an identity hint for each item to efficiently reuse and reorder DOM nodes."
tags: [key, v-for, virtual-dom, performance]
related: [v-for-lists, avoid-v-if-with-v-for, v-if-conditional]
---
> **In one line:** The key attribute provides a unique identity for each v-for item, enabling efficient DOM reuse.

## The idea

When Vue updates a list rendered with `v-for`, its default strategy is "in-place patch". If the order of items changes, Vue does not move the DOM elements to match the new order; instead, it patches each existing DOM node in place with the new content.

This default strategy is fast for simple lists, but causes severe bugs when items contain temporary DOM state (such as input text, focus states, or CSS transitions).

To give Vue a hint so that it can track each node's identity and accurately reuse or reorder existing elements, you must provide a **unique `key` attribute** for each item.

```tree
Virtual DOM List Reconciliation
  With unique :key="item.id"
    [Move] Vue reorders existing DOM nodes accurately @green
  Without key or with array index
    [Patch] Vue overwrites content in place, scrambling input states @amber
```

The key should always be a unique primitive (string or number), typically an ID from your database.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const tasks = ref([
  { id: 'task-1', title: 'Draft schema' },
  { id: 'task-2', title: 'Write tests' },
  { id: 'task-3', title: 'Review PR' }
]);

function shuffle() {
  tasks.value.reverse();
}
</script>

<template>
  <div>
    <button @click="shuffle">Reverse List</button>
    <ul>
      <!-- Good: unique ID as key preserves node identity -->
      <li v-for="task in tasks" :key="task.id">
        <input type="checkbox" /> {{ task.title }}
      </li>
    </ul>
  </div>
</template>
```

Because each `<li>` has `:key="task.id"`, checked checkboxes stay attached to their correct tasks even after reversing the array.

## Go deeper

The `key` attribute is not exclusive to `v-for`. You can also put a `key` on a single component or element to force Vue to tear it down and re-create it whenever the key changes.

> **Watch out:** Never use the array index as a key if the list can be sorted, filtered, or have items added or deleted.

## Watch out

- Using the array index as key breaks input state and animations when items are reordered or deleted.
- Do not use non-primitive values (like objects) as keys; keys must be strings or numbers.

## Remember

- key provides an identity hint for Vue Virtual DOM node reconciliation.
- Always bind :key to a unique, stable primitive ID (e.g. item.id).
- Never use array indices as keys for lists that can change order or length.
