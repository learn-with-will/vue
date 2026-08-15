---
id: lesson-02
slug: creating-an-application-and-template-syntax
title: "Creating an Application & Template Syntax"
level: beginner
order: 2
duration: 18
summary: "Create and mount a Vue app with createApp, then learn template syntax: text interpolation, attribute bindings with v-bind, directives, and the : and @ shorthands."
tags:
  - createapp
  - template-syntax
  - v-bind
  - directives
---

# Learning Objectives

By the end of this lesson you will be able to:

- Create and mount a Vue application with `createApp`.
- Insert dynamic text with interpolation, and understand when to use `v-html`.
- Bind element attributes with `v-bind` and its `:` shorthand.
- Explain what a **directive** is and read its parts (name, argument, modifier).
- Use the `@` shorthand for `v-on`.

# Why It Matters

Every Vue app starts the same way: you create an application instance and mount it onto a
real DOM element. From there, the **template** is where you spend most of your time — it's
the HTML that Vue keeps in sync with your data. Knowing template syntax well means you can
read and write almost any Vue component.

# Concept Explanation

### Creating and mounting an app

`createApp` builds an application instance from a **root component**. Calling `.mount()`
with a CSS selector attaches it to an element on the page and renders it.

```typescript
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

Everything inside `<div id="app"></div>` in your HTML is now controlled by Vue. You
typically call `.mount()` exactly once, at the app's entry point.

### Text interpolation

The most basic binding is **text interpolation** with double curly braces — the
"Mustache" syntax:

```html
<span>Message: {{ msg }}</span>
```

Vue replaces `{{ msg }}` with the value of the expression `msg` and keeps it updated. The
contents can be any single JavaScript **expression** (not a statement), so `{{ count + 1 }}`
and `{{ ok ? 'Yes' : 'No' }}` both work, but `{{ if (ok) {...} }}` does not.

Interpolation always renders as **plain text**. To render real HTML, use the `v-html`
directive — but only on trusted content, because it can expose you to cross-site scripting
(XSS) if the HTML comes from users:

```html
<p v-html="rawHtml"></p>
```

### Attribute bindings

Mustaches don't work inside HTML attributes. To bind an attribute to a value, use
**`v-bind`**:

```html
<a v-bind:href="url">Visit</a>
```

This is so common that `v-bind` has a shorthand — a leading colon:

```html
<a :href="url">Visit</a>
```

If the bound value is `null` or `undefined`, the attribute is removed. Boolean attributes
like `disabled` are added or removed based on truthiness:

```html
<button :disabled="isLoading">Save</button>
```

### Directives

A **directive** is a special template attribute that starts with `v-`. It applies
reactive behavior to the DOM. Some directives take an **argument** after a colon and a
**modifier** after a dot:

```text
v-on:click.prevent="onSubmit"
│    │     │        └ value (the handler)
│    │     └ modifier (call event.preventDefault())
│    └ argument (the "click" event)
└ directive name
```

`v-on` (listen for events) has its own shorthand, `@`:

```html
<button @click="count++">Add</button>
```

You'll meet more directives — `v-if`, `v-for`, `v-model` — in later lessons. They all
follow this same name/argument/modifier shape.

# Key Terminology

- **Application instance** — the object returned by `createApp`, mounted onto the page.
- **Root component** — the top-level component passed to `createApp`.
- **Interpolation** — inserting a value into text with `{{ }}`.
- **Directive** — a `v-`-prefixed template attribute that applies reactive behavior.
- **Argument** — the part after a directive's colon (e.g. the `href` in `:href`).
- **Modifier** — a suffix after a dot that tweaks a directive (e.g. `.prevent`).

# Options and Trade-offs

| Option | What it does | Use when | Watch out for |
| ------ | ------------ | -------- | ------------- |
| `{{ }}` interpolation | Inserts a value as plain text | Displaying dynamic text | Only works in element content, not attributes |
| `v-html` | Renders a string as real HTML | Trusted, pre-sanitized HTML | XSS risk — never use with user input |
| `v-bind:attr` (full) | Binds an attribute to an expression | You want the explicit form | More typing |
| `:attr` (shorthand) | Same as `v-bind:attr` | Everyday use | None — it's the common style |

# Worked Example

A small profile link that binds text, an attribute, and a class:

```html
<script setup lang="ts">
import { ref } from 'vue'

const user = ref({ name: 'Grace', url: 'https://example.com', online: true })
</script>

<template>
  <a :href="user.url" :class="{ online: user.online }">
    {{ user.name }}
  </a>
</template>

<style scoped>
.online {
  color: green;
}
</style>
```

Here `{{ user.name }}` binds text, `:href` binds an attribute, and `:class="{ online: … }"`
adds the `online` class only when `user.online` is true. Change any of these values and Vue
updates the link — text, destination, and color — automatically.

# Real World Analogy

Think of a template as a **form letter with fill-in-the-blanks**. The fixed text is your
static HTML; the `{{ }}` slots and `:bindings` are the blanks. Vue is the assistant who
re-fills every blank the moment the underlying record changes, so the letter is always
current.

# Examples

## Example 1 — Basic: interpolation with an expression

```html
<template>
  <p>{{ count }} item{{ count === 1 ? '' : 's' }} in cart</p>
</template>
```

**Why this works:** The braces accept any single JavaScript expression, so you can compute
the plural suffix inline.

## Example 2 — Real-world: binding a dynamic image

```html
<template>
  <img :src="photoUrl" :alt="`Photo of ${name}`" />
</template>
```

**Why this works:** `:src` and `:alt` bind attributes to expressions. Template literals work
inside bindings, so the `alt` text stays in sync with `name`.

## Example 3 — Trade-off / pitfall: putting a mustache in an attribute

```html
<!-- Wrong: mustaches don't work inside attributes -->
<a href="{{ url }}">Broken</a>

<!-- Right: bind the attribute -->
<a :href="url">Works</a>
```

**Why this bites:** `{{ }}` only works in element *content*. For attributes you must use
`v-bind` (or its `:` shorthand); the first form sends the literal text `{{ url }}` as the URL.

# Common Mistakes

- **Using `{{ }}` inside an attribute.** Use `:attr="value"` instead.
- **Reaching for `v-html` with user content.** That's an XSS hole; interpolate as text or
  sanitize first.
- **Writing statements in bindings.** Bindings take a single *expression*; `{{ let x = 1 }}`
  is invalid.
- **Calling `.mount()` more than once** or forgetting it — the app won't appear until it's
  mounted exactly once.

# Best Practices

- Prefer the `:` and `@` shorthands — they're the conventional, readable style.
- Keep template expressions simple; move anything complex into a `computed` (next lessons).
- Reserve `v-html` for trusted HTML you control.
- Give every app a single, clear entry point that creates and mounts the app.

# Summary

- `createApp(App).mount('#app')` creates an app from a root component and attaches it to
  the page.
- `{{ }}` interpolates a value as **plain text**; `v-html` renders real HTML (trusted only).
- `v-bind` (shorthand `:`) binds attributes to expressions; `null`/`undefined` removes them.
- A **directive** is a `v-` attribute with an optional argument and modifiers.
- `v-on` has the `@` shorthand for event handling.

# Flash Cards

Q: What does createApp(App).mount('#app') do?
A: It creates a Vue application from the root component App and mounts (renders) it onto the element matched by the selector "#app".

Q: Why can't you write {{ url }} inside an HTML attribute?
A: Mustache interpolation only works in element content. For attributes you must bind with v-bind, e.g. :href="url".

Q: What is the shorthand for v-bind and for v-on?
A: v-bind shorthand is a leading colon (:href), and v-on shorthand is @ (@click).

Q: When is v-html dangerous?
A: When the HTML comes from users or untrusted sources — it can inject scripts (XSS). Only use it with trusted, sanitized content.

Q: What are the three optional parts of a directive besides its name?
A: An argument (after a colon), modifiers (after dots), and a value (the expression it binds to).

Q: What kind of code can go inside {{ }} or a binding?
A: A single JavaScript expression (like count + 1 or ok ? 'a' : 'b') — not a statement such as an if or a variable declaration.

# Exercises

### Easy
Create a component with a `ref` called `title` and render it in an `<h1>` using
interpolation. Then bind the same value to the element's `title` attribute with `:title`.

### Medium
Build a "link card" that binds an `<a>`'s `:href` and text from an object, and disables a
"Copy" `<button>` with `:disabled` while a `copying` ref is true.

### Challenging
Given a `theme` ref that is `'dark'` or `'light'`, bind a `:class` on the root element so
the class name matches the theme, and bind a `:style` that sets the background color. Toggle
`theme` with an `@click` button and watch everything update together.

# Further Reading

- [Creating a Vue Application](https://vuejs.org/guide/essentials/application.html)
- [Template Syntax](https://vuejs.org/guide/essentials/template-syntax.html)
- [Built-in Directives — `v-bind`, `v-on`](https://vuejs.org/api/built-in-directives.html)
