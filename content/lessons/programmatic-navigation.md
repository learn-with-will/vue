---
slug: programmatic-navigation
title: "Programmatic Navigation with useRouter()"
topic: routing-state
kind: technique
summary: "Navigate programmatically in code using router.push, router.replace, and useRouter."
tags: [programmatic-navigation, userouter, router-push, vue-router]
related: [router-link-view, dynamic-routes, navigation-guards]
---
> **In one line:** useRouter() provides programmatic navigation methods like router.push() and router.replace().

## The idea

While `<RouterLink>` handles standard user clicks, you often need to navigate **via JavaScript logic**: redirecting to a dashboard after a successful login, going back when a cancel button is clicked, or navigating after an API call completes.

Vue Router provides programmatic navigation through the **`useRouter()`** composable.

Key navigation methods on the router instance:

| Method | Behavior | History Effect |
|---|---|---|
| `router.push(to)` | Navigates to a new URL | Adds a new entry to the browser history |
| `router.replace(to)` | Navigates to a new URL | Replaces current history entry (no back button) |
| `router.go(n)` | Moves forward or back | `router.go(-1)` moves back one step |

`router.push()` accepts a URL string or a location descriptor object with named routes and parameters.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isSubmitting = ref(false);

async function handleLogin() {
  isSubmitting.value = true;
  await new Promise(r => setTimeout(r, 500));
  isSubmitting.value = false;
  router.push({ name: 'dashboard', query: { loggedIn: 'true' } });
}
</script>

<template>
  <div class="login-pane">
    <button :disabled="isSubmitting" @click="handleLogin">Log In</button>
    <button @click="router.back()">Cancel</button>
  </div>
</template>
```

Upon login completion, `router.push()` immediately navigates the user to the dashboard view.

## Go deeper

`router.push()` returns a Promise that resolves when the navigation is completed, or rejects if navigation was aborted by a guard.

> **Tip:** Use `router.replace()` on login pages so that clicking the browser Back button doesn't take users back into the login form.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not confuse useRoute() (current URL info) with useRouter() (navigation actions).
- If you provide path in router.push({ path: '...', params: {} }), params will be ignored; use named routes for params.

## Remember

- useRouter() gives access to programmatic navigation methods.
- router.push() pushes a new history entry; router.replace() replaces the current one.
- Supports named route objects: router.push({ name: 'user', params: { id } }).
