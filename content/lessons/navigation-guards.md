---
slug: navigation-guards
title: "Navigation Guards and Authentication"
topic: routing-state
kind: pattern
summary: "Protect routes and handle redirects before navigation completes using router.beforeEach."
tags: [navigation-guards, auth, middleware, security]
related: [router-setup, programmatic-navigation, pinia-setup]
---
> **In one line:** router.beforeEach() intercepts navigations to check permissions, redirect, or cancel.

## The idea

Applications often need to protect private pages: preventing unauthenticated users from accessing an admin dashboard, checking session validity, or confirming that the user wants to leave a page with unsaved form changes.

Vue Router provides **Navigation Guards** to intercept navigation requests before they resolve.

The most widely used guard is the **Global Before Guard: `router.beforeEach()`**. It executes before every route transition.

```flow
nav: User navigates to /admin @primary
guard: router.beforeEach(to, from) @blue
check: Is user logged in? @amber
grant: return true (proceed to /admin) @green
deny: return '/login' (redirect) @red
nav -> guard
guard -> check
check -> grant: Yes
check -> deny: No
```

The guard function receives `(to, from)`. You return:
- **`true`**: Allow the navigation to proceed.
- **`false`**: Cancel the navigation (stay on current page).
- **A route location string or object** (e.g. `'/login'`): Redirect the user to that route.

## See it

```typescript
import { router } from './router';

router.beforeEach((to, from) => {
  const isAuthenticated = Boolean(localStorage.getItem('user_token'));

  // Check if target route requires authentication via route meta
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect unauthenticated users to login page
    return {
      path: '/login',
      query: { redirect: to.fullPath } // Save target for redirect back
    };
  }

  // Allow navigation to proceed
  return true;
});
```

In your route definitions, attach metadata using the `meta` property: `{ path: '/admin', component: Admin, meta: { requiresAuth: true } }`.

## Go deeper

Beyond global guards, Vue Router also supports **per-route guards** (`beforeEnter` on route objects) and **in-component guards** (`onBeforeRouteLeave`, `onBeforeRouteUpdate`).

> **Tip:** You can make guard functions async and await backend permission checks.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- In Vue Router 4, return a value or promise from the guard; avoid using the legacy next() callback.
- Beware of infinite redirect loops if your redirect target route also requires authentication!

## Remember

- router.beforeEach() intercepts navigations before route transitions complete.
- Return true to allow, false to cancel, or a route location to redirect.
- Attach route metadata with meta: {} to declare authentication requirements.
