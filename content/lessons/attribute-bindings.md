---
slug: attribute-bindings
title: "Attribute Bindings with v-bind"
topic: foundations
kind: technique
summary: "v-bind dynamically connects reactive data to HTML attributes, with the colon shorthand as standard."
tags: [v-bind, shorthand, attribute-binding, template-syntax]
related: [text-interpolation, directives-overview, class-binding-object]
---
> **In one line:** v-bind (shorthand :) dynamically binds reactive data to HTML attributes.

## The idea

Mustache syntax (`{{ }}`) only works for text content between HTML tags. To bind dynamic values to HTML attributes—such as an `href`, `src`, `id`, or `disabled` state—you must use the `v-bind` directive.

The directive instructs Vue to keep the element's attribute in sync with the component's reactive property. Because attribute bindings are ubiquitous, Vue provides a dedicated shorthand: a single colon `:`.

```html
<!-- Full syntax -->
<a v-bind:href="targetUrl">Profile</a>

<!-- Standard shorthand -->
<a :href="targetUrl">Profile</a>
```

Attribute binding also handles **boolean attributes** intelligently. If the bound value is truthy, the attribute is included on the DOM node. If the value is falsy (`false`, `null`, or `undefined`), Vue automatically removes the attribute from the rendered element.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const avatarUrl = ref('/images/ada.png');
const isSubmitting = ref(true);
const buttonId = ref('submit-btn');
</script>

<template>
  <img :src="avatarUrl" alt="User avatar" />
  <button :id="buttonId" :disabled="isSubmitting">
    {{ isSubmitting ? 'Saving...' : 'Save' }}
  </button>
</template>
```

When `isSubmitting` is `true`, the rendered button has the `disabled` attribute. When set to `false`, Vue omits the attribute entirely.

## Go deeper

If you have an object containing multiple attributes, you can bind them all at once by using `v-bind` without an argument: `<div v-bind="attrsObject">`.

> **Tip:** In Vue 3.4+, if the attribute name matches the variable name, you can use the same-name shorthand: `<img :src />` is equivalent to `<img :src="src" />`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not use mustaches inside attributes (e.g. href="{{ url }}" is invalid Vue syntax).
- Passing null or undefined removes the attribute from the rendered DOM node.

## Remember

- Use v-bind or the : shorthand to bind dynamic values to HTML attributes.
- Boolean attributes like disabled are omitted when the bound value is falsy.
- Pass an object to v-bind without arguments to bind multiple attributes at once.
