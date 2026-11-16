---
slug: component-naming
title: "Component Naming Conventions"
topic: components
kind: pattern
summary: "Follow official Vue component naming conventions: PascalCase for SFC tags and multi-word names."
tags: [conventions, naming, pascalcase, best-practices]
related: [defining-components, importing-components, define-props]
---
> **In one line:** Name components with multiple words in PascalCase (e.g. UserCard) to prevent HTML collisions.

## The idea

Adhering to clear naming conventions keeps large component codebases organized and predictable. The official Vue style guide establishes two fundamental rules for component naming:

1. **Always use multi-word component names:** HTML tags are single words (like `<header>`, `<main>`, `<dialog>`, `<form>`). Naming your component with at least two words (e.g. `UserProfile`, `TodoItem`) guarantees it will never collide with existing or future HTML elements.
2. **Use PascalCase for Single-File Components:** Name your file `UserCard.vue` and reference it in templates as `<UserCard />`.

| Recommended | Discouraged | Reason |
|---|---|---|
| `<UserProfile />` | `<Profile />` | Single word might collide with future HTML tags |
| `<TodoItem />` | `<todo-item />` | PascalCase clearly indicates a Vue component |
| `AppNav.vue` | `nav.vue` | Matches standard JavaScript module casing |

In templates, PascalCase communicates immediately to anyone reading the file that the tag is a custom Vue component rather than a native DOM element.

## See it

```html
<script setup lang="ts">
import PrimaryButton from './PrimaryButton.vue';
import UserAvatar from './UserAvatar.vue';
</script>

<template>
  <!-- PascalCase distinguishes custom Vue components from native HTML -->
  <header class="app-header">
    <UserAvatar src="/avatar.png" />
    <PrimaryButton label="Sign Out" />
  </header>
</template>
```

The casing immediately clarifies that `header` is native HTML, while `UserAvatar` and `PrimaryButton` are custom Vue components.

## Go deeper

While Vue's template compiler is case-insensitive and can resolve `<PrimaryButton>` as `<primary-button>`, sticking strictly to PascalCase in SFCs provides the best autocompletion and grep searchability.

> **Tip:** Prefix tightly coupled child components with the parent name: `TodoList.vue` and `TodoListItem.vue`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Never name a component after existing HTML elements like Item, Card, or Form.
- In-DOM templates (HTML files not processed by Vite) must use kebab-case because browsers lowercase HTML tags.

## Remember

- Use multi-word names for components to prevent collisions with standard HTML.
- Use PascalCase for .vue filenames and template tags (e.g. <UserProfile />).
- PascalCase clearly differentiates custom components from native DOM nodes.
