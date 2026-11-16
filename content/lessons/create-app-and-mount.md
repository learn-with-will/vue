---
slug: create-app-and-mount
title: "Creating and Mounting an App"
topic: foundations
kind: api
summary: "createApp initializes a new Vue application instance and mount connects it to a root DOM container."
tags: [createapp, mount, bootstrapping, root-component]
related: [what-is-vue, progressive-framework, directives-overview]
---
> **In one line:** createApp boots a Vue application instance and mount attaches it to a container element.

## The idea

Every Vue application begins by creating a new **application instance** using the `createApp` function. This instance acts as the root context where you register application-wide configuration, plugins, custom directives, and global components.

Once the instance is configured, you call `.mount()` passing a CSS selector or DOM element. This tells Vue which HTML container on the webpage it owns.

```flow
entry: main.ts | createApp(App) @primary
config: app.use(router) | register plugins @blue
dom: mount('#app') | attach to DOM @green
entry -> config
config -> dom: renders App into #app
```

The `mount` method renders the root component into the target container and replaces its contents. Unlike legacy frameworks that polluted global prototypes, each `createApp` instance is completely isolated, allowing multiple independent Vue apps to coexist peacefully on the same HTML page.

## See it

```typescript
import { createApp } from 'vue';
import App from './App.vue';

// 1. Create the application instance with the root component
const app = createApp(App);

// 2. Configure application-level plugins or error handlers
app.config.errorHandler = (err) => {
  console.error('Global error:', err);
};

// 3. Mount to the container element with id="app"
app.mount('#app');
```

In `index.html`, you provide the matching host element: `<div id="app"></div>`. When `app.mount('#app')` executes, Vue renders `App.vue` inside that div.

## Go deeper

The `.mount()` method returns the root component instance rather than the app instance. For chaining configuration, perform all `app.use()` or `app.component()` calls before calling `.mount()`.

> **Tip:** You can pass an inline object to `createApp` for quick demos instead of importing a root `.vue` file.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Make sure the target mount element exists in the DOM before calling app.mount().
- Configuration methods like app.use() must be invoked before mounting the application.

## Remember

- createApp initializes an isolated Vue application instance.
- mount attaches the application to a DOM container element.
- Application configuration and plugins must be registered before mount.
