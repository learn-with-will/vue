---
id: lesson-23
slug: typescript-with-vue
title: "TypeScript with Vue"
level: advanced
order: 23
duration: 18
summary: "Type Vue components end to end: props with defineProps, events with defineEmits, refs and template refs, provide/inject with InjectionKey, generic components, and type-checking .vue files with vue-tsc."
tags:
  - typescript
  - defineprops
  - vue-tsc
  - type-safety
---

# Learning Objectives

By the end of this lesson you will be able to:

- Type props and emits with the compiler macros.
- Type refs, template refs, and component refs.
- Type provide/inject with an `InjectionKey`.
- Write a generic component and type-check `.vue` files with `vue-tsc`.

# Why It Matters

Vue is written in TypeScript and offers first-class type support. Typing your components turns
whole classes of bugs into compile errors: a missing prop, the wrong event payload, a typo in a
store field. This entire course is written in TypeScript for exactly that reason — and so is this
learning app.

# Concept Explanation

### Turning on TypeScript

Add `lang="ts"` to your script block; scaffold projects with `npm create vue@latest` and choose
TypeScript. Types work throughout the Composition API.

### Typing props and emits

The compiler macros accept type arguments — the idiomatic way to type a component's inputs and
outputs:

```html
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: number
    title: string
    tags?: string[]
  }>(),
  { tags: () => [] },   // object/array defaults use a factory function
)

const emit = defineEmits<{
  save: [payload: { id: number }]
  cancel: []
}>()
</script>
```

`props` is fully typed, and `emit('save', …)` is checked against the declared payload.

### Typing refs and reactive state

`ref` infers its type from the initial value; annotate when it can be broader:

```typescript
import { ref, computed, reactive } from 'vue'

const count = ref(0)                 // Ref<number> (inferred)
const user = ref<User | null>(null)  // annotate the union
const state = reactive<{ items: string[] }>({ items: [] })
const double = computed(() => count.value * 2) // inferred
```

### Typing template refs and component refs

A DOM template ref is typed by its element; a component ref uses `InstanceType`:

```typescript
import { ref } from 'vue'
import MyForm from './MyForm.vue'

const input = ref<HTMLInputElement | null>(null)
const form = ref<InstanceType<typeof MyForm> | null>(null)
```

### Typing provide/inject

Use an `InjectionKey<T>` so `provide` and `inject` agree on the type:

```typescript
import type { InjectionKey, Ref } from 'vue'
export const themeKey = Symbol() as InjectionKey<Ref<'light' | 'dark'>>
```

### Generic components

A component can be **generic** with the `generic` attribute on `<script setup>` (Vue 3.3+),
letting props relate to each other by type:

```html
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
const emit = defineEmits<{ select: [item: T] }>()
</script>
```

Now `selected` and the `select` payload are the **same type** as the array's items — a typed,
reusable list component.

### Type-checking `.vue` files with `vue-tsc`

Plain `tsc` doesn't understand `.vue` single-file components. Use **`vue-tsc`** (the Vue-aware
type checker) to type-check them — that's why this project's `build` script runs `vue-tsc -b`
before `vite build`, and its `lint` script is `vue-tsc --noEmit`. In the editor, the official Vue
tooling (Volar) provides the same type information as you type.

# Key Terminology

- **`lang="ts"`** — enables TypeScript in a script block.
- **Type-based macros** — `defineProps<T>()` / `defineEmits<T>()` typed via type arguments.
- **`InstanceType<typeof Comp>`** — the type of a component instance (for component refs).
- **Generic component** — `<script setup lang="ts" generic="T">` relates props by type.
- **`vue-tsc`** — the type checker that understands `.vue` files.

# Options and Trade-offs

| Task | Type it with | Note |
| ---- | ------------ | ---- |
| Props | `defineProps<T>()` (+ `withDefaults`) | Object/array defaults need a factory |
| Emits | `defineEmits<T>()` | Payloads are tuples: `event: [arg]` |
| DOM ref | `ref<HTMLXxxElement \| null>(null)` | `null` until mounted |
| Component ref | `ref<InstanceType<typeof Comp> \| null>(null)` | Access exposed members only |
| Inject | `InjectionKey<T>` | Keeps provide/inject in sync |
| Check `.vue` | `vue-tsc` | `tsc` alone can't read SFCs |

# Worked Example

A typed, generic `SelectList` whose selection type matches its items:

```html
<!-- SelectList.vue -->
<script setup lang="ts" generic="T extends { id: number; label: string }">
defineProps<{
  items: T[]
  modelValue: T | null
}>()
const emit = defineEmits<{ 'update:modelValue': [value: T] }>()
</script>

<template>
  <ul>
    <li
      v-for="item in items"
      :key="item.id"
      :aria-selected="item.id === modelValue?.id"
      @click="emit('update:modelValue', item)"
    >
      {{ item.label }}
    </li>
  </ul>
</template>
```

```html
<!-- Parent.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import SelectList from './SelectList.vue'

type Fruit = { id: number; label: string }
const fruits: Fruit[] = [{ id: 1, label: 'Apple' }, { id: 2, label: 'Pear' }]
const chosen = ref<Fruit | null>(null)
</script>

<template>
  <SelectList :items="fruits" v-model="chosen" />
  <p>{{ chosen?.label }}</p>
</template>
```

Because the component is generic, TypeScript knows `chosen` is a `Fruit` — pass a different array
type and the model type follows automatically.

# Real World Analogy

TypeScript in Vue is like **labeled, keyed connectors** in electronics. A component's props are
sockets with specific shapes; events are plugs with specific pins. If a wire doesn't fit (wrong
type), it won't connect at build time — long before you power on the device (run the app).

# Examples

## Example 1 — Basic: typed props

```html
<script setup lang="ts">
defineProps<{ name: string; age?: number }>()
</script>
```

**Why this works:** The type argument makes `name` required and `age` optional; misuse is a compile
error.

## Example 2 — Real-world: typed emit payload

```html
<script setup lang="ts">
const emit = defineEmits<{ submit: [data: { email: string }] }>()
emit('submit', { email: 'a@b.co' }) // ✅ checked
</script>
```

**Why this works:** The payload shape is enforced, so the parent's handler is typed and callers
can't emit the wrong data.

## Example 3 — Trace / pitfall: type-checking with the wrong tool

```bash
tsc --noEmit          # ❌ doesn't understand .vue files
vue-tsc --noEmit      # ✅ Vue-aware type check
```

**Why this bites:** `.vue` SFCs aren't plain TypeScript; only `vue-tsc` (and Volar in the editor)
can type-check them. Using `tsc` alone silently skips your components.

# Common Mistakes

- **Object/array prop defaults without a factory** — use `{ tags: () => [] }`.
- **Type-checking with `tsc`** instead of `vue-tsc`, missing SFC errors.
- **Forgetting a template ref is `null`** until mount — type it as `T | null`.
- **Reaching into a child ref's internals** that weren't `defineExpose`d — only exposed members are
  typed and available.

# Best Practices

- Prefer **type-based** `defineProps`/`defineEmits`; they're concise and fully checked.
- Type template refs as `Element | null` and component refs via `InstanceType<typeof Comp>`.
- Use `InjectionKey<T>` for typed provide/inject and generic components for related props.
- Run **`vue-tsc`** in your build/CI so type errors fail the build (this project does).

# Summary

- Enable TS with `lang="ts"`; type props/emits with the **type-based macros**.
- `ref` infers types (annotate unions); template refs are `Element | null`; component refs use
  **`InstanceType<typeof Comp>`**.
- Type provide/inject with an **`InjectionKey`**; write **generic** components with `generic="T"`.
- Type-check `.vue` files with **`vue-tsc`** — plain `tsc` can't read SFCs.

# Flash Cards

Q: How do you type a component's props in <script setup>?
A: With the type-based macro: defineProps<{ ... }>(), adding withDefaults for defaults (object/array defaults need a factory function).

Q: How do you type a ref to a child component instance?
A: ref<InstanceType<typeof ChildComponent> | null>(null) — and you can only access members the child exposed via defineExpose.

Q: Why can't plain tsc type-check your components?
A: tsc doesn't understand the .vue single-file component format. Use vue-tsc (and Volar in the editor), which are Vue-aware.

Q: How do you make a component generic so its props relate by type?
A: Add the generic attribute to the script tag: <script setup lang="ts" generic="T">, then use T in defineProps/defineEmits.

Q: How do you keep provide and inject type-safe?
A: Use an InjectionKey<T> (a typed Symbol) as the key, so both sides infer the value's type.

# Exercises

### Easy
Add `lang="ts"` to a component and type its props with `defineProps<{ title: string }>()`. Trigger a
type error by omitting the prop.

### Medium
Type a component's `emit` with a payload (`defineEmits<{ change: [value: number] }>()`) and a
template ref to an `<input>`. Confirm the editor/`vue-tsc` catches a wrong payload.

### Challenging
Build a generic `DataTable<T>` component using `generic="T"` with typed `rows: T[]` and a scoped
slot exposing each `T`. Add an `InjectionKey`-typed context and run `vue-tsc` to prove the whole
thing type-checks.

# Further Reading

- [Using Vue with TypeScript](https://vuejs.org/guide/typescript/overview.html)
- [TypeScript with Composition API](https://vuejs.org/guide/typescript/composition-api.html)
- [Generic Components](https://vuejs.org/api/sfc-script-setup.html#generics)
