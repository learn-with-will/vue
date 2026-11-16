---
slug: vitest-setup
title: "Unit Testing with Vitest"
topic: tooling-typescript
kind: tool
summary: "Configure Vitest, the lightning-fast Vite-native test runner for Vue applications."
tags: [vitest, unit-testing, testing, vite]
related: [vue-test-utils-mount, testing-props-and-events, testing-pinia-router]
---
> **In one line:** Vitest is the official, Vite-native unit test runner for modern Vue applications.

## The idea

Testing ensures your application behaves correctly as it evolves and refactors over time. In the Vue 3 ecosystem, the official test runner is **Vitest**.

Vitest is engineered by the Vite and Vue teams to share the exact same configuration, plugins, and transform pipeline as Vite:
- **Instant execution:** Leverages Vite's esbuild transformation for blazing-fast test runs.
- **Jest-compatible API:** Provides `describe`, `it`, `expect`, and mocking utilities.
- **Component support:** Uses the same `@vitejs/plugin-vue` plugin used in production builds.

```flow
config: vitest.config.ts (shares vite.config) @primary
runner: vitest runner @blue
tests: Runs spec tests with Vite pipeline @green
config -> runner
runner -> tests
```

## See it

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom', // Fast DOM implementation for tests
    globals: true
  }
});

// tests/math.spec.ts
import { describe, it, expect } from 'vitest';

describe('math helper', () => {
  it('adds numbers correctly', () => {
    expect(1 + 2).toBe(3);
  });
});
```

Running `npx vitest` executes tests with instant feedback.

## Go deeper

Use `happy-dom` or `jsdom` as the `test.environment` to simulate a browser window and DOM environment in Node.js.

> **Tip:** Vitest has a built-in interactive UI: run `npx vitest --ui` to inspect and debug tests visually in a browser tab.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Ensure @vitejs/plugin-vue is included in vitest plugins so .vue files can be parsed.
- Remember that happy-dom is significantly faster than jsdom for most test suites.

## Remember

- Vitest is the official Vite-native unit testing runner for Vue.
- Shares Vite's plugins and configuration for seamless .vue component testing.
- Provides Jest-compatible APIs (describe, it, expect) with instant speed.
