---
slug: emitting-events
title: "Emitting Events with Payloads"
topic: events-vmodel
kind: technique
summary: "Dispatch events and pass payload arguments from child to parent handlers."
tags: [emit, payloads, events, communication]
related: [define-emits, component-v-model, v-on-listening]
---
> **In one line:** emit('event', payload) dispatches custom events with data arguments to parent handlers.

## The idea

When a child component emits an event, it frequently needs to send data along with it: the updated text of an input, the ID of a deleted row, or the coordinates of a click.

To pass data, pass extra arguments to the **`emit()`** function after the event name:

```typescript
// Child emits event with arguments:
emit('select-user', user.id, user.name);

// Parent method handler receives arguments in order:
function handleUserSelect(id: string, name: string) {
  console.log('Selected:', id, name);
}
```

If you use an inline statement in the parent template, you can access the emitted payload using the special **`$event`** variable: `@select-user="currentId = $event"`.

## See it

```html
<!-- RatingStars.vue (Child) -->
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'rate', score: number): void;
}>();
</script>

<template>
  <div class="stars">
    <button v-for="star in 5" :key="star" @click="emit('rate', star)">
      ★ {{ star }}
    </button>
  </div>
</template>
```

In the parent component:

```html
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import RatingStars from './RatingStars.vue';

const rating = ref(0);

function handleRating(newScore: number) {
  rating.value = newScore;
  console.log('Saved new rating:', newScore);
}
</script>

<template>
  <div>
    <RatingStars @rate="handleRating" />
    <p>Current rating: {{ rating }} / 5</p>
  </div>
</template>
```

Clicking a star emits the number, which `handleRating` receives and saves to state.

## Go deeper

Always emit primitive IDs or shallow copies of objects rather than raw mutable references, ensuring the parent maintains sole authority over its data.

> **Tip:** You can use `$emit()` directly in the child template without defining an intermediate method: `@click="$emit('close')"`.

## Watch out

- In inline handlers, $event refers to the first emitted payload argument.
- Do not mutate objects received in event payloads without updating parent state properly.

## Remember

- Pass payload data as subsequent arguments: emit('event', data1, data2).
- Parent method handlers receive payload arguments in the same order.
- Inline parent handlers can access the payload via the $event variable.
