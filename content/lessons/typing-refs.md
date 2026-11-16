---
slug: typing-refs
title: "Typing Refs and Reactive State"
topic: tooling-typescript
kind: technique
summary: "Type refs using generic type arguments and handle nullable template ref types accurately."
tags: [refs, typescript, types, generics]
related: [typescript-sfc-setup, ref-primitive, template-refs-dom]
---
> **In one line:** Type refs with generics: ref<Type>(initialValue) or useTemplateRef<ElementType>('name').

## The idea

By default, Vue infers the type of a `ref` from its initial value: `ref(0)` is inferred as `Ref<number>`.

However, you frequently need explicit typing when:
1. The initial value is `null` or `undefined` before data is loaded: `ref<User | null>(null)`.
2. The initial value is an empty array that will later hold complex objects: `ref<Item[]>([])`.
3. Typing template refs to native HTML elements: `useTemplateRef<HTMLInputElement>('inputRef')`.

Passing the generic type parameter guarantees full autocompletion when reading `.value`.

## See it

```typescript
import { ref, reactive, useTemplateRef } from 'vue';

interface Article {
  id: string;
  title: string;
  tags: string[];
}

// 1. Ref with nullable union type:
const currentArticle = ref<Article | null>(null);

// 2. Ref with array type:
const articlesList = ref<Article[]>([]);

// 3. Reactive object with explicit interface:
const formState: { name: string; age?: number } = reactive({
  name: 'Ada'
});

// 4. Template ref with native DOM element type:
const modalElement = useTemplateRef<HTMLDivElement>('modalElement');
```

TypeScript enforces that `currentArticle.value` must either be an `Article` or `null`, preventing runtime undefined property crashes.

## Go deeper

When accessing properties on a ref typed as `User | null`, TypeScript will enforce optional chaining: `currentArticle.value?.title`.

> **Tip:** You can use `shallowRef<T>()` with the same generic type syntax.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- ref([]) without a generic type is inferred as Ref<never[]>; always pass ref<Item[]>([]).
- Template refs can always be null before mounting; never omit optional chaining on template refs.

## Remember

- Pass generic type arguments: ref<Type>(initialValue).
- Use ref<T | null>(null) for async data populated after mount.
- Type template refs with native element types (e.g. HTMLInputElement).
