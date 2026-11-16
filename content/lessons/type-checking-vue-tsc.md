---
slug: type-checking-vue-tsc
title: "Command-Line Type Checking with vue-tsc"
topic: tooling-typescript
kind: tool
summary: "Type-check .vue files in CI/CD build pipelines using the vue-tsc command-line compiler."
tags: [vue-tsc, type-checking, ci-cd, build]
related: [typescript-sfc-setup, vite-build-production, vitest-setup]
---
> **In one line:** vue-tsc verifies TypeScript types across .vue files and templates on the command line.

## The idea

The standard TypeScript compiler (`tsc`) only knows how to parse `.ts` and `.tsx` files. If you run `tsc` on a Vue project, it cannot parse `.vue` Single-File Components or check expressions inside `<template>` blocks.

To type-check Vue applications on the command line and in Continuous Integration (CI/CD) pipelines, the Vue team created **`vue-tsc`**.

`vue-tsc` is a thin wrapper around `tsc` that:
1. Understands Single-File Component `.vue` file structures.
2. Type-checks template expressions, props, and emits against TypeScript interfaces.
3. Produces standard compiler errors with exact file and line numbers.

```tree
CI/CD Type Checking Pipeline
  GitHub Actions runner
    run vue-tsc --noEmit
      validates all TypeScript files
      validates all Vue templates and script setups
```

## See it

```json
// package.json scripts:
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "type-check": "vue-tsc --noEmit"
  }
}
```

Running `npm run type-check` in your terminal runs `vue-tsc`.

If a component passes a string to a prop expecting a number:

```text
src/App.vue:14:18 - error TS2322: Type 'string' is not assignable to type 'number'.
14     <ProductCard :price="'ninety'" />
                    ~~~~~
```

`vue-tsc` catches the error before code is deployed.

## Go deeper

`vue-tsc --declaration` can also generate `.d.ts` declaration files for Vue components, allowing you to publish fully-typed component libraries to npm.

> **Tip:** Vite does not type-check during dev for maximum speed; run `vue-tsc --watch` in a secondary terminal for live diagnostics.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Vite build alone does not perform type checking; always run vue-tsc --noEmit before vite build.
- Ensure your tsconfig.json includes .vue files in its "include" array.

## Remember

- vue-tsc performs command-line TypeScript checking on .vue files and templates.
- Essential step in package.json build scripts and CI/CD pipelines.
- Catches template type mismatches that standard tsc cannot detect.
