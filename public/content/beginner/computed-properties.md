---
id: lesson-04
slug: computed-properties
title: "Computed Properties"
level: beginner
order: 4
duration: 16
summary: "Derive cached state with computed(), understand why computed beats a method for derived values, and create a writable computed with get and set."
tags:
  - computed
  - derived-state
  - caching
  - reactivity
---

# Learning Objectives

By the end of this lesson you will be able to:

- Create derived state with `computed()`.
- Explain how a computed property is **cached** and when it re-evaluates.
- Choose between a computed property and a method.
- Write a **writable computed** with `get` and `set`.

# Why It Matters

You often need values *derived* from your state: a full name from first and last, a filtered
list, a formatted price. You could recompute these inline in the template, but that clutters
the markup and recalculates on every render. A **computed property** gives derived state a
name, keeps the template clean, and — crucially — **caches** the result so it only
recalculates when its inputs change.

# Concept Explanation

### Creating a computed property

`computed()` takes a getter function and returns a **readonly ref** whose value is the
getter's result:

```typescript
import { ref, computed } from 'vue'

const firstName = ref('Ada')
const lastName = ref('Lovelace')

const fullName = computed(() => `${firstName.value} ${lastName.value}`)
console.log(fullName.value) // "Ada Lovelace"
```

Like any ref, you read it with `.value` in scripts and unwrapped in templates:

```html
<template>
  <p>{{ fullName }}</p>
</template>
```

### Caching: the key idea

A computed property **caches** its value based on its **reactive dependencies**. Vue notes
which reactive data the getter reads (`firstName`, `lastName`), and only re-runs the getter
when one of those changes. If you read `fullName` ten times without changing the names, the
getter runs **once**.

A **method**, by contrast, runs every single time it's called — including on every
re-render. For a pure derived value, a computed is both faster and clearer.

### Computed vs method

```html
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref([1, 2, 3, 4])

// Cached: re-runs only when `items` changes
const total = computed(() => items.value.reduce((a, b) => a + b, 0))

// Runs on every render, every call
function totalFn() {
  return items.value.reduce((a, b) => a + b, 0)
}
</script>
```

### Writable computed

By default a computed is read-only. If you need to write to it, provide an object with
`get` and `set`:

```typescript
import { ref, computed } from 'vue'

const first = ref('Ada')
const last = ref('Lovelace')

const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (value: string) => {
    ;[first.value, last.value] = value.split(' ')
  },
})

fullName.value = 'Grace Hopper' // sets first and last via the setter
```

The getter must stay **side-effect-free** — no changing other state, no async calls, no
mutating the DOM. Put those in a watcher instead (a later lesson).

# Key Terminology

- **Computed property** — cached derived state produced by `computed()`.
- **Getter** — the function that computes the value.
- **Cache** — the stored result, reused until a dependency changes.
- **Dependency** — a reactive value the getter reads; changing it invalidates the cache.
- **Writable computed** — a computed with both `get` and `set`.

# Options and Trade-offs

| Option | Recomputes | Best for | Watch out for |
| ------ | ---------- | -------- | ------------- |
| `computed` | Only when a dependency changes (cached) | Pure derived values used in the template | Getter must be side-effect-free |
| Method | Every render / every call | Event handlers; values that must run every time | No caching — can be wasteful for derived data |
| Writable `computed` | On read (get) and on assignment (set) | Two-way derived values (e.g. split/join) | Keep the getter pure; side effects belong in the setter or a watcher |

# Worked Example

A cart summary derived from a list of line items:

```html
<script setup lang="ts">
import { ref, computed } from 'vue'

const items = ref([
  { name: 'Book', price: 12, qty: 2 },
  { name: 'Pen', price: 3, qty: 5 },
])

const subtotal = computed(() =>
  items.value.reduce((sum, i) => sum + i.price * i.qty, 0),
)
const itemCount = computed(() => items.value.reduce((n, i) => n + i.qty, 0))
</script>

<template>
  <p>{{ itemCount }} items — total ${{ subtotal }}</p>
</template>
```

`subtotal` and `itemCount` recalculate only when `items` changes. Add a quantity and both
update; re-render for an unrelated reason and the cached values are reused.

# Real World Analogy

A computed property is like a **cached search result**. The first time you ask, it does the
work and remembers the answer. Ask again with the same inputs and it hands back the saved
answer instantly. Only when the underlying data changes does it redo the search.

# Examples

## Example 1 — Basic: a derived boolean

```html
<script setup lang="ts">
import { ref, computed } from 'vue'
const age = ref(20)
const canVote = computed(() => age.value >= 18)
</script>

<template>
  <p>{{ canVote ? 'Can vote' : 'Too young' }}</p>
</template>
```

**Why this works:** `canVote` is derived from `age` and re-evaluates only when `age` changes.

## Example 2 — Real-world: a filtered list

```html
<script setup lang="ts">
import { ref, computed } from 'vue'

const query = ref('')
const names = ref(['Ada', 'Alan', 'Grace'])

const matches = computed(() =>
  names.value.filter((n) => n.toLowerCase().includes(query.value.toLowerCase())),
)
</script>
```

**Why this works:** `matches` depends on `query` and `names`; it recomputes only when either
changes, so typing filters the list efficiently.

## Example 3 — Trade-off / pitfall: side effects in a getter

```typescript
// Anti-pattern: the getter mutates other state
const doubled = computed(() => {
  count.value++          // side effect — don't do this
  return other.value * 2
})
```

**Why this bites:** A computed getter should only *derive and return* a value. Mutating state
inside it causes confusing, hard-to-track updates. Use a watcher for side effects.

# Common Mistakes

- **Using a method where a computed fits.** Methods don't cache; derived values used in the
  template should usually be computed.
- **Putting side effects in the getter** (mutating state, fetching data). Keep getters pure.
- **Forgetting `.value`** when reading a computed in a script (it's a ref).
- **Trying to assign to a read-only computed.** Add a `set` if you need to write to it.

# Best Practices

- Reach for `computed` for any value derived from reactive state and shown in the template.
- Keep getters small and pure; name them for what they represent (`fullName`, `subtotal`).
- Use a **writable computed** for clean two-way derived values instead of manual event
  wiring.

# Summary

- `computed()` produces **cached** derived state as a readonly ref.
- It re-evaluates **only when a reactive dependency changes** — unlike a method, which runs
  every time.
- Getters must be **side-effect-free**.
- Provide `{ get, set }` for a **writable computed**.

# Flash Cards

Q: How is a computed property different from a method?
A: A computed is cached and only re-evaluates when a reactive dependency changes; a method runs every time it's called, including on every re-render.

Q: What must a computed getter avoid doing?
A: Side effects — it should only derive and return a value, not mutate other state, fetch data, or touch the DOM.

Q: How do you make a computed writable?
A: Pass an object with get and set functions to computed({ get, set }); assigning to .value runs the setter.

Q: When exactly does a computed recalculate?
A: Only when one of the reactive values its getter reads (its dependencies) changes.

Q: Is a computed's value read with .value in scripts?
A: Yes — a computed returns a ref, so in JavaScript you read it via .value; in templates it's auto-unwrapped.

# Exercises

### Easy
Given `price` and `taxRate` refs, create a `computed` `totalWithTax` and display it.

### Medium
Build a search box: a `query` ref and a `results` computed that filters a list of strings.
Confirm (with a `console.log` in the getter) that it only runs when `query` or the list
changes, not on unrelated re-renders.

### Challenging
Create a writable computed `fullName` backed by `first` and `last` refs. Bind it to an
`<input v-model="fullName">` so typing a full name updates both `first` and `last` via the
setter.

# Further Reading

- [Computed Properties](https://vuejs.org/guide/essentials/computed.html)
- [`computed()` — API](https://vuejs.org/api/reactivity-core.html#computed)
