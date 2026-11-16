---
slug: mouse-tracker-composable
title: "Building a Mouse Tracker Composable"
topic: composables
kind: technique
summary: "Build a practical useMouse composable that manages mouse coordinates and window event cleanup."
tags: [composables, usemouse, event-listeners, lifecycle]
related: [what-is-a-composable, fetch-composable, on-unmounted]
---
> **In one line:** Encapsulate mouse coordinate tracking and window event listener cleanup in useMouse.

## The idea

To truly grasp the elegance of composables, let's build the canonical example: a **mouse tracker** that observes the user's cursor position.

If you implemented mouse tracking inside a component, you would need:
1. Two refs for `x` and `y`.
2. A mousemove event listener attached to `window` inside `onMounted`.
3. An `onUnmounted` hook to remove the event listener to prevent memory leaks.

If ten different components need cursor coordinates, writing this logic in ten places causes massive duplication.

By extracting this into a **`useMouse` composable**, any component can track coordinates in a single line of code, while the composable manages its own lifecycle and cleanup automatically!

## See it

```typescript
// useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent) {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  onMounted(() => {
    window.addEventListener('mousemove', update);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });

  return { x, y };
}
```

Consuming it in a component:

```html
<!-- CoordinatesCard.vue -->
<script setup lang="ts">
import { useMouse } from './useMouse';

// One line gets live coordinates and auto-cleanup!
const { x, y } = useMouse();
</script>

<template>
  <div class="card">
    <p>Cursor Position: X: {{ x }}, Y: {{ y }}</p>
  </div>
</template>
```

When `CoordinatesCard` mounts, the listener attaches. When it unmounts, the listener is cleanly removed.

## Go deeper

Notice how lifecycle hooks (`onMounted`, `onUnmounted`) can be called directly inside composables. Vue binds them to the component instance currently executing `setup()`.

> **Tip:** You can compose composables inside other composables! For example, `useDrag` can internally use `useMouse`.

## Watch out

- Ensure event listeners attached to window in a composable are always removed in onUnmounted.
- Remember that calling useMouse() inside an async function will fail to bind lifecycle hooks.

## Remember

- Composables can register their own onMounted and onUnmounted lifecycle hooks.
- Lifecycle hooks inside composables bind to the calling component instance automatically.
- Self-contained composables handle their own setup and teardown to prevent memory leaks.
