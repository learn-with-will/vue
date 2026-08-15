---
id: lesson-11
slug: component-events-and-v-model
title: "Component Events & v-model"
level: intermediate
order: 11
duration: 18
summary: "Send data up from a child with defineEmits, and build two-way component bindings with the defineModel macro (stable since Vue 3.4), including named and multiple models."
tags:
  - events
  - defineemits
  - v-model
  - definemodel
---

# Learning Objectives

By the end of this lesson you will be able to:

- Declare and emit custom events with `defineEmits`.
- Listen to component events in the parent.
- Build a two-way component binding with the `defineModel` macro.
- Create named and multiple `v-model` bindings.

# Why It Matters

Props send data **down**; events send data **up**. Together they form Vue's component
communication contract. `v-model` on a component is the clean, two-way version — perfect for
custom form controls like a labeled input or a toggle. Since Vue 3.4, the `defineModel` macro
makes this almost effortless.

# Concept Explanation

### Emitting events with `defineEmits`

A child declares the events it can emit with `defineEmits` (a compile-time macro), then calls
the returned `emit` function:

```html
<script setup lang="ts">
const emit = defineEmits<{
  submit: [payload: { email: string }]
  cancel: []
}>()

function onSave() {
  emit('submit', { email: 'a@b.co' })
}
</script>

<template>
  <button @click="onSave">Save</button>
  <button @click="emit('cancel')">Cancel</button>
</template>
```

The type argument documents each event and its payload. The parent listens with `@`:

```html
<template>
  <SignupForm @submit="onSubmit" @cancel="onCancel" />
</template>
```

Emitting events (instead of mutating props) is how a child asks its parent to change
parent-owned state — one-way data flow stays intact.

### Two-way binding with `defineModel`

To make a component usable with `v-model`, declare a model with the **`defineModel`** macro,
stable since **Vue 3.4**. It returns a ref that stays in sync with the parent's `v-model`:

```html
<!-- CustomInput.vue -->
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
```

```html
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'
const name = ref('')
</script>

<template>
  <CustomInput v-model="name" />
  <p>{{ name }}</p>
</template>
```

Under the hood, `v-model` on a component desugars to a **`modelValue` prop** plus an
**`update:modelValue` event**; `defineModel` wires both up for you and gives you a writable ref.

### Named and multiple models

Pass a name to `defineModel` to bind a specific `v-model:name`. A component can expose several:

```html
<!-- NameFields.vue -->
<script setup lang="ts">
const first = defineModel<string>('first')
const last = defineModel<string>('last')
</script>

<template>
  <input v-model="first" />
  <input v-model="last" />
</template>
```

```html
<template>
  <NameFields v-model:first="firstName" v-model:last="lastName" />
</template>
```

# Key Terminology

- **`defineEmits`** — compile-time macro declaring the events a component can emit.
- **`emit`** — the function that fires a declared event, optionally with a payload.
- **`defineModel`** — macro that creates a two-way `v-model` binding (a writable ref).
- **`modelValue` / `update:modelValue`** — the prop/event pair that a default `v-model`
  desugars to.

# Options and Trade-offs

| Option | Direction | Use when | Watch out for |
| ------ | --------- | -------- | ------------- |
| `defineEmits` + `@event` | Child → parent (one-off) | Actions/notifications (submit, delete) | Declare events for clarity and typing |
| `defineModel` (`v-model`) | Two-way | Custom form controls that hold a value | Needs Vue 3.4+ for the macro |
| Manual `modelValue` + `update:modelValue` | Two-way | Older Vue, or full control | More boilerplate than `defineModel` |

# Worked Example

A reusable toggle switch bound with `v-model`, plus a `change` event for side effects:

```html
<!-- ToggleSwitch.vue -->
<script setup lang="ts">
const model = defineModel<boolean>()
const emit = defineEmits<{ change: [value: boolean] }>()

function toggle() {
  model.value = !model.value
  emit('change', model.value)
}
</script>

<template>
  <button role="switch" :aria-checked="model" @click="toggle">
    {{ model ? 'On' : 'Off' }}
  </button>
</template>
```

```html
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import ToggleSwitch from './ToggleSwitch.vue'
const enabled = ref(false)
</script>

<template>
  <ToggleSwitch v-model="enabled" @change="(v) => console.log('now', v)" />
</template>
```

`v-model` keeps `enabled` and the switch in sync; the extra `change` event lets the parent
react without owning the toggle logic.

# Real World Analogy

Emitting an event is like **ringing up an order at a counter** — the child tells the parent
"the customer wants this," and the parent decides what to do. `v-model` is a **shared
whiteboard** between parent and child: either can write to it and both always see the same
value.

# Examples

## Example 1 — Basic: emitting a delete request

```html
<script setup lang="ts">
const props = defineProps<{ id: number }>()
const emit = defineEmits<{ delete: [id: number] }>()
</script>

<template>
  <button @click="emit('delete', props.id)">Delete</button>
</template>
```

**Why this works:** The child doesn't delete anything itself; it emits `delete` with the id and
lets the parent (which owns the list) remove the item.

## Example 2 — Real-world: a custom input with defineModel

```html
<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

**Why this works:** `defineModel` gives a writable ref tied to the parent's `v-model`; you can
read it, write it, and even declare options like `required`.

## Example 3 — Trade-off / pitfall: mutating a prop instead of emitting

```html
<script setup lang="ts">
const props = defineProps<{ count: number }>()
function inc() {
  props.count++     // ❌ read-only prop
}
</script>
```

**Why this bites:** Props are read-only. Emit `update:count` (or use `defineModel`) so the
parent updates the value; don't mutate the prop.

# Common Mistakes

- **Mutating a prop** to "send data up" — emit an event or use `defineModel` instead.
- **Not declaring events** with `defineEmits` — declaring them documents and types your API.
- **Forgetting `v-model` on a component is `modelValue` + `update:modelValue`** — `defineModel`
  hides this, but it's what's happening.
- **Expecting `defineModel` on old Vue** — it's stable from Vue 3.4; older versions need the
  manual prop/event pair.

# Best Practices

- Use `defineEmits` with a type argument to make each event and payload explicit.
- Reach for `defineModel` to build custom form controls with `v-model`.
- Keep the child's job to *reporting* changes; let the parent own the source of truth.
- Name events clearly (`submit`, `delete`, `update:foo`) so the component's API reads well.

# Summary

- Children send data up by **emitting events** declared with `defineEmits`.
- Parents listen with `@event`.
- **`defineModel`** (Vue 3.4+) creates a two-way `v-model` binding as a writable ref; it
  desugars to a `modelValue` prop and `update:modelValue` event.
- Components can expose **named** and **multiple** `v-model` bindings.

# Flash Cards

Q: How does a child component send data up to its parent?
A: By emitting a custom event with the emit function from defineEmits; the parent listens with @eventName.

Q: What does defineModel do?
A: It creates a two-way v-model binding for a component, returning a writable ref that stays in sync with the parent's v-model. It's stable since Vue 3.4.

Q: What does a default v-model on a component desugar to?
A: A modelValue prop plus an update:modelValue event — which defineModel wires up for you.

Q: How do you create a named model, e.g. for v-model:title?
A: const title = defineModel('title') inside the child; the parent binds v-model:title="...".

Q: Should a child mutate a prop to change parent data?
A: No — props are read-only. Emit an event (or use defineModel) so the parent updates its own state.

Q: Can one component expose more than one v-model?
A: Yes — call defineModel with different names (e.g. 'first', 'last') and the parent binds v-model:first and v-model:last.

# Exercises

### Easy
Create a `LikeButton.vue` that emits a `like` event when clicked; have the parent count total
likes.

### Medium
Build a `CurrencyInput.vue` using `defineModel<number>()` so the parent can bind
`v-model="amount"`. Format the display and parse input back to a number.

### Challenging
Make a `DateRange.vue` that exposes two named models, `v-model:start` and `v-model:end`, each a
date string. Ensure `end` is never before `start`, emitting a `change` event whenever either
updates.

# Further Reading

- [Component Events](https://vuejs.org/guide/components/events.html)
- [Component `v-model`](https://vuejs.org/guide/components/v-model.html)
- [`defineModel()`](https://vuejs.org/api/sfc-script-setup.html#definemodel)
