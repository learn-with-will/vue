---
slug: testing-props-and-events
title: "Testing User Interactions and Events"
topic: tooling-typescript
kind: technique
summary: "Simulate user clicks and verify emitted component events using trigger and wrapper.emitted."
tags: [testing, trigger, emitted, events]
related: [vue-test-utils-mount, vitest-setup, define-emits]
---
> **In one line:** Use await wrapper.trigger('click') and expect(wrapper.emitted()).toHaveProperty('event').

## The idea

A component is more than static markup; it responds to user interaction and notifies parents via events.

Testing user interactions with Vue Test Utils requires two key APIs:
1. **`await wrapper.trigger('eventName')`**: Simulates a user interaction (like `'click'`, `'input'`, or `'keydown'`). Because triggering an event causes Vue to update the DOM asynchronously, you **must await** the trigger call!
2. **`wrapper.emitted()`**: Returns an object recording every custom event emitted by the component, along with all emitted payload arguments.

```tree
Event Testing Workflow
  1. wrapper.find('button').trigger('click')  --> User interaction simulated
  2. await next tick                         --> Vue updates DOM and records emits
  3. expect(wrapper.emitted()).toBe(...)     --> Assert event fired with right payload
```

## See it

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CounterButton from '../components/CounterButton.vue';

describe('CounterButton.vue', () => {
  it('increments count and emits change event', async () => {
    const wrapper = mount(CounterButton);
    const button = wrapper.find('button');

    await button.trigger('click');

    expect(button.text()).toBe('1');
    expect(wrapper.emitted()).toHaveProperty('change');
    expect(wrapper.emitted('change')?.[0]).toEqual([1]);
  });
});
```

The test verifies that clicking the button updates the DOM count and emits `'change'` with payload `[1]`.

## Go deeper

To simulate typing into an input field, use `await input.setValue('new text')`. `setValue` automatically updates the value and triggers both `input` and `change` events.

> **Tip:** You can pass keyboard modifier flags to trigger: `await input.trigger('keydown.enter')`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Forgetting to await trigger() causes assertions to run before Vue updates the DOM.
- emitted() returns an array of arrays: [[arg1, arg2]] for each invocation.

## Remember

- Simulate DOM events using await wrapper.trigger('click').
- Use await input.setValue('text') to test two-way input bindings.
- wrapper.emitted('event') records all emitted events and their payloads.
