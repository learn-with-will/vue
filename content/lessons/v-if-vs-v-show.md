---
slug: v-if-vs-v-show
title: "v-if vs v-show"
topic: template-directives
kind: pattern
summary: "Compare the initial render cost and toggle performance of v-if versus v-show to make the right choice."
tags: [v-if, v-show, performance, trade-offs]
related: [v-if-conditional, v-show-toggling, keep-alive-component]
---
> **In one line:** Use v-if for rare condition changes and v-show for frequent toggling.

## The idea

Choosing between `v-if` and `v-show` is a classic performance decision in Vue application design.

`v-if` is **lazy**: if the condition is false on initial render, Vue does nothing. It only compiles and mounts the element when the condition first becomes true. However, toggling `v-if` has a high switching cost because elements, components, and event handlers must be completely torn down and recreated.

In contrast, `v-show` has a **higher initial render cost** because it always mounts the element regardless of initial state. However, its toggle cost is virtually instantaneous: changing an inline CSS property from `display: block` to `display: none` takes microseconds.

| Property | v-if | v-show |
|---|---|---|
| DOM presence | Added / removed from DOM | Always present in DOM |
| Initial cost | Low (lazy when false) | Higher (always renders) |
| Toggle cost | High (mount / unmount) | Low (CSS display toggle) |
| Supports `v-else` | Yes | No |
| Lifecycle hooks | Runs onMounted / onUnmounted | Runs hooks once on initial load |

A simple rule of thumb: if something toggles repeatedly during normal usage (like tooltips or dropdowns), choose `v-show`. If a condition rarely changes (like user permission checks), choose `v-if`.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const isAdmin = ref(false);
const isTooltipVisible = ref(false);
</script>

<template>
  <div>
    <!-- v-if: High toggle cost, but permission rarely changes -->
    <div v-if="isAdmin" class="admin-panel">
      <h2>Admin Dashboard</h2>
    </div>

    <!-- v-show: Toggled frequently on mouse hover -->
    <div
      @mouseenter="isTooltipVisible = true"
      @mouseleave="isTooltipVisible = false"
    >
      Hover for help
      <span v-show="isTooltipVisible" class="tooltip">Help text</span>
    </div>
  </div>
</template>
```

`isAdmin` uses `v-if` so unauthorized DOM is never created; `isTooltipVisible` uses `v-show` for smooth, instant hover toggling.

## Go deeper

If you want `v-if` behavior (not rendering until needed) but also want to cache component instances across toggles, combine `v-if` with the built-in `<KeepAlive>` component.

> **Tip:** Never use `v-show` for security-critical UI like admin panels; hidden CSS can still be viewed in page source.

## Watch out

- Do not rely on v-show to hide sensitive data, as the markup is still accessible in DOM.
- Avoid placing complex, heavy sub-trees inside v-show if they are rarely opened.

## Remember

- v-if has higher toggle cost; v-show has higher initial render cost.
- Use v-show for frequent toggles like tabs, dropdowns, and tooltips.
- Use v-if for rare state transitions and condition branches with v-else.
