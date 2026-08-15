---
id: lesson-03
slug: reactivity-fundamentals-ref
title: "Reactivity Fundamentals: ref()"
level: beginner
order: 3
duration: 20
summary: "Create reactive state with ref (and reactive), understand why refs need .value in JavaScript but auto-unwrap in templates, and learn when to choose ref vs reactive."
tags:
  - reactivity
  - ref
  - reactive
  - state
---

# Learning Objectives

By the end of this lesson you will be able to:

- Create reactive state with `ref()`.
- Explain why you write `.value` in JavaScript but not in templates.
- Create reactive objects with `reactive()` and list its caveats.
- Choose between `ref` and `reactive` with confidence.
- Describe what "deep reactivity" means.

# Why It Matters

Reactivity is the feature that makes Vue *Vue*. When you store data in a **ref**, Vue knows
whenever you read or change it, so it can update exactly the parts of the page that depend
on it. Get this right and the UI stays in sync effortlessly; get it wrong (a plain variable
instead of a ref) and your screen silently stops updating.

# Concept Explanation

### Reactive state with `ref`

`ref()` takes an initial value and returns a **ref**: an object with a single `.value`
property that holds the value.

```typescript
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0
count.value++            // now 1
```

In JavaScript you always go through `.value` to read or write a ref. In a **template**, a
top-level ref is **automatically unwrapped**, so you write `count`, not `count.value`:

```html
<template>
  <button @click="count++">{{ count }}</button>
</template>
```

### Why `.value` exists

JavaScript can't detect when you read or reassign a plain variable like `let count = 0`.
By wrapping the value in an object, Vue can define a getter and setter on `.value` and thus
**track** every read and **trigger** updates on every write. That's the price of `.value` in
scripts — and Vue removes it for you in templates.

### Reactive objects with `reactive`

`reactive()` makes an entire object reactive and returns a **Proxy** of it. You access its
properties directly — no `.value`:

```typescript
import { reactive } from 'vue'

const state = reactive({ count: 0, user: { name: 'Ada' } })
state.count++              // reactive
state.user.name = 'Grace'  // nested changes are reactive too
```

Reactivity is **deep** by default: nested objects and arrays are reactive as well.

### The caveats of `reactive`

`reactive` has limits that `ref` does not:

- It only works on **objects** (including arrays, `Map`, `Set`) — not on primitives like
  numbers or strings.
- You **cannot replace the whole object** and keep reactivity: `state = reactive({...})`
  breaks the link.
- **Destructuring** its properties loses reactivity: `let { count } = state` gives you a
  plain, disconnected number.

Because a `ref` sidesteps all three (it holds any type, can be reassigned via `.value`, and
survives being passed around), **`ref` is the recommended default**. A `ref` that holds an
object is deeply reactive too — it uses `reactive` internally for the object value.

# Key Terminology

- **ref** — a reactive container with a `.value` property, created by `ref()`.
- **`.value`** — how you read/write a ref's inner value in JavaScript.
- **Unwrapping** — the template's automatic access of a top-level ref's `.value` for you.
- **reactive** — a function that returns a deeply reactive Proxy of an object.
- **Proxy** — a JavaScript object that intercepts property reads and writes (how Vue 3
  tracks reactive objects).
- **Deep reactivity** — nested properties are reactive, not just top-level ones.

# Options and Trade-offs

| Option | Works on | Access | Watch out for |
| ------ | -------- | ------ | ------------- |
| `ref()` | Any value (primitives and objects) | `.value` in JS; unwrapped in templates | Remembering `.value` in scripts |
| `reactive()` | Objects/arrays/Map/Set only | Direct property access | Can't reassign the whole object; destructuring loses reactivity |

# Worked Example

A tiny form model that mixes a `ref` primitive and a `reactive` object:

```html
<script setup lang="ts">
import { ref, reactive } from 'vue'

const count = ref(0)
const form = reactive({ name: '', agreed: false })

function submit() {
  // .value for the ref; direct access for the reactive object
  console.log(count.value, form.name, form.agreed)
}
</script>

<template>
  <button @click="count++">Clicked {{ count }} times</button>

  <input v-model="form.name" placeholder="Name" />
  <label><input type="checkbox" v-model="form.agreed" /> I agree</label>

  <button :disabled="!form.agreed" @click="submit">Submit</button>
</template>
```

Note the two styles side by side: `count.value` in the script but `{{ count }}` in the
template, and `form.name` directly (a `reactive` object needs no `.value`).

# Real World Analogy

A `ref` is like a **labeled box**. You can't change what a plain variable "is" and have Vue
notice — but if everything lives in a box, Vue can watch the box's single slot (`.value`)
and know the instant its contents change. `reactive` is like putting a whole filing cabinet
under watch: every drawer (property) is observed, but you can't swap the entire cabinet for
a new one without breaking the surveillance.

# Examples

## Example 1 — Basic: a boolean toggle

```html
<script setup lang="ts">
import { ref } from 'vue'
const open = ref(false)
</script>

<template>
  <button @click="open = !open">{{ open ? 'Hide' : 'Show' }}</button>
</template>
```

**Why this works:** `open` is a ref; in the template it's unwrapped, so `open = !open`
toggles `.value` and the label re-renders.

## Example 2 — Real-world: a ref holding an object

```typescript
import { ref } from 'vue'

const user = ref({ name: 'Ada', online: false })
user.value.online = true          // deep reactivity works
user.value = { name: 'Grace', online: true } // reassigning the whole object is fine with ref
```

**Why this works:** A `ref` can hold an object *and* be reassigned wholesale — something
`reactive` can't do. The object's nested fields are reactive because `ref` uses `reactive`
under the hood for object values.

## Example 3 — Trade-off / pitfall: destructuring a reactive object

```typescript
import { reactive } from 'vue'

const state = reactive({ count: 0 })
let { count } = state   // count is now a plain number, disconnected
count++                 // does NOT update state.count or the UI
```

**Why this bites:** Destructuring copies the current value out of the Proxy, so the copy is
no longer reactive. Keep accessing `state.count`, or convert with `toRefs` (a later lesson).

# Common Mistakes

- **Forgetting `.value` in JavaScript.** `count++` on a ref in a script does nothing useful;
  it must be `count.value++`. (In templates, omit `.value`.)
- **Using `reactive` for a primitive.** `reactive(0)` doesn't work — use `ref(0)`.
- **Reassigning a `reactive` object.** `state = reactive({...})` breaks reactivity; mutate
  its properties instead, or use a `ref`.
- **Destructuring reactive state** and expecting the pieces to stay reactive.

# Best Practices

- **Default to `ref`** for state. Reach for `reactive` only when you specifically want a
  single object with direct property access and won't reassign it.
- Keep related state together in a `ref(object)` or `reactive(object)` rather than many
  loose refs when it reads better.
- Remember the rule of thumb: **`.value` in scripts, plain name in templates.**

# Summary

- `ref()` creates reactive state for **any** value; read/write it via `.value` in scripts,
  and it's auto-unwrapped in templates.
- `.value` exists so Vue can intercept reads and writes to track and trigger updates.
- `reactive()` makes an **object** deeply reactive (a Proxy), accessed by direct property.
- `reactive` can't hold primitives, be reassigned, or be destructured without losing
  reactivity — so **`ref` is the recommended default**.

# Flash Cards

Q: How do you read and change a ref's value in JavaScript?
A: Through its .value property, e.g. count.value to read and count.value++ to change it.

Q: Why don't you write .value in templates?
A: Vue automatically unwraps top-level refs in templates, so you write {{ count }} instead of {{ count.value }}.

Q: Why does a ref need a .value wrapper at all?
A: JavaScript can't detect reads/writes of a plain variable. Wrapping the value in an object lets Vue intercept access to .value and track reactivity.

Q: What are the three main caveats of reactive()?
A: It only works on objects (not primitives), it loses reactivity if you reassign the whole object, and destructuring its properties disconnects them.

Q: Which should you reach for by default, ref or reactive?
A: ref — it holds any type, can be reassigned via .value, and survives being passed around; reactive is for a single object you access by property and won't reassign.

Q: What does "deep reactivity" mean?
A: Nested objects and arrays inside reactive state are reactive too, not just the top-level properties.

# Exercises

### Easy
Create a `ref` number `temperature` and buttons that increment and decrement it. Display it
in the template (no `.value` there).

### Medium
Model a small settings object with `reactive({ darkMode: false, fontSize: 16 })`. Bind
checkboxes/inputs to its properties and show a live preview that reads the values directly.

### Challenging
Write a snippet that demonstrates the destructuring pitfall: destructure a property off a
`reactive` object, mutate the copy, and show (with `console.log`) that the original and the
UI don't change. Then fix it by keeping the property access on the object.

# Further Reading

- [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [`ref()` — API](https://vuejs.org/api/reactivity-core.html#ref)
- [`reactive()` — API](https://vuejs.org/api/reactivity-core.html#reactive)
