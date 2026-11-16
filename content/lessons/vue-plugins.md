---
slug: vue-plugins
title: "Creating and Installing Plugins"
topic: tooling-typescript
kind: tool
summary: "Package app-level features into reusable plugins using app.use and the install method."
tags: [plugins, app-use, reusability, ecosystem]
related: [app-provide, custom-directives-basics, router-setup]
---
> **In one line:** Vue plugins are objects with an install(app, options) method registered via app.use().

## The idea

Libraries like Vue Router, Pinia, and Vuetify are all packaged and distributed as **Vue Plugins**. Plugins allow third-party libraries or internal shared modules to package global functionality into a reusable unit.

A Vue plugin is simply an object exposing an **`install(app, options)`** method (or a plain function acting as the install method).

Inside `install()`, a plugin can:
1. Register global components with `app.component()`.
2. Register custom directives with `app.directive()`.
3. Provide global dependencies with `app.provide()`.
4. Configure global properties or error handlers with `app.config`.

Consumers install plugins by passing them to **`app.use(plugin, options)`**.

## See it

```typescript
// plugins/i18n.ts
import type { App, Plugin } from 'vue';

export interface I18nOptions {
  locale: string;
  translations: Record<string, Record<string, string>>;
}

export const i18nPlugin: Plugin<I18nOptions> = {
  install(app: App, options: I18nOptions) {
    const translate = (key: string) => options.translations[options.locale]?.[key] || key;
    app.provide('translate', translate);
  }
};

// In main.ts:
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.use(i18nPlugin, {
  locale: 'en',
  translations: { en: { greeting: 'Welcome!' } }
});
app.mount('#app');
```

The plugin encapsulates all registration into a clean, single-line `app.use()` invocation.

## Go deeper

`app.use()` automatically tracks installed plugins and ignores duplicate calls with the same plugin, ensuring idempotent execution.

> **Tip:** Export TypeScript options interfaces alongside your plugin for excellent consumer developer experience.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Always call app.use() BEFORE calling app.mount('#app').
- Avoid polluting app.config.globalProperties in Vue 3; prefer app.provide for type safety.

## Remember

- Vue plugins are objects with an install(app, options) method.
- Installed into applications using app.use(plugin, options).
- Used to register global components, directives, and provide dependencies.
