---
slug: dynamic-routes
title: "Dynamic Route Matching and useRoute()"
topic: routing-state
kind: technique
summary: "Define dynamic route segments with :param and read params and query strings with useRoute."
tags: [dynamic-routes, useroute, route-params, vue-router]
related: [router-setup, router-link-view, programmatic-navigation]
---
> **In one line:** Define route params with :param and access them in components via useRoute().params.

## The idea

Very often we need to map routes with the same structural layout to different data records: for example, `/users/12` and `/users/84` should both render the `UserProfile` component.

In Vue Router, you define dynamic segments using a colon prefix **`:paramName`**:

```typescript
{ path: '/users/:id', component: UserProfile }
```

Inside the component, you read route parameters and query strings using the **`useRoute()`** composable.

`useRoute()` returns a reactive route object containing:
- **`route.params`**: Dynamic path parameters (e.g. `{ id: '12' }`).
- **`route.query`**: URL query string parameters (e.g. `?sort=asc` &rarr; `{ sort: 'asc' }`).
- **`route.path`**: Full pathname string.

## See it

```html
<!-- views/UserProfileView.vue -->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userData = ref<any>(null);

async function loadUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  userData.value = await res.json();
}

onMounted(() => loadUser(route.params.id as string));
watch(() => route.params.id, (newId) => {
  if (newId) loadUser(newId as string);
});
</script>

<template>
  <div v-if="userData" class="profile">
    <h2>User Profile: {{ userData.name }}</h2>
    <p>User ID: {{ route.params.id }}</p>
  </div>
</template>
```

Navigating from `/users/1` to `/users/2` updates `route.params.id`, triggering the watcher.

## Go deeper

When navigating between routes that use the *same component instance* (like from `/users/1` to `/users/2`), Vue **reuses the existing component instance** for efficiency. Lifecycle hooks like `onMounted` do not re-run; always watch `route.params` to handle updates.

> **Tip:** You can set `props: true` on the route definition to pass `route.params` directly into the component as standard props!

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Component instances are reused when navigating between identical routes with different params; watch route.params.
- route.params values are always strings; typecast with Number() if you expect numeric IDs.

## Remember

- Define dynamic path segments with colon prefixes (e.g. /users/:id).
- useRoute() provides reactive access to params, query, and path.
- Watch route.params to react to parameter changes on reused components.
