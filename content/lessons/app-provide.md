---
slug: app-provide
title: "Application-Level Provide"
topic: slots-provide
kind: api
summary: "app.provide provides global dependencies available to every component in the entire application."
tags: [app-provide, globals, plugins, dependency-injection]
related: [provide-and-inject, injection-keys, vue-plugins]
---
> **In one line:** app.provide() makes a dependency available to every component in the application instance.

## The idea

While `provide()` inside a component limits data distribution to that component's sub-tree, you sometimes need dependencies available to **every component across the entire application**: an API client, an authentication service, or internationalization (i18n) translations.

You can register application-wide dependencies using **`app.provide()`** on the application instance before mounting:

```typescript
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Available to every component in the app!
app.provide('apiEndpoint', 'https://api.example.com');
```

Any component in your application can now inject `'apiEndpoint'` without needing a root wrapper component. This is also the standard mechanism used by Vue plugins to expose services.

## See it

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

interface LoggerService {
  log: (msg: string) => void;
}

const logger: LoggerService = {
  log: (msg: string) => console.log(`[APP LOG]: ${msg}`)
};

const app = createApp(App);

// Provide globally before mount
app.provide('logger', logger);

app.mount('#app');
```

Now in any component at any level of your application:

```html
<!-- AnyComponent.vue -->
<script setup lang="ts">
import { inject } from 'vue';

const logger = inject<any>('logger');
logger?.log('Component loaded successfully!');
</script>

<template>
  <div>Dashboard View</div>
</template>
```

The logger is injected cleanly without any prop drilling or global window pollution.

## Go deeper

`app.provide` is preferable over legacy Vue 2 `app.config.globalProperties` because it supports TypeScript `InjectionKey` types and is easier to mock in unit tests.

> **Tip:** You can override an `app.provide()` value locally in any sub-tree by calling component-level `provide()` with the same key.

## Watch out

- Always call app.provide() BEFORE invoking app.mount('#app').
- Do not use app.provide for volatile reactive state that changes on every tick; use Pinia stores instead.

## Remember

- app.provide() registers global dependencies on the createApp instance.
- Available to all components in the application without root wrappers.
- Supports Symbol InjectionKeys for full type safety across the entire app.
