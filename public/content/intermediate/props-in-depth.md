---
id: lesson-10
slug: props-in-depth
title: "Props In Depth"
level: intermediate
order: 10
duration: 18
summary: "Declare and type props with defineProps, set defaults with withDefaults, validate at runtime, and respect one-way data flow — props are read-only in the child."
tags:
  - props
  - defineprops
  - typescript
  - one-way-data-flow
---

# Learning Objectives

By the end of this lesson you will be able to:

- Declare props with `defineProps`, using type-based or runtime syntax.
- Provide default values with `withDefaults`.
- Validate props at runtime.
- Explain and honor **one-way data flow** (props are read-only).
- Pass static and dynamic props correctly.

# Why It Matters

Props are the primary way parents configure children. Declaring them well — with types,
defaults, and validation — turns a component into a clear, self-documenting contract. And
understanding that props flow **one way** (down) prevents a whole class of confusing bugs.

# Concept Explanation

### Declaring props

Inside `<script setup>`, `defineProps` declares a component's props. It's a **compile-time
macro** — you don't import it. In TypeScript, the type-based form is the idiomatic choice:

```html
<script setup lang="ts">
const props = defineProps<{
  title: string
  likes?: number   // optional
}>()

console.log(props.title)
</script>
```

You can also use the runtime object form, which enables per-prop `type`, `required`, and
`validator`:

```html
<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  likes: { type: Number, default: 0 },
})
</script>
```

### Default values

With the type-based form, add defaults using the `withDefaults` helper:

```html
<script setup lang="ts">
withDefaults(
  defineProps<{ size?: 'sm' | 'md' | 'lg'; disabled?: boolean }>(),
  { size: 'md', disabled: false },
)
</script>
```

### One-way data flow — props are read-only

Data flows **parent → child**. A child must **not** mutate its props; the binding is
read-only. Trying to reassign a prop warns in development. If a child needs its own editable
version, copy it into local state, or compute a derived value:

```html
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ initialCount: number }>()

// Local copy the child can edit
const count = ref(props.initialCount)
</script>
```

To change something the *parent* owns, emit an event (next lesson) rather than mutating the
prop.

### Passing props: static vs dynamic

A plain attribute passes a **string**; `v-bind` (`:`) passes an **expression**:

```html
<!-- static string "42" -->
<PostItem title="Hello" />

<!-- dynamic: number 42, boolean true, an object -->
<PostItem :likes="42" :featured="true" :author="user" />
```

Prop names are declared in **camelCase** and can be written as **kebab-case** in the
template (`:is-featured` ↔ `isFeatured`). A boolean prop present with no value is `true`:
`<PostItem featured />` means `featured = true`.

### Runtime validation

The runtime form supports a `validator` function for custom rules (checked in development):

```html
<script setup lang="ts">
defineProps({
  size: {
    type: String,
    validator: (v: string) => ['sm', 'md', 'lg'].includes(v),
  },
})
</script>
```

# Key Terminology

- **`defineProps`** — the compile-time macro that declares props in `<script setup>`.
- **Type-based declaration** — declaring prop types via a TypeScript type argument.
- **`withDefaults`** — helper that adds default values to type-based props.
- **One-way data flow** — props pass down and are read-only in the child.
- **Validator** — a runtime function that checks a prop's value.

# Options and Trade-offs

| Option | What it gives | Use when | Watch out for |
| ------ | ------------- | -------- | ------------- |
| Type-based `defineProps<T>()` | Static TypeScript types | TypeScript projects (recommended) | Defaults need `withDefaults` |
| Runtime `defineProps({...})` | `type`, `required`, `default`, `validator` at runtime | You want runtime validation | More verbose |
| Copy prop to local `ref` | An editable local value | Child needs its own state seeded by a prop | Won't auto-sync if the prop changes later (use `watch` if needed) |
| Emit to parent | Parent updates its own state | Child must change parent-owned data | Requires wiring an event (next lesson) |

# Worked Example

A reusable badge with typed props, a default, and validation of an enum-like prop:

```html
<!-- StatusBadge.vue -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    tone?: 'neutral' | 'success' | 'danger'
  }>(),
  { tone: 'neutral' },
)
</script>

<template>
  <span :class="['badge', `badge--${tone}`]">{{ label }}</span>
</template>
```

```html
<!-- Parent.vue -->
<template>
  <StatusBadge label="Active" tone="success" />
  <StatusBadge label="Draft" />   <!-- tone defaults to 'neutral' -->
</template>
```

`label` is required and typed as a string; `tone` is optional with a default and a small set
of allowed values. The parent configures each badge purely through props.

# Real World Analogy

Props are like the **settings dial on an appliance**. The manufacturer (child component)
decides which dials exist and what values they accept; the user (parent) turns them. The user
can't rewire the appliance's internals — they can only set the dials it exposes. That's
one-way data flow.

# Examples

## Example 1 — Basic: a required typed prop

```html
<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <p>Hello, {{ name }}!</p>
</template>
```

**Why this works:** The type argument declares `name: string`; TypeScript flags a missing or
wrong-typed prop at compile time.

## Example 2 — Real-world: seeding local state from a prop

```html
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ initialQuery: string }>()
const query = ref(props.initialQuery) // editable local copy
</script>
```

**Why this works:** The child needs an editable value, so it copies the prop into a `ref`
instead of mutating the read-only prop.

## Example 3 — Trade-off / pitfall: mutating a prop

```html
<script setup lang="ts">
const props = defineProps<{ count: number }>()
function bump() {
  props.count++   // ❌ props are read-only — warns in dev
}
</script>
```

**Why this bites:** Props flow one way and are read-only. To change `count`, emit an event so
the parent updates its own state (next lesson), or keep a local copy.

# Common Mistakes

- **Mutating a prop** in the child — it's read-only; emit or copy instead.
- **Forgetting `withDefaults`** and expecting a bare type-based prop to have a default.
- **Passing a number/boolean as a string** by writing `likes="42"` instead of `:likes="42"`.
- **Over-passing props** — if you're threading the same prop through many layers, consider
  provide/inject or a store (later lessons).

# Best Practices

- Prefer **type-based** `defineProps` in TypeScript; add defaults with `withDefaults`.
- Treat props as **read-only**; derive computed values or copy to local state when needed.
- Bind dynamic values with `:prop`; reserve bare attributes for literal strings.
- Keep a component's prop list small and well-named — it's the component's public API.

# Summary

- `defineProps` (a compile-time macro) declares props; the **type-based** form is idiomatic in
  TypeScript.
- Add defaults with **`withDefaults`**; add runtime rules with the object form's `validator`.
- **Props are read-only** — honor one-way data flow; copy to local state or emit to change data.
- Pass dynamic values with `:prop`; a bare attribute is a literal string, and a lone boolean
  prop is `true`.

# Flash Cards

Q: Is defineProps imported from 'vue'?
A: No — defineProps is a compile-time macro available inside <script setup>; you don't import it.

Q: How do you give type-based props default values?
A: Wrap defineProps in the withDefaults helper: withDefaults(defineProps<T>(), { ... }).

Q: Can a child component mutate its props?
A: No — props are read-only (one-way data flow). To change the data, emit an event so the parent updates its own state, or copy the prop into local state.

Q: What's the difference between title="42" and :title="42"?
A: title="42" passes the string "42"; :title="42" binds the expression, passing the number 42.

Q: How do you write a prop declared as isFeatured in the template?
A: As :is-featured (kebab-case) or :isFeatured — Vue matches kebab-case attributes to camelCase prop names.

Q: What does a boolean prop with no value mean, e.g. <Modal open />?
A: It's shorthand for open={true} — a present boolean prop with no value is treated as true.

# Exercises

### Easy
Create an `Avatar.vue` with typed props `src: string` and `size?: number` (default 40). Render
an `<img>` sized by the prop.

### Medium
Build a `PriceTag.vue` with a required `amount: number` and an optional `currency` prop
(default `'USD'`). Validate that `amount` is non-negative using the runtime form's validator.

### Challenging
Make an `EditableField.vue` that receives an `initialValue` prop, keeps an editable local copy,
and — without mutating the prop — lets the user edit it. (In the next lesson you'll wire it to
emit changes back to the parent.)

# Further Reading

- [Props](https://vuejs.org/guide/components/props.html)
- [Typing Component Props](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props)
