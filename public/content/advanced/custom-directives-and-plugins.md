---
id: lesson-22
slug: custom-directives-and-plugins
title: "Custom Directives & Plugins"
level: advanced
order: 22
duration: 17
summary: "Write reusable low-level DOM behavior as custom directives, and package app-wide functionality (components, directives, provides) as installable plugins."
tags:
  - custom-directives
  - plugins
  - app-use
  - reusability
---

# Learning Objectives

By the end of this lesson you will be able to:

- Write a custom directive with lifecycle hooks.
- Register directives locally and globally.
- Read a directive's value, argument, and modifiers.
- Package functionality as a plugin and install it with `app.use`.

# Why It Matters

Most reuse in Vue happens through components and composables. But sometimes you need **low-level
DOM access** that many elements share — autofocus, click-outside, tooltips, lazy-loading images.
That's what **custom directives** are for. And when you want to configure the whole app once —
register global components, add a directive, provide a value — a **plugin** is the clean package
for it.

# Concept Explanation

### A custom directive

A directive is an object of **lifecycle hooks** that receive the element and a binding. Each hook
gets `el` (the DOM element) and `binding` (with `value`, `arg`, `modifiers`):

```typescript
const vFocus = {
  mounted(el: HTMLElement) {
    el.focus()
  },
}
```

In `<script setup>`, a local variable named `vName` is automatically usable as `v-name` in the
template:

```html
<script setup lang="ts">
const vFocus = {
  mounted: (el: HTMLElement) => el.focus(),
}
</script>

<template>
  <input v-focus />
</template>
```

### The hooks

Directive hooks mirror the component lifecycle: `created`, `beforeMount`, **`mounted`**,
`beforeUpdate`, **`updated`**, `beforeUnmount`, `unmounted`. Use `mounted`/`unmounted` to set up
and tear down (e.g. add and remove an event listener). A **function shorthand** registers the same
behavior for both `mounted` and `updated`:

```typescript
const vColor = (el: HTMLElement, binding: { value: string }) => {
  el.style.color = binding.value
}
```

### Value, argument, and modifiers

Directives can carry data like built-ins:

```html
<div v-tooltip:top.fade="'Hello'"></div>
```

```typescript
const vTooltip = {
  mounted(el: HTMLElement, binding: { value: string; arg?: string; modifiers: Record<string, boolean> }) {
    // binding.value === 'Hello', binding.arg === 'top', binding.modifiers.fade === true
  },
}
```

### Global registration

Register a directive for the whole app with `app.directive`:

```typescript
app.directive('focus', { mounted: (el) => el.focus() })
```

Now `v-focus` works in every component without importing it.

### Plugins

A **plugin** is an object with an `install(app, options)` method (or just a function). It bundles
app-wide setup and is applied with `app.use`:

```typescript
// plugins/i18n.ts
import type { App } from 'vue'

export const i18n = {
  install(app: App, messages: Record<string, string>) {
    // Provide a translation helper to the whole app
    const t = (key: string) => messages[key] ?? key
    app.provide('t', t)                     // injectable anywhere
    app.config.globalProperties.$t = t      // also usable in templates as $t
    app.directive('focus', { mounted: (el) => (el as HTMLElement).focus() })
  },
}
```

```typescript
// main.ts
import { i18n } from './plugins/i18n'
createApp(App).use(i18n, { hello: 'Hola' }).mount('#app')
```

Plugins commonly register global components/directives, `provide` values, add
`config.globalProperties`, or set up a library (Vue Router and Pinia are installed this way with
`app.use`).

# Key Terminology

- **Custom directive** — an object of hooks that apply low-level behavior to an element.
- **Binding** — the hook argument holding `value`, `arg`, and `modifiers`.
- **Function-shorthand directive** — a function registered for `mounted` + `updated`.
- **Plugin** — an installable package of app-wide setup, applied with `app.use`.

# Options and Trade-offs

| Tool | Reuses | Use when | Watch out for |
| ---- | ------ | -------- | ------------- |
| Component | Markup + logic + state | Most UI reuse | Not for cross-cutting DOM tweaks |
| Composable | Stateful logic | Reusable behavior in setup | Not attached to a specific element |
| Custom directive | Low-level DOM behavior | Focus, click-outside, tooltips | Keep them small and focused |
| Plugin | App-wide setup | Registering globals, libraries | Global surface — use deliberately |

# Worked Example

A `v-click-outside` directive that calls a handler when you click outside an element — packaged so
it cleans up after itself:

```typescript
// directives/clickOutside.ts
import type { Directive } from 'vue'

export const vClickOutside: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    el.__handler__ = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    document.addEventListener('click', el.__handler__)
  },
  unmounted(el) {
    document.removeEventListener('click', el.__handler__)
  },
}
```

```html
<script setup lang="ts">
import { ref } from 'vue'
import { vClickOutside } from './directives/clickOutside'
const open = ref(true)
</script>

<template>
  <div v-if="open" v-click-outside="() => (open = false)" class="menu">Menu</div>
</template>
```

`mounted` attaches the listener; `unmounted` removes it — so the directive is safe to use on
elements that come and go.

# Real World Analogy

A custom directive is a **power tool attachment**: a small, reusable behavior you clip onto any
element (focus it, watch for outside clicks). A plugin is a **whole toolkit you install in the
workshop once** — after `app.use`, its tools (global components, directives, helpers) are available
everywhere.

# Examples

## Example 1 — Basic: v-focus locally

```html
<script setup lang="ts">
const vFocus = { mounted: (el: HTMLElement) => el.focus() }
</script>

<template><input v-focus /></template>
```

**Why this works:** The `vFocus` local variable is exposed to the template as `v-focus`, and
`mounted` runs once the input exists.

## Example 2 — Real-world: a plugin providing a helper

```typescript
app.use({
  install(app) {
    app.provide('now', () => new Date())
  },
})
```

**Why this works:** The plugin `provide`s a helper that any component can `inject('now')`, set up in
one place.

## Example 3 — Trade-off / pitfall: a directive that leaks listeners

```typescript
const vBad = {
  mounted(el) {
    document.addEventListener('scroll', () => {/* … */}) // never removed!
  },
}
```

**Why this bites:** Adding a global listener in `mounted` without removing it in `unmounted` leaks
memory and keeps firing after the element is gone. Always clean up.

# Common Mistakes

- **Reaching for a directive when a component/composable fits** — directives are for low-level DOM.
- **Forgetting cleanup** in `unmounted`, leaking listeners.
- **Overusing global registration/plugins** and bloating the global surface.
- **Assuming directive hooks match old Vue 2 names** — Vue 3 renamed them (`bind`→`mounted`, etc.).

# Best Practices

- Use directives for **element-level** behavior (focus, click-outside, lazy-load); pair `mounted`
  with `unmounted` for cleanup.
- Register directives **locally** unless they're truly app-wide; then register globally or via a
  plugin.
- Use plugins to package app-wide setup cohesively (globals, `provide`, config).
- Keep each directive and plugin small and single-purpose.

# Summary

- A **custom directive** is an object of lifecycle hooks (`mounted`, `updated`, `unmounted`, …) that
  apply low-level DOM behavior; the hook receives `el` and a `binding` (`value`/`arg`/`modifiers`).
- In `<script setup>`, a `vName` variable is usable as `v-name`; `app.directive` registers globally.
- A **plugin** is an object with `install(app, options)` (or a function), applied with `app.use`,
  used for app-wide setup (globals, directives, `provide`).

# Flash Cards

Q: What is a custom directive for?
A: Applying reusable low-level DOM behavior to elements — like autofocus, click-outside, or tooltips — via lifecycle hooks that receive the element and a binding.

Q: In <script setup>, how do you make a local directive usable in the template?
A: Declare a variable named vSomething; Vue exposes it as v-something automatically.

Q: What does a directive's binding object contain?
A: The value passed to the directive, the arg (after the colon), and the modifiers (after dots) — plus you receive the element as el.

Q: What is a Vue plugin and how do you install it?
A: An object with an install(app, options) method (or a function) that does app-wide setup; you install it with app.use(plugin, options).

Q: Why must a directive that adds an event listener also define unmounted?
A: To remove the listener when the element is destroyed; otherwise it leaks memory and keeps firing after the element is gone.

# Exercises

### Easy
Write a local `v-focus` directive and apply it to an input so it focuses on mount.

### Medium
Create a `v-color` function-shorthand directive that sets an element's text color from its value,
updating when the value changes.

### Challenging
Build a `v-click-outside` directive (with proper `unmounted` cleanup) and package it, plus a global
`$formatDate` helper, into a plugin installed with `app.use`. Use both in a dropdown component.

# Further Reading

- [Custom Directives](https://vuejs.org/guide/reusability/custom-directives.html)
- [Plugins](https://vuejs.org/guide/reusability/plugins.html)
