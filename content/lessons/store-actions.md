---
slug: store-actions
title: "Store Actions: Sync and Async"
topic: routing-state
kind: api
summary: "Actions encapsulate business logic, API requests, and complex state mutations."
tags: [pinia, actions, async, methods]
related: [define-store, store-state, store-getters]
---
> **In one line:** Actions are methods defined in stores that handle synchronous or asynchronous business logic.

## The idea

While simple state mutations can be done directly, real-world applications have **business logic** that belongs to the data layer: logging in a user, validating input, making API requests, and handling errors.

In Pinia, these operations are written as **actions**.

Actions can be completely **synchronous or asynchronous**:
- Synchronous actions perform validation, reset forms, or compute state transforms.
- Asynchronous actions use standard `async/await` to fetch data from backend servers and commit the results to state.

```sequence
actor comp: Component | user click
actor store: Store Action | async method @blue
actor api: Backend API | REST endpoint @green
comp -> store: store.login(creds)
store -> api: POST /api/login
api --> store: returns user token
note store: mutates state.user @green
```

## See it

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const profile = ref<any>(null);
  const isLoading = ref(false);

  // Asynchronous action
  async function fetchProfile(userId: string) {
    isLoading.value = true;
    try {
      const res = await fetch(`/api/users/${userId}`);
      profile.value = await res.json();
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      isLoading.value = false;
    }
  }

  return { profile, isLoading, fetchProfile };
});
```

In your component:

```html
<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../stores/user';

const userStore = useUserStore();

onMounted(() => {
  // Call the store action like a regular function:
  userStore.fetchProfile('user-101');
});
</script>

<template>
  <div v-if="userStore.isLoading">Loading...</div>
  <div v-else-if="userStore.profile">{{ userStore.profile.name }}</div>
</template>
```

Actions can be called directly on the store instance without dispatchers.

## Go deeper

You can subscribe to action invocations using `store.$onAction()` to implement global analytics logging or error notification toasts.

> **Tip:** Actions return promises automatically when declared as `async`, allowing components to await their completion.

## Watch out

- Do not invent separate "mutations"; in Pinia, actions mutate state directly.
- Always handle errors with try/catch inside async actions to prevent unhandled promise rejections.

## Remember

- Actions are store methods that encapsulate business logic and API requests.
- Actions can be fully asynchronous using standard async/await syntax.
- Called directly on the store instance just like standard JavaScript methods.
