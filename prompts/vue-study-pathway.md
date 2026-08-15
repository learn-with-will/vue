# Vue.js Study Pathway

A phase-by-phase map of the 24-lesson course. Each lesson is self-contained and
verified against the official Vue documentation (see `vue-authoring-prompt.md` for the
no-hallucination contract). The course teaches modern Vue 3: the **Composition API**
with **`<script setup>`** single-file components and **TypeScript**.

## Beginner — The Essentials (lessons 1–8)

The reactive fundamentals every Vue app is built on. By the end you can build a small
interactive component from scratch.

1. **Introduction to Vue** — what Vue is, the progressive framework idea, the Options vs
   Composition API, and what a single-file component is.
2. **Creating an Application & Template Syntax** — `createApp`, mounting, text
   interpolation, attribute bindings (`v-bind`), and what a directive is.
3. **Reactivity Fundamentals: `ref()`** — reactive state with `ref` (and `reactive`),
   `.value`, and template auto-unwrapping.
4. **Computed Properties** — cached derived state, computed vs methods, writable computed.
5. **Conditional & List Rendering** — `v-if`/`v-else`/`v-show` and `v-for` with `key`.
6. **Class & Style Bindings** — dynamic classes and styles with object/array syntax.
7. **Event Handling & Form Bindings** — `v-on` (`@`) with modifiers, and `v-model` for
   two-way form input binding.
8. **Lifecycle Hooks & Watchers** — `onMounted` and friends; `watch` vs `watchEffect`.

## Intermediate — Components & Reusability (lessons 9–16)

Real apps are trees of components that talk to each other, plus routing and shared
state. This phase covers everything you need to structure an application.

9. **Components Basics & `<script setup>`** — defining, importing, and using components;
   the anatomy of an SFC.
10. **Props In Depth** — declaring and typing props, validation, and one-way data flow.
11. **Component Events & `v-model`** — `defineEmits`, and two-way binding on components
    with `defineModel`.
12. **Slots** — default, named, and scoped slots for flexible, reusable components.
13. **Provide / Inject** — passing data deep into the tree without prop-drilling.
14. **Composables** — extracting and reusing stateful logic with the Composition API.
15. **Vue Router** — client-side routing: routes, dynamic params, nested routes, and
    navigation guards.
16. **State Management with Pinia** — the official store: state, getters, actions, and
    `storeToRefs`.

## Advanced — Built-ins, Internals & Best Practices (lessons 17–24)

Going deeper: how reactivity really works, the built-in components, performance, and the
tooling that ships a real Vue app.

17. **Template Refs & Composition API in Depth** — accessing DOM/child components,
    `nextTick`, and reactivity utilities (`toRef`, `toRefs`, `unref`).
18. **Reactivity in Depth** — the Proxy system, `shallowRef`/`shallowReactive`,
    `customRef`, and watcher flush timing.
19. **Built-in Components: Teleport & Suspense** — rendering elsewhere in the DOM, and
    coordinating async components (Suspense is experimental).
20. **Transitions & Animations** — `<Transition>` and `<TransitionGroup>`.
21. **Async Components & Performance** — `defineAsyncComponent`, lazy loading, `v-memo`,
    and rendering optimizations.
22. **Custom Directives & Plugins** — reusable low-level DOM behavior and app-wide plugins.
23. **TypeScript with Vue** — typing props, emits, refs, and generic components; `vue-tsc`.
24. **Testing & Tooling — Capstone** — Vitest + Vue Test Utils, the Vite toolchain, and
    building for production. Ties the whole course together.
