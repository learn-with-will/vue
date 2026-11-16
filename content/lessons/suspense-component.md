---
slug: suspense-component
title: "Async Dependencies with <Suspense>"
topic: advanced-reactivity
kind: api
summary: "Coordinate asynchronous component loading and fallback spinners with the built-in Suspense component."
tags: [suspense, async, fallback, built-in-components]
related: [suspense-status, define-async-component, teleport-basics]
---
> **In one line:** <Suspense> coordinates async component loading with a declared #fallback template.

## The idea

When a view contains multiple components that perform asynchronous operations—such as top-level `await` in `<script setup>` or async component imports—managing separate loading spinners for every individual child causes jarring layout shifts.

Vue provides the built-in **`<Suspense>`** component to coordinate nested async dependencies into a single cohesive loading state.

`<Suspense>` provides two slots:
1. **`#default`**: The main content containing async components.
2. **`#fallback`**: The fallback UI (such as a skeleton loader or spinner) displayed while async dependencies are resolving.

```tree
Suspense Orchestration
  Suspense container
    default slot renders component with top-level await
    fallback slot renders spinner while resolving
```

Vue waits until all async dependencies inside `#default` have resolved before swapping out the fallback UI.

## See it

```html
<!-- UserDetails.vue (Child with top-level await) -->
<script setup lang="ts">
// Top-level await automatically makes this an async dependency!
const res = await fetch('/api/user/current');
const user = await res.json();
</script>

<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>Email: {{ user.email }}</p>
  </div>
</template>
```

In the parent component:

```html
<!-- App.vue (Parent) -->
<script setup lang="ts">
import UserDetails from './UserDetails.vue';
</script>

<template>
  <Suspense>
    <!-- Render child once its top-level await completes -->
    <template #default>
      <UserDetails />
    </template>

    <!-- Show spinner while fetching -->
    <template #fallback>
      <div class="spinner">Loading user data...</div>
    </template>
  </Suspense>
</template>
```

The spinner displays automatically while `UserDetails.vue` resolves its top-level `await`.

## Go deeper

`<Suspense>` can coordinate multiple nested async components simultaneously: the fallback stays visible until *every* async child has resolved.

> **Tip:** You can catch async errors thrown inside `<Suspense>` using the `onErrorCaptured` lifecycle hook in an ancestor component.

## Watch out

- Suspense requires exactly one single root element inside its #default slot.
- Remember that Suspense is currently an experimental feature in Vue 3 (covered next).

## Remember

- <Suspense> manages async components and top-level await dependencies.
- Renders the #fallback slot while asynchronous components resolve.
- Swaps to the #default slot once all async operations have settled.
