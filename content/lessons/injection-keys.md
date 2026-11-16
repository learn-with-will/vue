---
slug: injection-keys
title: "Type-Safe Injection with Symbols"
topic: slots-provide
kind: technique
summary: "Use TypeScript InjectionKey and ES Symbols to prevent name collisions and guarantee injected types."
tags: [injectionkey, symbols, typescript, type-safety]
related: [provide-and-inject, reactive-provide, app-provide]
---
> **In one line:** Use InjectionKey<T> with ES Symbols for type-safe provide and inject without key collisions.

## The idea

When using plain strings as injection keys (like `provide('user', data)`), two problems inevitably arise in production codebases:
1. **Key collisions:** Two independent plugins or components might both choose the key `'user'`, accidentally overwriting each other.
2. **Missing type safety:** `inject('user')` returns `unknown`, requiring manual type casting in every consumer.

Vue and TypeScript solve both problems using **`InjectionKey<T>`** paired with **ES Symbols**.

`InjectionKey` is a generic interface that extends `Symbol`. It binds the unique runtime identity of a Symbol with the compile-time TypeScript type of the injected value:

```typescript
import type { InjectionKey, Ref } from 'vue';

export interface UserContext {
  username: Ref<string>;
  logout: () => void;
}

// Unique Symbol bound to UserContext type
export const UserContextKey: InjectionKey<UserContext> = Symbol('UserContext');
```

When you `provide(UserContextKey, value)`, TypeScript verifies that `value` satisfies `UserContext`. When you `inject(UserContextKey)`, TypeScript automatically infers the return type as `UserContext | undefined`!

## See it

```typescript
// 1. context.ts - define Symbol key
import type { InjectionKey, Ref } from 'vue';

export interface ThemeContext {
  theme: Ref<string>;
  setTheme: (t: string) => void;
}

export const ThemeKey: InjectionKey<ThemeContext> = Symbol('ThemeKey');
```

In the Provider and Consumer:

```typescript
// Provider.vue
import { ref, provide } from 'vue';
import { ThemeKey } from './context';

const theme = ref('dark');
provide(ThemeKey, { theme, setTheme: (t: string) => { theme.value = t; } });

// Consumer.vue (injects typed ThemeContext | undefined automatically!)
import { inject } from 'vue';
const themeContext = inject(ThemeKey);
```

Full compile-time autocompletion and type checking work out of the box with zero type casts.

## Go deeper

If you want to guarantee that `inject` never returns `undefined`, throw an error if the context is missing, or provide a default value.

> **Tip:** Keep shared `InjectionKey` definitions in a centralized `context.ts` or `keys.ts` file so both providers and consumers can import them.

## Watch out

- Do not call Symbol() in both files separately; you must export and import the exact same Symbol instance.
- Without a fallback or non-null assertion, TypeScript correctly infers T | undefined for inject().

## Remember

- InjectionKey<T> binds an ES Symbol to a TypeScript interface.
- Eliminates string key collisions between components and libraries.
- Provides automatic type inference and compile-time checking for inject().
