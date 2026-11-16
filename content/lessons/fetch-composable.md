---
slug: fetch-composable
title: "Building an Async Data Fetching Composable"
topic: composables
kind: technique
summary: "Build a reactive useFetch composable that handles loading states, errors, and URL changes."
tags: [usefetch, composables, async, http]
related: [what-is-a-composable, composable-arguments, watch-effect]
---
> **In one line:** Build a reactive useFetch composable to encapsulate loading, data, and error states.

## The idea

Fetching data from a REST API is one of the most repetitive tasks in web engineering. In every view, you typically write:
- A `data` ref.
- An `isLoading` boolean ref.
- An `error` ref.
- A `try/catch/finally` fetch block.

Extracting this pattern into a **`useFetch` composable** encapsulates all of this boilerplate into a reusable, declarative function.

Even better, we can make the composable **reactive to URL changes**: if the provided URL is a reactive ref (e.g. when changing page or filter params), `useFetch` can use `watchEffect` to re-fetch the data automatically!

## See it

```typescript
// useFetch.ts
import { ref, watchEffect, toValue, type MaybeRefOrGetter } from 'vue';

export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const isLoading = ref(true);

  watchEffect(async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await fetch(toValue(url));
      data.value = await res.json();
    } catch (err: any) {
      error.value = err;
    } finally {
      isLoading.value = false;
    }
  });

  return { data, error, isLoading };
}
```

Using it in a component:

```html
<script setup lang="ts">
import { ref } from 'vue';
import { useFetch } from './useFetch';

const id = ref('1');
const { data: user, isLoading, error } = useFetch(() => `/api/users/${id.value}`);
</script>

<template>
  <div>
    <button @click="id = '2'">Load User 2</button>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">Error: {{ error.message }}</p>
    <pre v-else>{{ user }}</pre>
  </div>
</template>
```

Changing `id` re-evaluates the URL and automatically fires a new fetch.

## Go deeper

Using `MaybeRefOrGetter` and `toValue()` allows `useFetch` to accept static strings, reactive refs, or getter functions interchangeably.

> **Tip:** You can expand `useFetch` to support request cancellation via `AbortController` on cleanup.

## Watch out

- Handle race conditions if subsequent network requests complete out of order.
- Ensure error states are cleared before starting new fetch operations.

## Remember

- useFetch encapsulates loading, error, and data states into a unified composable.
- watchEffect automatically re-fetches when reactive URL parameters change.
- Returns reactive refs so components can render loading spinners and error alerts.
