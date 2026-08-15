---
id: lesson-16
slug: state-management-with-pinia
title: "State Management with Pinia"
level: intermediate
order: 16
duration: 20
summary: "Share state across the whole app with Pinia, the official store: define stores with state, getters, and actions, use them in components, and keep destructured state reactive with storeToRefs."
tags:
  - pinia
  - state-management
  - store
  - storetorefs
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain when app-wide state management earns its place.
- Install Pinia and define a store.
- Use a store's state, getters, and actions in components.
- Keep destructured store state reactive with `storeToRefs`.

# Why It Matters

Props, events, and provide/inject cover local and subtree communication. But some state is
truly **app-wide** — the logged-in user, a shopping cart, a theme — needed by unrelated
components across the tree. **Pinia** is Vue's official store: one central, reactive source of
truth that any component can read and update, with great TypeScript support and devtools.

> This learning portal keeps its own state (theme, progress, course data) in composable stores —
> the same "shared reactive state" idea. Pinia is the batteries-included library version, and
> what you'll reach for in most production apps.

# Concept Explanation

### Installing Pinia

Create a Pinia instance and register it, like the router:

```typescript
// main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')
```

### Defining a store

`defineStore(id, …)` creates a store. The **setup form** looks just like a component's
`<script setup>` and reads naturally with the Composition API:

```typescript
// stores/counter.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)                          // state
  const double = computed(() => count.value * 2) // getter
  function increment() {                         // action
    count.value++
  }
  return { count, double, increment }
})
```

There's also an **options form** with `state`, `getters`, and `actions` keys — pick whichever
you prefer; they're equivalent:

```typescript
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: { double: (s) => s.count * 2 },
  actions: { increment() { this.count++ } },
})
```

### The three pieces

- **State** — the reactive data (`count`). In the options form it's a function returning the
  initial object.
- **Getters** — cached derived values (like `computed`), e.g. `double`.
- **Actions** — methods that change state; they can be **async** (do a fetch, then set state).

### Using a store in a component

Call the `useXStore()` function inside `setup`:

```html
<script setup lang="ts">
import { useCounterStore } from '../stores/counter'
const counter = useCounterStore()
</script>

<template>
  <button @click="counter.increment">{{ counter.count }} (×2 = {{ counter.double }})</button>
</template>
```

### `storeToRefs` — don't lose reactivity

Destructuring state/getters off the store **breaks reactivity** (same reason as a `reactive`
object). Use **`storeToRefs`** to destructure them as refs while keeping reactivity. Actions can
be destructured directly (they're plain functions):

```html
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from '../stores/counter'

const counter = useCounterStore()
const { count, double } = storeToRefs(counter) // reactive
const { increment } = counter                  // fine — it's a function
</script>
```

### Pinia vs Vuex

Pinia is the **officially recommended** state library for Vue and serves as the successor to
**Vuex**, which is now in maintenance mode. Pinia is simpler (no mutations), fully typed, and
modular.

# Key Terminology

- **Store** — a reactive, centralized container of state defined with `defineStore`.
- **State / Getters / Actions** — the store's data, derived values, and methods.
- **`storeToRefs`** — utility that destructures state/getters as reactive refs.
- **Setup store / options store** — the two equivalent ways to define a store.

# Options and Trade-offs

| Option | Reach | Use when | Watch out for |
| ------ | ----- | -------- | ------------- |
| Local state (`ref`) | One component | Component-only data | Not shared |
| Props/events | Parent ↔ child | Explicit local flow | Prop drilling |
| provide/inject | A subtree | Shared context in a branch | Implicit; not app-wide by default |
| Pinia store | Whole app | App-wide shared state (user, cart, theme) | Slight setup; keep stores focused |

# Worked Example

A cart store with state, a getter, and an async action, used by two unrelated components:

```typescript
// stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<{ id: number; price: number; qty: number }[]>([])
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))

  function add(item: { id: number; price: number }) {
    const found = items.value.find((i) => i.id === item.id)
    if (found) found.qty++
    else items.value.push({ ...item, qty: 1 })
  }
  async function checkout() {
    await fetch('/api/checkout', { method: 'POST', body: JSON.stringify(items.value) })
    items.value = []
  }
  return { items, total, add, checkout }
})
```

```html
<!-- CartBadge.vue (in the header) -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '../stores/cart'
const { items, total } = storeToRefs(useCartStore())
</script>

<template>
  <span>{{ items.length }} items — ${{ total }}</span>
</template>
```

The header badge and a product page can both use `useCartStore()`; they share one cart, and any
change is reflected everywhere instantly.

# Real World Analogy

A Pinia store is the **shared whiteboard in an office**. Anyone (any component) can walk up, read
the current numbers (state), read a computed summary (getter), or update figures through the
agreed procedure (actions). Everyone sees the same board, so there's one source of truth instead
of a dozen sticky notes that drift out of sync.

# Examples

## Example 1 — Basic: a setup store

```typescript
export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(false)
  const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
  return { sidebarOpen, toggleSidebar }
})
```

**Why this works:** Any component can toggle and read the sidebar state through one shared store.

## Example 2 — Real-world: an async action

```typescript
async function loadUser(id: number) {
  user.value = await (await fetch(`/api/users/${id}`)).json()
}
```

**Why this works:** Actions can be async, so data-fetching logic lives in the store, close to the
state it updates — reusable from any component.

## Example 3 — Trade-off / pitfall: destructuring without storeToRefs

```typescript
const cart = useCartStore()
const { total } = cart      // ❌ total is a plain number now — not reactive
```

**Why this bites:** Destructuring state/getters off the store copies the current value and loses
reactivity. Use `storeToRefs(cart)` for state and getters; destructure actions directly.

# Common Mistakes

- **Destructuring state/getters directly** and losing reactivity — use `storeToRefs`.
- **Putting everything in one giant store** — split by domain (`useCartStore`, `useUserStore`).
- **Reaching for a store for local-only state** — a plain `ref` is simpler there.
- **Forgetting `app.use(createPinia())`** before using any store.

# Best Practices

- Define one store per concern; give each a clear `id`.
- Use `storeToRefs` when destructuring state/getters; call actions directly.
- Put async data-fetching in **actions**, keeping components thin.
- Reserve Pinia for genuinely shared/app-wide state; keep component-only data local.

# Summary

- **Pinia** is Vue's official store for **app-wide** shared state; install it with
  `app.use(createPinia())`.
- `defineStore` supports a **setup** form (like `<script setup>`) or an **options** form; both
  have **state**, **getters**, and **actions**.
- Use a store by calling `useXStore()`; keep destructured state reactive with **`storeToRefs`**.
- Pinia is the recommended successor to Vuex.

# Flash Cards

Q: What are the three parts of a Pinia store?
A: State (the reactive data), getters (cached derived values, like computed), and actions (methods that change state, and can be async).

Q: Why do you need storeToRefs when destructuring a store?
A: Destructuring state/getters off the store copies the current values and loses reactivity. storeToRefs returns them as reactive refs. Actions can be destructured directly since they're functions.

Q: What is Pinia's relationship to Vuex?
A: Pinia is the officially recommended state library and the successor to Vuex, which is now in maintenance mode.

Q: How do you use a store inside a component?
A: Call its useXStore() function in setup, then read state/getters and call actions on the returned store object.

Q: When is a Pinia store the right choice over a plain ref or provide/inject?
A: When state is genuinely app-wide — needed by many unrelated components — rather than local to one component or a single subtree.

# Exercises

### Easy
Create a `useCounterStore` (setup form) with `count`, a `double` getter, and an `increment`
action. Use it in a component.

### Medium
Build a `useTodosStore` with `todos` state, an `addTodo` action, and a `remaining` getter
(count of unfinished todos). Show `remaining` in one component and the list in another.

### Challenging
Create a `useAuthStore` with a `user` ref, an async `login(credentials)` action that sets the
user, and a `logout` action. Destructure it correctly with `storeToRefs` in a header component,
and gate a Vue Router route behind `user` being set.

# Further Reading

- [Pinia — Introduction](https://pinia.vuejs.org/introduction.html)
- [Defining a Store](https://pinia.vuejs.org/core-concepts/)
- [`storeToRefs`](https://pinia.vuejs.org/core-concepts/#using-the-store)
