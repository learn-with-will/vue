---
id: lesson-05
slug: conditional-and-list-rendering
title: "Conditional & List Rendering"
level: beginner
order: 5
duration: 18
summary: "Show and hide elements with v-if, v-else, and v-show, render lists with v-for and a proper key, and learn why you must not combine v-if and v-for on the same element."
tags:
  - v-if
  - v-show
  - v-for
  - key
---

# Learning Objectives

By the end of this lesson you will be able to:

- Conditionally render elements with `v-if`, `v-else-if`, and `v-else`.
- Toggle visibility with `v-show`, and choose between it and `v-if`.
- Render lists with `v-for` over arrays and objects.
- Explain why `v-for` needs a `key` and what a good key is.
- Avoid the `v-if`-with-`v-for` pitfall.

# Why It Matters

Real UIs are full of "show this only when…" and "render one of these for each…". `v-if`,
`v-show`, and `v-for` are the three directives that handle almost all of it. Using them
correctly — especially giving lists a stable `key` — keeps your UI fast and free of subtle
state bugs.

# Concept Explanation

### Conditional rendering with `v-if`

`v-if` renders an element only when its expression is truthy. It can be chained with
`v-else-if` and `v-else`:

```html
<template>
  <p v-if="status === 'loading'">Loading…</p>
  <p v-else-if="status === 'error'">Something went wrong</p>
  <p v-else>Ready</p>
</template>
```

`v-if` is **real** conditional rendering: when false, the element (and its components and
listeners) is not created at all. It's also **lazy** — the block isn't rendered until the
condition first becomes true. To toggle several elements at once without adding a wrapper,
put `v-if` on a `<template>` tag:

```html
<template v-if="loggedIn">
  <h1>Welcome</h1>
  <button>Log out</button>
</template>
```

### Toggling with `v-show`

`v-show` always renders the element but toggles its CSS `display` property:

```html
<p v-show="isOpen">Now you see me</p>
```

When `isOpen` is false, the element is still in the DOM — just `display: none`.

### `v-if` vs `v-show`

- `v-if` has higher **toggle cost** (it creates/destroys elements) but zero cost when hidden.
- `v-show` has higher **initial cost** (always rendered) but cheap toggling.

Use `v-show` for things you flip often (a dropdown), and `v-if` for things that are rarely
shown or expensive to render.

### List rendering with `v-for`

`v-for` renders an element once per item in an array. The syntax is `item in items`, and you
can also grab the index:

```html
<ul>
  <li v-for="(todo, index) in todos" :key="todo.id">
    {{ index + 1 }}. {{ todo.text }}
  </li>
</ul>
```

You can loop over an object's values (with key and index) or a range of numbers:

```html
<li v-for="(value, key) in userObject" :key="key">{{ key }}: {{ value }}</li>
<span v-for="n in 5" :key="n">{{ n }}</span>   <!-- 1 2 3 4 5 -->
```

### The `key` — and why it matters

Always bind a **`key`** on `v-for`. The key is a stable, unique identifier (usually an `id`)
that lets Vue match items across updates, so it can reuse and reorder DOM nodes correctly
instead of rebuilding them. Using the array **index** as the key is risky when the list can
reorder or change, because indexes shift.

### Don't combine `v-if` and `v-for` on one element

In Vue 3, when both are on the same element, **`v-if` has higher priority**, so it runs
before `v-for` and can't access the loop variable. Instead, filter with a computed property,
or move the `v-if` to an inner element or a wrapping `<template>`:

```html
<!-- Prefer: filter in a computed, then loop -->
<li v-for="user in activeUsers" :key="user.id">{{ user.name }}</li>
```

# Key Terminology

- **`v-if` / `v-else-if` / `v-else`** — create or remove elements based on a condition.
- **`v-show`** — keep the element but toggle its `display`.
- **`v-for`** — render an element once per item in a list.
- **key** — a unique identifier per list item that helps Vue track and reuse DOM nodes.

# Options and Trade-offs

| Option | What it does | Use when | Watch out for |
| ------ | ------------ | -------- | ------------- |
| `v-if` | Adds/removes the element (lazy) | Rarely shown or expensive content | Higher cost to toggle repeatedly |
| `v-show` | Toggles CSS `display` | Frequently toggled content | Element is always rendered (initial cost) |
| `v-for` + `:key` | Renders a list | Any list of items | Always provide a stable, unique key |
| Index as key | Uses position as key | Static lists that never reorder | Breaks on reorder/insert/remove — prefer an id |

# Worked Example

A to-do list combining a filter, a list, and an empty state:

```html
<script setup lang="ts">
import { ref, computed } from 'vue'

const todos = ref([
  { id: 1, text: 'Learn v-for', done: true },
  { id: 2, text: 'Learn v-if', done: false },
])
const showDone = ref(true)

const visible = computed(() =>
  showDone.value ? todos.value : todos.value.filter((t) => !t.done),
)
</script>

<template>
  <label><input type="checkbox" v-model="showDone" /> Show completed</label>

  <ul v-if="visible.length">
    <li v-for="todo in visible" :key="todo.id">
      {{ todo.done ? '✓' : '○' }} {{ todo.text }}
    </li>
  </ul>
  <p v-else>Nothing to show.</p>
</template>
```

The filter lives in a computed (not `v-if` on the `<li>`), each item has a stable `:key`,
and `v-if`/`v-else` handle the empty state.

# Real World Analogy

`v-if` is like **building or demolishing a room** depending on whether you need it — nothing
is there when it's gone. `v-show` is like **closing the blinds**: the room is still built,
you just can't see in. `v-for` is a **mail merge**: one template, repeated once per record,
with a name tag (`key`) on each so you never mix them up.

# Examples

## Example 1 — Basic: v-if / v-else

```html
<template>
  <button v-if="loggedIn" @click="logout">Log out</button>
  <button v-else @click="login">Log in</button>
</template>
```

**Why this works:** Exactly one button exists at a time; `v-else` must immediately follow the
`v-if` element.

## Example 2 — Real-world: a keyed list of components

```html
<template>
  <UserCard v-for="user in users" :key="user.id" :user="user" />
</template>
```

**Why this works:** The stable `:key` lets Vue reuse each `UserCard` correctly when the list
changes, preserving component state.

## Example 3 — Trade-off / pitfall: v-if and v-for together

```html
<!-- Anti-pattern: v-if runs before v-for and can't see `user` -->
<li v-for="user in users" v-if="user.active" :key="user.id">{{ user.name }}</li>
```

**Why this bites:** In Vue 3 `v-if` has higher priority than `v-for` on the same element, so
`user` isn't available to it. Filter in a computed (`activeUsers`) and loop over that.

# Common Mistakes

- **Omitting `:key` on `v-for`** — leads to wrong DOM reuse and state bugs.
- **Using the index as the key** for lists that reorder or change length.
- **Putting `v-if` and `v-for` on the same element** — filter with a computed instead.
- **Expecting `v-show` to remove the element** — it only hides it with CSS.
- **Placing `v-else` on a non-adjacent element** — it must follow its `v-if`/`v-else-if`.

# Best Practices

- Always give `v-for` a stable, unique `:key` (an `id`, not the index when the list mutates).
- Choose `v-show` for frequently toggled UI, `v-if` for rare/expensive content.
- Do list filtering/sorting in a **computed**, then `v-for` over the result.
- Use `<template v-if>` / `<template v-for>` to group elements without an extra wrapper.

# Summary

- `v-if`/`v-else-if`/`v-else` truly add or remove elements; `v-if` is lazy.
- `v-show` keeps the element and toggles `display` — cheaper to flip, always rendered.
- `v-for` renders lists; always bind a **stable, unique `:key`**.
- Don't put `v-if` and `v-for` on the same element (Vue 3 gives `v-if` priority) — filter in
  a computed instead.

# Flash Cards

Q: What's the core difference between v-if and v-show?
A: v-if actually creates/removes the element (and is lazy); v-show always renders it and only toggles the CSS display property.

Q: Why must v-for have a key?
A: A stable, unique key lets Vue match items across updates so it can reuse and reorder DOM nodes correctly instead of rebuilding them.

Q: Why avoid the array index as a key?
A: Indexes shift when the list reorders, inserts, or removes items, which causes Vue to reuse the wrong nodes and can create state bugs.

Q: Why shouldn't you put v-if and v-for on the same element in Vue 3?
A: v-if has higher priority than v-for there, so it runs first and can't access the loop variable. Filter with a computed and loop over the result.

Q: When would you choose v-show over v-if?
A: When the element is toggled frequently — v-show only flips display, which is cheaper than repeatedly creating and destroying the element.

Q: How do you conditionally render a group of elements without adding a wrapper element?
A: Put v-if (or v-for) on a <template> tag, which groups children without rendering an extra DOM node.

# Exercises

### Easy
Render a status message that shows "Online" when a `ref` `isOnline` is true and "Offline"
otherwise, using `v-if`/`v-else`.

### Medium
Render a list of products with `v-for` and a stable `:key`. Add a checkbox that toggles
between showing all products and only in-stock ones, filtering via a computed.

### Challenging
Build a tab strip: a list of tab labels rendered with `v-for`, and content panels where only
the active tab's panel is shown. Use `v-show` for the panels and measure why `v-if` would
also work — then argue which fits better here.

# Further Reading

- [Conditional Rendering](https://vuejs.org/guide/essentials/conditional.html)
- [List Rendering](https://vuejs.org/guide/essentials/list.html)
- [`v-for` with `v-if`](https://vuejs.org/guide/essentials/list.html#v-for-with-v-if)
