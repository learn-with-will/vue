---
id: lesson-12
slug: slots
title: "Slots"
level: intermediate
order: 12
duration: 17
summary: "Let parents pass template content into a child with slots: default and named slots, fallback content, and scoped slots that pass data from child back to the slot content."
tags:
  - slots
  - named-slots
  - scoped-slots
  - composition
---

# Learning Objectives

By the end of this lesson you will be able to:

- Pass template content into a child with the default `<slot>`.
- Provide fallback content for empty slots.
- Define and fill **named** slots.
- Use **scoped** slots to pass data from the child to the slot content.

# Why It Matters

Props pass *data* into a component, but sometimes you want to pass **markup** — a card that
wraps whatever you put inside it, a list that lets the parent decide how each row looks. That's
what **slots** do: they're placeholders in a child's template that the parent fills. Slots are
the key to building flexible, reusable "layout" and "list" components.

# Concept Explanation

### The default slot

A child declares a `<slot>` outlet; whatever the parent puts between the component's tags is
rendered there:

```html
<!-- BaseCard.vue -->
<template>
  <div class="card">
    <slot></slot>
  </div>
</template>
```

```html
<!-- Parent -->
<template>
  <BaseCard>
    <h2>Title</h2>
    <p>Any markup goes here.</p>
  </BaseCard>
</template>
```

### Fallback content

Content inside `<slot>…</slot>` is **fallback** — shown only when the parent provides nothing:

```html
<template>
  <button class="btn"><slot>Click me</slot></button>
</template>
```

### Named slots

A component can expose several outlets by giving them names. The parent targets each with
`<template #name>` (the `#` shorthand for `v-slot`):

```html
<!-- PageLayout.vue -->
<template>
  <header><slot name="header" /></header>
  <main><slot /></main>          <!-- the default slot -->
  <footer><slot name="footer" /></footer>
</template>
```

```html
<template>
  <PageLayout>
    <template #header><h1>Dashboard</h1></template>
    <p>Main content (default slot).</p>
    <template #footer>© 2026</template>
  </PageLayout>
</template>
```

### Scoped slots

Sometimes the child owns the data but the parent should decide how to render it. A **scoped
slot** passes data from child to slot content via slot props:

```html
<!-- UserList.vue -->
<script setup lang="ts">
defineProps<{ users: { id: number; name: string }[] }>()
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      <slot :user="user" />   <!-- expose `user` to the slot -->
    </li>
  </ul>
</template>
```

```html
<template>
  <UserList :users="users">
    <template #default="{ user }">
      <strong>{{ user.name }}</strong> (#{{ user.id }})
    </template>
  </UserList>
</template>
```

The child controls the iteration; the parent controls each row's markup — reusable and
flexible.

# Key Terminology

- **Slot** — a placeholder in a child's template that the parent fills with content.
- **Default slot** — the unnamed slot; content placed directly inside the component tags.
- **Named slot** — a slot with a `name`, targeted by `<template #name>`.
- **Fallback content** — default markup shown when a slot is left empty.
- **Scoped slot** — a slot that exposes data (slot props) to the parent's content.

# Options and Trade-offs

| Option | Passes | Use when | Watch out for |
| ------ | ------ | -------- | ------------- |
| Props | Data (values) | Configuring a component | Not for arbitrary markup |
| Default slot | Markup | Wrapping/containing content | One unnamed slot per component |
| Named slots | Markup, in several regions | Layouts with header/body/footer | Match names exactly |
| Scoped slots | Markup + data from child | Lists/renderers where the parent styles each item | Slightly more syntax |

# Worked Example

A reusable `DataList` that owns iteration but lets the parent render each item and an empty
state:

```html
<!-- DataList.vue -->
<script setup lang="ts">
defineProps<{ items: unknown[] }>()
</script>

<template>
  <ul v-if="items.length">
    <li v-for="(item, index) in items" :key="index">
      <slot name="item" :item="item" :index="index" />
    </li>
  </ul>
  <slot v-else name="empty">Nothing here yet.</slot>
</template>
```

```html
<!-- Parent -->
<template>
  <DataList :items="products">
    <template #item="{ item, index }">
      {{ index + 1 }}. {{ item.name }} — ${{ item.price }}
    </template>
    <template #empty>No products found.</template>
  </DataList>
</template>
```

`DataList` handles looping and the empty branch; the parent supplies the row markup (scoped
slot) and an optional empty message (named slot with fallback).

# Real World Analogy

A slot is a **picture frame**. The frame (child component) provides the border, matting, and
hanging hardware; you (the parent) slide in whatever photo you like. A scoped slot is a frame
that also hands you a **caption card** with details about what it's holding, so you can label
the photo however you want.

# Examples

## Example 1 — Basic: a wrapping card

```html
<template>
  <BaseCard><p>Wrapped content</p></BaseCard>
</template>
```

**Why this works:** The `<p>` lands in `BaseCard`'s default `<slot>`, so `BaseCard` provides the
box and the parent provides the contents.

## Example 2 — Real-world: a modal with header and actions

```html
<template>
  <BaseModal>
    <template #title>Delete item?</template>
    <p>This can't be undone.</p>
    <template #actions>
      <button @click="confirm">Delete</button>
      <button @click="close">Cancel</button>
    </template>
  </BaseModal>
</template>
```

**Why this works:** Named slots let the parent fill distinct regions (title, body, actions)
while the modal owns the overlay and layout.

## Example 3 — Trade-off / pitfall: trying to read child data without a scoped slot

```html
<!-- The parent can't see `user` unless the child exposes it -->
<UserList :users="users">
  <template #default>{{ user.name }}</template>   <!-- ❌ user is undefined here -->
</UserList>
```

**Why this bites:** Slot content is compiled in the **parent's** scope, so it can't access the
child's internal `user`. The child must expose it via a scoped slot (`<slot :user="user" />`)
and the parent must receive it (`#default="{ user }"`).

# Common Mistakes

- **Expecting slot content to see the child's variables** without a scoped slot — it's compiled
  in the parent's scope.
- **Mismatched slot names** between `<slot name="x">` and `<template #x>`.
- **Forgetting the default slot** exists (unnamed) when mixing it with named slots.
- **Overusing props for markup** when a slot is the natural fit.

# Best Practices

- Use slots to pass **markup**, props to pass **data**.
- Provide **fallback content** for optional slots so the component is usable with less config.
- Reach for **scoped slots** when the child owns data but the parent should render it (lists,
  tables, renderers).
- Name slots for their region (`header`, `item`, `actions`) so usage reads clearly.

# Summary

- A `<slot>` is a placeholder the parent fills with markup; the unnamed one is the **default**
  slot.
- Content inside `<slot>` is **fallback**, shown when the parent provides nothing.
- **Named slots** (`<slot name="x">` ↔ `<template #x>`) create multiple content regions.
- **Scoped slots** pass data from child to slot content (`<slot :item="x" />` ↔
  `#default="{ item }"`), because slot content runs in the parent's scope.

# Flash Cards

Q: What do slots let a parent pass into a child that props cannot?
A: Markup/template content — slots are placeholders the parent fills, whereas props pass data values.

Q: What is fallback slot content?
A: The markup written inside a <slot>…</slot>; it renders only when the parent provides no content for that slot.

Q: How does a parent target a named slot called "header"?
A: With <template #header>…</template> (the # is shorthand for v-slot:header) matching <slot name="header"> in the child.

Q: Why can't ordinary slot content access the child's internal variables?
A: Slot content is compiled in the parent's scope. To share child data, use a scoped slot: the child does <slot :item="x" /> and the parent receives #default="{ item }".

Q: When should you use a scoped slot?
A: When the child owns the data (e.g. iterating a list) but the parent should decide how each item is rendered.

# Exercises

### Easy
Create a `BaseCard.vue` with a default slot and use it to wrap some markup from a parent.

### Medium
Build a `PageLayout.vue` with named `header`, default, and `footer` slots. Fill all three from
a parent.

### Challenging
Write a `SortableList.vue` that receives an array, sorts it internally, and exposes each item
through a scoped `#item="{ item }"` slot plus a `#empty` fallback. Let the parent fully control
each row's markup.

# Further Reading

- [Slots](https://vuejs.org/guide/components/slots.html)
