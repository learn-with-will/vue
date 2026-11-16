---
slug: router-link-view
title: "RouterLink and RouterView"
topic: routing-state
kind: api
summary: "Navigate with RouterLink and render active matching components with RouterView."
tags: [router-link, router-view, vue-router, navigation]
related: [router-setup, dynamic-routes, programmatic-navigation]
---
> **In one line:** RouterLink navigates without page reloads, and RouterView displays the active route component.

## The idea

Once Vue Router is installed, you construct your application's navigation layout using two fundamental components:

```tree
Vue Router Components
  <RouterLink to="/about">
    [Navigation] Renders an <a> tag that intercepts clicks to prevent page reloads @blue
  <RouterView />
    [Viewport] Outlet where the matched route component is dynamically rendered @green
```

Instead of standard HTML `<a href="...">` tags (which cause slow full-page browser reloads), you use **`<RouterLink>`**. It renders an `<a>` element with the correct `href`, but intercepts the click event to perform client-side navigation instantly.

**`<RouterView>`** is a dynamic component outlet. Whatever component matches the current browser URL is mounted inside this placeholder.

## See it

```html
<!-- App.vue -->
<script setup lang="ts">
// RouterLink and RouterView are globally available!
</script>

<template>
  <div class="layout">
    <nav class="nav-bar">
      <!-- RouterLink prevents page reload -->
      <RouterLink to="/" active-class="active-link">Home</RouterLink>
      <RouterLink :to="{ name: 'about' }" active-class="active-link">About</RouterLink>
    </nav>

    <main class="content">
      <!-- Active route component renders right here: -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.active-link { font-weight: bold; color: #1f8a60; }
</style>
```

Clicking "About" switches the content inside `<RouterView />` instantly without flickering or reloading.

## Go deeper

`<RouterLink>` automatically applies the CSS class `router-link-active` (and `router-link-exact-active`) when its target matches the current URL, making active link styling trivial.

> **Tip:** You can pass an object to `:to` using named routes: `:to="{ name: 'user', params: { id: '42' } }"`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not use plain <a href="..."> for internal routes; it forces a full-page reload and wipes in-memory state.
- Multiple <RouterView /> elements can be used simultaneously with named views for multi-pane layouts.

## Remember

- <RouterLink to="..."> performs instant client-side navigation without page reloads.
- <RouterView /> renders the active component matching the current browser URL.
- Active navigation links automatically receive active CSS classes.
