---
slug: vue-test-utils-mount
title: "Mounting Components with Vue Test Utils"
topic: tooling-typescript
kind: tool
summary: "Mount components in tests and inspect rendered DOM output with Vue Test Utils."
tags: [vue-test-utils, mount, testing, dom]
related: [vitest-setup, testing-props-and-events, testing-pinia-router]
---
> **In one line:** mount() from @vue/test-utils renders a component into a test DOM wrapper for assertion.

## The idea

To test a Vue component, you must render it in a simulated browser environment and assert on its rendered output. The official library for component testing in Vue is **Vue Test Utils** (`@vue/test-utils`).

The primary function is **`mount()`**:

```typescript
import { mount } from '@vue/test-utils';
import Greeting from './Greeting.vue';

const wrapper = mount(Greeting);
```

`mount()` renders the component and returns a **wrapper object**. The wrapper provides intuitive inspection and assertion methods:
- **`wrapper.text()`**: Returns the text content of the component.
- **`wrapper.html()`**: Returns the full rendered HTML markup.
- **`wrapper.find('selector')`**: Finds a DOM element matching a CSS selector.
- **`wrapper.exists()`**: Returns whether an element was found.

## See it

```typescript
// components/Greeting.vue
// <template><h1>Hello, {{ name }}!</h1></template>
// <script setup>defineProps({ name: String })</script>

// tests/Greeting.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Greeting from '../components/Greeting.vue';

describe('Greeting.vue', () => {
  it('renders greeting with prop name', () => {
    // Mount with propsData
    const wrapper = mount(Greeting, {
      props: {
        name: 'Ada'
      }
    });

    // Assert that the h1 contains the rendered greeting
    expect(wrapper.find('h1').text()).toBe('Hello, Ada!');
  });
});
```

The test mounts `Greeting` with a prop and asserts on the rendered `<h1>` tag.

## Go deeper

Use `wrapper.findAll('li')` to get an array of matching wrappers when asserting on list items.

> **Tip:** Use `mount` for full rendering; for shallow rendering that stubs out child components, use `shallowMount`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Always clean up wrappers if running hundreds of heavy tests to conserve memory.
- Do not test private implementation details; test user-visible output and emitted events.

## Remember

- mount(Component, options) renders a component into a test wrapper.
- Use wrapper.find() and wrapper.text() to inspect rendered DOM.
- Pass props, slots, and plugins in the mount options object.
