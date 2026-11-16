---
slug: router-setup
title: "Setting up Vue Router"
topic: routing-state
kind: tool
summary: "Configure client-side routing using createRouter and createWebHistory from vue-router."
tags: [vue-router, routing, create-router, spa]
related: [router-link-view, dynamic-routes, history-modes]
---
> **In one line:** createRouter() configures route mappings and history mode for client-side navigation.

## The idea

Single-Page Applications (SPAs) deliver fluid user experiences by updating the view dynamically in the browser without reloading the entire page on every link click. The official library for handling client-side routing in Vue is **Vue Router**.

Setting up Vue Router requires three steps:
1. Define a list of **routes**, where each route maps a URL `path` to a component.
2. Initialize the router instance with **`createRouter()`**, choosing a history implementation (like `createWebHistory()`).
3. Install the router plugin into your application with **`app.use(router)`**.

```flow
routes: Route config [ { path: '/', component: Home } ] @primary
router: createRouter({ history, routes }) @blue
app: app.use(router) before app.mount() @green
routes -> router: configure routes
router -> app: register router plugin
```

Once installed, Vue Router provides global navigation components (`<RouterLink>`, `<RouterView>`) and composables (`useRoute`, `useRouter`) across your entire application.

## See it

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView }
  ]
});

// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
```

The router is instantiated with two paths and plugged into the Vue application before mounting.

## Go deeper

Naming routes with a `name` property (like `name: 'home'`) enables **named navigation**, allowing you to change URL paths in router config without breaking link tags across your codebase.

> **Tip:** You can lazy-load route components using dynamic `import()` statements to optimize bundle size: `component: () => import('./views/AboutView.vue')`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Ensure app.use(router) is called before app.mount('#app'); mounting first leads to missing router context.
- Web history mode requires proper server configuration to rewrite all requests to index.html.

## Remember

- Vue Router is the official routing solution for Vue single-page apps.
- createRouter({ history, routes }) creates the isolated router instance.
- Register with app.use(router) before mounting the application.
