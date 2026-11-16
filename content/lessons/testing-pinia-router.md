---
slug: testing-pinia-router
title: "Testing Pinia and Vue Router in Components"
topic: tooling-typescript
kind: technique
summary: "Test components that depend on Pinia stores and Vue Router using createTestingPinia and mock routers."
tags: [testing, pinia, vue-router, mocking]
related: [vue-test-utils-mount, pinia-setup, router-setup]
---
> **In one line:** Use createTestingPinia() and router plugins to test components with global dependencies.

## The idea

Real-world components rarely live in a vacuum: they read state from Pinia stores and navigate with Vue Router.

When testing these components in isolation, you must provide test instances of these dependencies to prevent `"Cannot find inject"` errors:

1. **For Pinia:**
   Use **`createTestingPinia()`** from `@pinia/testing`. It automatically stubs all actions (preventing real API calls) and allows you to supply mock initial state.
2. **For Vue Router:**
   Pass the router in the `global.plugins` array of `mount()`, or mock `useRoute` and `useRouter` using Vitest `vi.mock()`.

```tree
Test Environment Setup
  mount(UserProfile, {
    global: {
      plugins: [
        createTestingPinia({ initialState: { user: { name: 'Ada' } } }),
        router
      ]
    }
  })
```

## See it

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import UserDashboard from '../components/UserDashboard.vue';
import { useUserStore } from '../stores/user';

describe('UserDashboard.vue', () => {
  it('displays user name from Pinia store', () => {
    const wrapper = mount(UserDashboard, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: { user: { name: 'Ada Lovelace' } }
          })
        ]
      }
    });

    const store = useUserStore();
    expect(wrapper.find('.name').text()).toBe('Ada Lovelace');
    wrapper.find('button').trigger('click');
    expect(store.fetchUser).toHaveBeenCalled();
  });
});
```

The component renders with mock store data, and action calls can be asserted directly with `toHaveBeenCalled()`.

## Go deeper

Setting `stubActions: false` in `createTestingPinia()` allows actions to execute their actual code if you want full integration testing.

> **Tip:** For router testing, create a mock router using `createRouter({ history: createWebHistory(), routes: [...] })`.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Do not use your real production Pinia instance in unit tests; tests could pollute each other's state.
- Always reset mock history between tests using beforeEach(() => vi.clearAllMocks()).

## Remember

- Use createTestingPinia() from @pinia/testing for isolated store tests.
- Actions are automatically mocked with Vitest spies by default.
- Provide dependencies in mount() using the global.plugins option array.
