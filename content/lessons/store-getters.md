---
slug: store-getters
title: "Store Getters"
topic: routing-state
kind: api
summary: "Getters represent cached derived state computed from store state."
tags: [pinia, getters, computed, derived-state]
related: [define-store, store-state, computed-basics]
---
> **In one line:** Getters are computed properties for stores that cache derived state automatically.

## The idea

Just as components use computed properties to derive state from refs, Pinia stores use **getters** to derive state from store state.

Getters:
1. Are **cached** based on their reactive dependencies.
2. Only re-evaluate when their underlying state properties change.
3. Are accessed directly on the store instance just like state properties (e.g. `store.activeUsersCount`).

```tree
Pinia Getters
  State: users = [{ name: 'Ada', active: true }, { name: 'Grace', active: false }]
    [Getter: activeUsers] Automatically filters active users and caches result @green
      [Getter: activeCount] Derives activeUsers.length from activeUsers @blue
```

Getters can also access other getters on the same store, or even read getters from completely different Pinia stores.

## See it

```typescript
// stores/cart.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface CartItem {
  id: string;
  name: string;
  price: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  // Getter: calculated total price
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price, 0);
  });

  // Getter that depends on another getter:
  const formattedTotal = computed(() => {
    return `$${totalPrice.value.toFixed(2)}`;
  });

  return { items, totalPrice, formattedTotal };
});
```

In any component:

```html
<script setup lang="ts">
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
</script>

<template>
  <div class="cart-summary">
    <p>Items in cart: {{ cart.items.length }}</p>
    <p>Total: {{ cart.formattedTotal }}</p>
  </div>
</template>
```

`cart.formattedTotal` updates automatically whenever items are added or removed.

## Go deeper

If you need a getter that accepts parameters (like finding an item by ID), return a function from the getter: `const getItemById = computed(() => (id: string) => items.value.find(i => i.id === id))`.

> **Tip:** In Option stores, getters access state via their first argument (`state`) or via `this`.

## Watch out

- Getters that return functions cannot be cached by Vue; the returned function re-runs on every call.
- Getters must be pure functions free of side effects or asynchronous operations.

## Remember

- Getters are cached computed properties for Pinia stores.
- They only re-evaluate when their tracked store dependencies change.
- Accessed directly as properties on the store instance: store.totalPrice.
