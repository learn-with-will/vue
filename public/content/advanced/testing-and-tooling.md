---
id: lesson-24
slug: testing-and-tooling
title: "Testing & Tooling — Capstone"
level: advanced
order: 24
duration: 20
summary: "Test Vue components with Vitest and Vue Test Utils, understand the Vite toolchain that scaffolds, runs, and builds an app, and tie the whole course together into one mental model."
tags:
  - testing
  - vitest
  - vue-test-utils
  - vite
---

# Learning Objectives

By the end of this lesson you will be able to:

- Write a component test with Vitest and Vue Test Utils.
- Assert on rendered output, user interaction, and emitted events.
- Describe the Vite toolchain from scaffold to production build.
- Connect every concept in this course into one workflow.

# Why It Matters

Two things turn "I wrote a component" into "I shipped a reliable app": **tests** that catch
regressions, and **tooling** that scaffolds, runs, type-checks, and bundles your code. This
capstone shows both — and steps back to see how reactivity, components, routing, and state fit
together (this very portal is one such app).

# Concept Explanation

### Vitest — the test runner

**Vitest** is a fast, Vite-native test runner. It shares your Vite config, so your tests
understand the same aliases, TypeScript, and SFCs. Tests use `describe`/`it`/`expect`:

```typescript
import { describe, it, expect } from 'vitest'

describe('math', () => {
  it('adds', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Component tests need a DOM; Vitest provides one via a `jsdom`/`happy-dom` environment.

### Vue Test Utils — mounting components

**Vue Test Utils** (VTU) renders a component into that DOM and gives you a `wrapper` to query and
interact with:

```typescript
import { mount } from '@vue/test-utils'
import Counter from '../Counter.vue'

it('increments on click', async () => {
  const wrapper = mount(Counter, { props: { start: 5 } })

  expect(wrapper.text()).toContain('5')

  await wrapper.find('button').trigger('click') // await the DOM update
  expect(wrapper.text()).toContain('6')
})
```

Key wrapper methods:

- `wrapper.find(selector)` / `wrapper.get(selector)` — query elements (`get` throws if missing).
- `wrapper.text()` — the rendered text.
- `wrapper.trigger('click')` — fire an event (await it, since updates are async).
- `wrapper.emitted('eventName')` — the events the component emitted, to assert on.

### Testing props and emits

```typescript
it('emits submit with the payload', async () => {
  const wrapper = mount(SignupForm)
  await wrapper.find('form').trigger('submit')
  expect(wrapper.emitted('submit')?.[0]).toEqual([{ email: '' }])
})
```

Test **behavior** (what the user sees and what the component emits), not internal implementation
details — that keeps tests robust as you refactor.

### The Vite toolchain

The commands you'll use daily:

```bash
npm create vue@latest    # scaffold a project (TS, Router, Pinia, Vitest optional)
npm install
npm run dev              # dev server with instant Hot Module Replacement (HMR)
npm run build            # type-check + production build into dist/
npm run preview          # serve the production build locally
```

- **Dev**: Vite serves modules on demand with **HMR**, so edits appear instantly.
- **Build**: Vite produces an optimized, minified, tree-shaken bundle and code-splits your lazy
  routes/components. This project's `build` first runs **`vue-tsc`** so type errors fail the build.
- **Deploy**: the built `dist/` is static files you can host anywhere. This portal deploys to
  **GitHub Pages** via a GitHub Actions workflow that runs `npm run build` and publishes `dist/`.

### The whole course, connected

A real Vue app pulls it all together:

```text
reactivity (ref/computed/watch)  →  the data model
components + props/emits + slots  →  the UI, composed and communicating
composables                      →  reusable logic
Vue Router                       →  pages and navigation
Pinia (or composable stores)     →  shared app state
built-ins (Teleport/Transition)  →  polish
Vitest + Vue Test Utils          →  confidence
Vite + vue-tsc                   →  scaffold, run, type-check, build, deploy
```

That's the mental model: reactive state drives components, components compose into routed pages,
shared state lives in stores, and tooling ships it — exactly how this learning portal is built.

# Key Terminology

- **Vitest** — a Vite-native unit test runner (`describe`/`it`/`expect`).
- **Vue Test Utils (VTU)** — the official library for mounting and testing components.
- **`wrapper`** — the mounted-component handle you query and interact with.
- **HMR** — Hot Module Replacement; live updates in dev without a full reload.

# Options and Trade-offs

| Tool / choice | What it's for | Note |
| ------------- | ------------- | ---- |
| Vitest | Unit/component tests | Fast; shares Vite config |
| Vue Test Utils | Mount + interact with components | Test behavior, not internals |
| End-to-end (Playwright/Cypress) | Whole-app flows in a real browser | Slower; complements unit tests |
| `npm run dev` vs `build` | Fast iteration vs shipping | Always deploy the production build |

# Worked Example

A `Counter.vue` and its test — the full loop of build and verify:

```html
<!-- Counter.vue -->
<script setup lang="ts">
import { ref } from 'vue'
const props = withDefaults(defineProps<{ start?: number }>(), { start: 0 })
const count = ref(props.start)
const emit = defineEmits<{ change: [value: number] }>()
function inc() {
  count.value++
  emit('change', count.value)
}
</script>

<template>
  <button @click="inc">Count: {{ count }}</button>
</template>
```

```typescript
// Counter.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('renders the start value and increments', async () => {
    const wrapper = mount(Counter, { props: { start: 2 } })
    expect(wrapper.text()).toContain('Count: 2')

    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('Count: 3')
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
  })
})
```

The test mounts with a prop, asserts the initial render, simulates a click, and checks both the
updated text and the emitted event — verifying the component from the user's point of view.

# Real World Analogy

Tooling is the **factory and quality line**. Vite is the assembly line (fast, automated); `vue-tsc`
is the dimensional inspection (do the parts fit?); Vitest + VTU are the **test bench** where you
press the buttons and confirm the product behaves before it ships. You wouldn't ship a device
without powering it on once — tests are that power-on check, automated.

# Examples

## Example 1 — Basic: asserting rendered text

```typescript
const wrapper = mount(Hello, { props: { name: 'Ada' } })
expect(wrapper.text()).toContain('Hello, Ada')
```

**Why this works:** VTU renders the component with props; `text()` returns what the user sees.

## Example 2 — Real-world: testing an emitted event

```typescript
await wrapper.find('[data-test="delete"]').trigger('click')
expect(wrapper.emitted('delete')).toHaveLength(1)
```

**Why this works:** Interacting through the DOM and asserting on `emitted` tests behavior, not
internals — robust against refactors.

## Example 3 — Trade-off / pitfall: forgetting to await an interaction

```typescript
wrapper.find('button').trigger('click')      // not awaited
expect(wrapper.text()).toContain('1')        // ❌ DOM not updated yet
```

**Why this bites:** DOM updates are asynchronous. `trigger` returns a promise you should `await` (or
`await nextTick()`) before asserting on the updated output.

# Common Mistakes

- **Not awaiting `trigger`/updates**, then asserting on stale output.
- **Testing internal implementation** (private refs) instead of user-visible behavior.
- **Shipping the dev server** instead of a production build.
- **Skipping type-check in CI** — let `vue-tsc` fail the build on type errors.

# Best Practices

- Test **behavior**: rendered output, interactions, and emitted events.
- `await` interactions and DOM updates before asserting.
- Keep the toolchain honest: run `vue-tsc` and tests in CI; deploy the `dist/` build.
- Scaffold with `npm create vue@latest` so testing, routing, and TypeScript are wired up for you.

# Summary

- **Vitest** runs fast, Vite-native tests; **Vue Test Utils** mounts components and gives you a
  `wrapper` to query and interact with.
- Assert on **rendered text**, **interactions** (`trigger`, awaited), and **`emitted`** events —
  test behavior, not internals.
- The **Vite toolchain** scaffolds (`npm create vue@latest`), runs with HMR (`dev`), type-checks +
  bundles (`build`, via `vue-tsc` + Vite), and deploys static `dist/`.
- Everything connects: reactive state → components → routed pages → shared stores → built-ins →
  tests → build → deploy. That's a complete Vue app — like this one.

# Flash Cards

Q: What does Vue Test Utils' mount() give you?
A: A wrapper around the mounted component that you can query (find/get/text), interact with (trigger), and inspect (emitted) to test behavior.

Q: Why must you await wrapper.trigger('click') before asserting?
A: DOM updates are asynchronous; awaiting the triggered event (or nextTick) ensures the DOM reflects the change before you assert on it.

Q: How do you check that a component emitted an event in a test?
A: With wrapper.emitted('eventName'), which returns the recorded emissions (and their payloads) so you can assert on them.

Q: What does `npm run build` do in a Vite + Vue project like this one?
A: It type-checks with vue-tsc and produces an optimized, minified, tree-shaken, code-split bundle in dist/ — the static files you deploy.

Q: What should component tests focus on?
A: User-visible behavior — rendered output, interactions, and emitted events — rather than internal implementation details, so tests survive refactors.

Q: How does this portal get from source to a live site?
A: A GitHub Actions workflow runs npm run build (vue-tsc + Vite) and publishes the static dist/ to GitHub Pages.

# Exercises

### Easy
Write a Vitest test that mounts a `Hello` component with a `name` prop and asserts the greeting
text.

### Medium
Test a `Counter` component: assert the initial count, `await` a button click, and check both the
updated text and the emitted `change` event.

### Challenging
Capstone: build a small app that uses a `ref`-based model, at least two components communicating via
props/emits, a Vue Router route, and a store (Pinia or a composable). Write component tests for the
key interactions, get `vue-tsc` and the tests passing, run `npm run build`, and deploy the `dist/`
to a static host.

# Further Reading

- [Testing — Vue Guide](https://vuejs.org/guide/scaling-up/testing.html)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [Vite](https://vite.dev/) · [Tooling](https://vuejs.org/guide/scaling-up/tooling.html)
