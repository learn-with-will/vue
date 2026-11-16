---
slug: passing-props
title: "Passing Static vs Dynamic Props"
topic: components
kind: technique
summary: "Distinguish between passing static literal strings and dynamic reactive expressions using v-bind."
tags: [props, v-bind, syntax, pitfall]
related: [define-props, attribute-bindings, one-way-data-flow]
---
> **In one line:** Use prop="val" for static strings and :prop="val" for dynamic JavaScript expressions.

## The idea

A frequent source of beginner confusion in Vue is knowing when to prefix a prop with the colon shorthand `:` (`v-bind`).

The rule is straightforward:
- **Without colon (`prop="value"`):** Always passes a raw, literal string `"value"`.
- **With colon (`:prop="expression"`):** Evaluates the value as a JavaScript expression.

```text
<UserCard name="Ada" />        --> passes string "Ada"
<UserCard :likes="42" />       --> passes JavaScript number 42
<UserCard :likes="count" />    --> passes dynamic reactive ref count
<UserCard :is-admin="true" />  --> passes boolean true
<UserCard is-admin="true" />   --> passes string "true", NOT boolean true!
```

Even if the value is static, you **must use a colon** whenever passing non-string values like numbers, booleans, arrays, or objects so Vue evaluates them as JavaScript literals.

## See it

```html
<script setup lang="ts">
import { ref } from 'vue';
import ProductCard from './ProductCard.vue';

const productTitle = ref('Wireless Keyboard');
</script>

<template>
  <!-- Static string: no colon needed -->
  <ProductCard sku="KB-100" />

  <!-- Dynamic string: colon required to read variable -->
  <ProductCard :title="productTitle" />

  <!-- Static number and boolean: colon required to evaluate JS types -->
  <ProductCard
    :price="99.99"
    :in-stock="true"
    :tags="['electronics', 'office']"
  />
</template>
```

Passing `:price="99.99"` ensures the child receives a JavaScript number, allowing numerical math and strict type checks to succeed.

## Go deeper

If you have an entire object of props matching the child's interface, you can pass all props at once using `v-bind` without arguments: `<ProductCard v-bind="productData" />`.

> **Tip:** You can omit the value for boolean props: `<Modal is-open />` is equivalent to `<Modal :is-open="true" />`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Writing disabled="false" passes the non-empty string "false", which evaluates to truthy in JavaScript!
- Always use : for numbers, booleans, arrays, and objects, even when static.

## Remember

- Without colon passes a literal string: title="Vue".
- With colon : evaluates a JavaScript expression: :likes="10" or :likes="count".
- Numbers, booleans, arrays, and objects always require the : prefix.
