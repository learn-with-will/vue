---
slug: nested-routes
title: "Nested Routes and Sub-Views"
topic: routing-state
kind: technique
summary: "Construct nested layouts using the children route option and nested RouterView components."
tags: [nested-routes, sub-views, layouts, vue-router]
related: [router-setup, router-link-view, navigation-guards]
---
> **In one line:** Nested routes map URL segments to nested <RouterView> outlets inside layout components.

## The idea

Modern UI applications often contain nested layout structures: a top-level navbar, inside of which sits an Account settings screen with its own sidebar tabs (Profile, Security, Billing).

Vue Router models this relationship through **nested routes** using the **`children`** configuration array.

```tree
URL and Component Hierarchy
  /account renders AccountView.vue with nested RouterView
    /account/profile renders ProfileTab.vue inside AccountView
    /account/billing renders BillingTab.vue inside AccountView
```

When the user navigates to `/account/profile`, the root `<RouterView>` renders `AccountView`, and the nested `<RouterView>` inside `AccountView` renders `ProfileTab`.

## See it

```typescript
// router/index.ts
import AccountView from '../views/AccountView.vue';
import ProfileTab from '../views/ProfileTab.vue';
import BillingTab from '../views/BillingTab.vue';

const routes = [
  {
    path: '/account',
    component: AccountView,
    children: [
      // Child paths are relative to parent (no leading /)
      { path: 'profile', component: ProfileTab },
      { path: 'billing', component: BillingTab }
    ]
  }
];
```

In the parent layout component:

```html
<!-- views/AccountView.vue -->
<template>
  <div class="account-layout">
    <aside class="sidebar">
      <RouterLink to="/account/profile">Profile Settings</RouterLink>
      <RouterLink to="/account/billing">Billing & Plans</RouterLink>
    </aside>

    <section class="tab-pane">
      <!-- Nested outlet for child routes: -->
      <RouterView />
    </section>
  </div>
</template>
```

Only the child tab re-renders when switching between Profile and Billing; the sidebar remains intact.

## Go deeper

If you want a default child route to render when visiting the parent path directly (`/account`), define a child with an empty path: `{ path: '', component: DefaultTab }`.

> **Tip:** Child paths that start with a slash `/` are treated as absolute root paths. Omit the leading slash for relative nested paths.

## Watch out

- Child route paths must NOT start with a leading slash unless deliberately intended as root paths.
- Remember that the parent component MUST include a <RouterView /> tag for children to appear.

## Remember

- Configure nested routes using the children: [] array on route definitions.
- Parent components render child routes inside their own nested <RouterView />.
- Child paths without leading slashes are relative to their parent path.
