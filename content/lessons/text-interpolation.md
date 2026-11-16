---
slug: text-interpolation
title: "Text Interpolation with Mustaches"
topic: foundations
kind: technique
summary: "Mustache syntax interpolates reactive data and JavaScript expressions directly inside template HTML."
tags: [template-syntax, interpolation, expressions, mustache]
related: [create-app-and-mount, attribute-bindings, ref-primitive]
---
> **In one line:** Mustache syntax {{ }} embeds reactive text and JavaScript expressions in HTML templates.

## The idea

The most fundamental form of data binding in Vue templates is text interpolation using the "Mustache" syntax: double curly braces `{{ }}`.

When Vue encounters `{{ variable }}`, it replaces the tag with the current value of the corresponding property from your component's reactive state. Whenever that property updates, the text node in the DOM updates automatically.

Mustache syntax also supports **full JavaScript expressions** inside the delimiters. You can perform arithmetic, string concatenation, ternary conditionals, and call helper methods.

| Valid Expression | Invalid Statement |
|---|---|
| `{{ count + 1 }}` | `{{ var a = 1 }}` (statement) |
| `{{ ok ? 'YES' : 'NO' }}` | `{{ if (ok) { return 'YES' } }}` (flow control) |
| `{{ message.split('').reverse().join('') }}` | `{{ for (let i = 0; i < 10; i++) }}` (loop) |

Each binding can only contain **a single expression**. Anything that evaluates to a value is valid; multi-statement logic belongs in computed properties or methods.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';

const user = ref({ name: 'Ada Lovelace', points: 120 });
const formatPoints = (pts: number) => pts.toLocaleString();
</script>

<template>
  <div class="profile">
    <p>Learner: {{ user.name }}</p>
    <p>Score: {{ formatPoints(user.points) }}</p>
    <p>Status: {{ user.points >= 100 ? 'Master' : 'Novice' }}</p>
  </div>
</template>
```

The template evaluates `user.name`, calls `formatPoints()`, and resolves the ternary conditional to display dynamic text.

## Go deeper

Mustache interpolation always treats data as plain text, escaping any HTML characters to protect your application against Cross-Site Scripting (XSS) attacks.

> **Note:** If you truly need to render raw HTML strings from a trusted source, use the `v-html` directive instead of mustaches.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not write statements or variable declarations like var x = 1 inside mustaches.
- Mustache tags cannot be used inside HTML attributes; use v-bind for attributes instead.

## Remember

- Double curly braces {{ }} bind reactive text into HTML templates.
- Mustaches accept any valid single JavaScript expression.
- Text interpolation auto-escapes HTML characters to prevent XSS vulnerabilities.
