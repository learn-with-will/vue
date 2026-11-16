---
slug: how-reactivity-works
title: "How Vue Reactivity Works: Track & Trigger"
topic: advanced-reactivity
kind: concept
summary: "Understand the underlying track and trigger mechanism powered by JavaScript Proxies."
tags: [reactivity, internals, proxies, track-trigger]
related: [reactive-objects, ref-primitive, shallow-ref]
---
> **In one line:** Vue reactivity uses Proxy traps to track active effects on get, and trigger them on set.

## The idea

How does Vue magically know when to re-render a component or recalculate a computed property?

At the heart of Vue 3 is the **Track and Trigger** engine, powered by native JavaScript **Proxies**:

1. **Track (on property read / get):**
   When a template render function, computed getter, or `watchEffect` runs, it sets itself as the **active effect**. When code reads a reactive property (e.g. `user.name` or `count.value`), the Proxy's `get` trap intercepts the read and records that property as a dependency of the active effect.
2. **Trigger (on property write / set):**
   When code writes a new value (e.g. `count.value = 5`), the Proxy's `set` trap intercepts the mutation. It looks up all effects registered during the tracking phase and **triggers them to re-run**!

```flow
read: Property Read (get trap) @primary
track: track() records active effect in Dep set @blue
write: Property Write (set trap) @amber
trigger: trigger() re-runs all dependent effects @green
read -> track
write -> trigger
```

Because this system is built entirely on native JavaScript `Proxy` objects, Vue can detect property addition, property deletion, and array mutations transparently without special `Vue.set()` APIs.

## See it

```typescript
// Conceptual model of Vue 3 track & trigger:
let activeEffect: (() => void) | null = null;
const targetMap = new WeakMap<object, Map<string, Set<() => void>>>();

function track(target: object, key: string) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  dep.add(activeEffect);
}

function trigger(target: object, key: string) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) dep.forEach(effect => effect());
}
```

Every `ref()` and `reactive()` in your application delegates its reads and writes to this exact mechanism.

## Go deeper

Vue uses a global `targetMap` (a `WeakMap`) mapping objects to their property dependency sets, ensuring garbage collection cleans up dependencies when components unmount.

> **Tip:** Understanding track & trigger makes it obvious why destructuring reactive objects breaks reactivity: destructuring performs a single get read outside any active tracking effect!

## Watch out

- Operations that do not invoke get or set traps (like raw pointer reassignments) cannot be tracked.
- Avoid triggering infinite loops by mutating a reactive variable inside an effect that tracks that same variable.

## Remember

- Vue 3 reactivity is powered by native JavaScript Proxy traps.
- track() registers the active effect when a reactive property is read.
- trigger() executes all dependent effects when a reactive property is written.
