---
slug: to-raw-and-mark-raw
title: "Escaping Reactivity: toRaw and markRaw"
topic: advanced-reactivity
kind: api
summary: "Escape the reactivity proxy system using toRaw to read raw objects and markRaw to permanently prevent proxying."
tags: [toraw, markraw, reactivity, performance]
related: [how-reactivity-works, shallow-ref, shallow-reactive]
---
> **In one line:** toRaw() returns the underlying original object; markRaw() marks an object to never be proxied.

## The idea

While Vue's automatic reactivity is extraordinarily convenient, there are cases where you must escape the Proxy system:
1. **Third-party libraries:** Libraries like Three.js, Leaflet maps, or complex audio contexts often break when wrapped in Proxies because they rely on private class fields or strict reference equality.
2. **Performance:** Reading deeply nested properties without triggering Proxy get traps.
3. **Serialization:** Passing data to Web Workers or cloning via `structuredClone()`.

Vue provides two escape hatches:
- **`toRaw(proxy)`:** Returns the original raw, non-proxied object behind a `reactive` or `readonly` proxy.
- **`markRaw(object)`:** Permanently marks an object so that it can **never be converted into a reactive Proxy**.

```tree
Reactivity Escape Hatches
  toRaw(reactiveObj)
    [Unwrap] Retrieves original target object from Proxy @green
  markRaw(plainObj)
    [Opt-out] Stamps object with __v_skip: true so Vue never proxies it @blue
```

## See it

```typescript
import { reactive, toRaw, markRaw } from 'vue';

// 1. toRaw: Retrieve raw object for inspection or external libraries
const state = reactive({ count: 1 });
const rawState = toRaw(state);
console.log(rawState === state); // false (rawState is a plain object)

// 2. markRaw: Prevent an object from ever becoming a Proxy
interface ComplexSDK {
  connect: () => void;
}

const sdkInstance: ComplexSDK = markRaw({
  connect() { console.log('Connected to hardware'); }
});

const appState = reactive({
  user: 'Ada',
  sdk: sdkInstance // sdkInstance will NOT be converted to a Proxy!
});

console.log(appState.sdk === sdkInstance); // true!
```

`appState.sdk` remains a raw, un-proxied object reference, preserving third-party SDK compatibility.

## Go deeper

`markRaw` works by attaching an internal non-enumerable property: `__v_skip: true`. Vue's reactivity engine checks this flag before creating Proxies.

> **Tip:** Use `markRaw` when storing complex component definitions, router instances, or external class instances inside reactive state.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- toRaw returns an object that does NOT trigger reactivity; mutations on the raw object will not update the DOM.
- markRaw is shallow: properties inside the marked object can still be proxied if assigned elsewhere.

## Remember

- toRaw() retrieves the underlying raw object from a reactive Proxy.
- markRaw() permanently marks an object to prevent it from becoming reactive.
- Essential for integrating external libraries, SDKs, and complex class instances.
