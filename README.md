# Vue.js Learning Portal

A **frontend-only** Vue 3 course: read Markdown lessons, take quizzes, and track your
progress — all in the browser. No sign-up, no backend. The site itself is built with
Vue, so the app you are learning from is a working example of what it teaches.

## What this is

The portal shell is built with **Vue 3** (Composition API + `<script setup>`), **Vite**,
**TypeScript**, **Vue Router**, **Tailwind CSS v4**, `marked`, and **PrismJS**. It renders
a **24-lesson curriculum** that takes you from reactivity and templates through components,
composables, routing, and state, on to reactivity internals, built-ins, performance, and
testing. Every lesson is written in plain, welcoming English and verified against primary
sources (see **Sources** below).

Progress, bookmarks, and quiz scores live in `localStorage` under `vue-learning-*` keys,
so nothing leaves your machine.

## Run it locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check (vue-tsc) + production build into dist/
npm run preview  # serve the production build
```

## How the content works

The app is **data-driven** — adding a lesson needs no code changes:

1. Write the lesson Markdown in `public/content/<level>/<slug>.md` with YAML front-matter
   (including a `summary`).
2. Add a quiz at `public/quizzes/lesson-NN.json`.
3. Regenerate `public/content/course-manifest.json` from the front-matter (the manifest is
   generated, so it can't drift).

> **Code fences** must declare one of the highlighted languages: `html`, `javascript`/`js`,
> `typescript`/`ts`, `bash`, `json`, `css`, or `text` (Vue templates and single-file
> components use `html`; see `src/core/prism.ts`).

## Curriculum

**Beginner — the essentials:** introduction to Vue · creating an app & template syntax ·
reactivity with `ref` · computed properties · conditional & list rendering · class & style
bindings · event handling & forms · lifecycle hooks & watchers.

**Intermediate — components & reusability:** components & `<script setup>` · props in depth ·
component events & `v-model` · slots · provide / inject · composables · Vue Router · state
management with Pinia.

**Advanced — built-ins, internals & best practices:** template refs & Composition API in
depth · reactivity in depth · Teleport & Suspense · transitions · async components &
performance · custom directives & plugins · TypeScript with Vue · testing & tooling.

## Accuracy: no hallucination

Every API, option, default, and behavior is verified against primary sources. The
per-lesson authoring contract lives in `prompts/vue-authoring-prompt.md`, and the
phase-by-phase overview in `prompts/vue-study-pathway.md`.

**Sources:**

- **Official Vue.js documentation** — <https://vuejs.org/guide/> (Guide) and
  <https://vuejs.org/api/> (API reference) — the primary anchor for how Vue works.
- **Vue SFC / `<script setup>` spec** — <https://vuejs.org/api/sfc-spec.html>.
- **Vue Router** — <https://router.vuejs.org> — for client-side routing.
- **Pinia** — <https://pinia.vuejs.org> — for state management.
- **Vitest** — <https://vitest.dev> — and **Vue Test Utils** —
  <https://test-utils.vuejs.org> — for testing.
- **Vite** — <https://vite.dev> — for the build tooling.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`BASE_PATH=/<repo>/` and publishes `dist/` to GitHub Pages.

---

Vue 3 · Vite · TypeScript · Vue Router · Tailwind CSS v4 · marked · PrismJS · localStorage.
