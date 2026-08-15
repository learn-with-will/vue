# Vue.js Learning Course — Implementation Plan

## Context

The `learning-portal` repo is a family of standalone course micro-apps (Angular, React,
RxJS, Node.js, Python, Algorithms, PostgreSQL, TypeScript, Docker, System Design, Git &
GitHub — 11 live). Each course is its own top-level folder + its own GitHub repo, published
to `https://thachthanhthien.github.io/<course>/`, and surfaced as a card on the portal
landing page (`index.html`).

This plan adds a **12th course: Vue.js**. Per the maintainer's decision, the course app is
**built in Vue 3 itself (dogfooded)** — a Vue course served by a real Vue app, mirroring how
the Angular course is built in Angular. This is more coherent than cloning the React shell and
showcases exactly what it teaches.

**Hard requirements (from the request):**
- Refer to the existing courses (Angular/React) for structure and feature parity.
- Publish to GitHub Pages when done.
- **No hallucination** — every fact verified against primary, trustworthy sources.
- **Language suitable for everyone** — plain, welcoming English; every term defined.

**Intended outcome:** a 24-lesson Vue 3 course (beginner → advanced), each lesson with a quiz,
progress tracking, dark mode, and search — live at `https://thachthanhthien.github.io/vue/` and
linked from the portal.

---

## Tech Stack (verified current as of 2026-08-14)

| Layer | Choice | Notes |
| ----- | ------ | ----- |
| Framework | **Vue 3.5.x** (latest stable) | 3.6 is in RC (Vapor Mode) — taught as "on the horizon", not core. Verify exact minor at build time. |
| Build | **Vite 6** + `@vitejs/plugin-vue` | Same Vite the React shell uses; swap the React plugin for the Vue plugin. |
| Language | **TypeScript** + `<script setup>` SFCs | Type-check with **`vue-tsc`** (replaces `tsc -b`). |
| Routing | **Vue Router** (v5.x latest; API compatible with v4) | `createRouter` + `createWebHistory(import.meta.env.BASE_URL)`. Verify against router.vuejs.org. |
| State | **Pinia 4.x** | Dogfoods the state-management lesson; holds progress + theme + course stores. |
| Styling | **Tailwind CSS v4** + `@tailwindcss/vite` | Identical to the shell; reuse tokens/theme. |
| Content | **`marked`** (Markdown) + **PrismJS** (highlight) | Reused as-is. |
| Hosting | **GitHub Pages** via Actions workflow | Reused `deploy.yml`, `copy-404.mjs`. |

Primary source anchors for the stack: [Vue releases](https://vuejs.org/about/releases),
[Vue Router](https://github.com/vuejs/router/releases), [Pinia](https://github.com/vuejs/pinia/releases).

---

## Reuse map — what carries over vs. what is rewritten

Cloning from the newest shell (`git-github/`) as the starting point.

### Reuse as-is (framework-agnostic — plain TS / config)
- `src/core/services/lessonService.ts` — fetch lesson `.md`, strip YAML front-matter, build TOC.
- `src/core/services/asset.ts` — `assetUrl()` prefixing `import.meta.env.BASE_URL`.
- `src/core/services/quizService.ts`, `src/core/services/search.ts`.
- `src/core/models/lesson.ts`, `quiz.ts`, `progress.ts` — only change: rename
  `PROGRESS_STORAGE_KEY` → `vue-learning-progress`.
- `src/core/prism.ts` — reuse; adjust the imported Prism language set for Vue (below).
- `scripts/copy-404.mjs` — reuse verbatim (SPA 404 fallback; update the code comment).
- `.github/workflows/deploy.yml` — reuse verbatim (Node 20 → `npm ci` → `npm run build` with
  `BASE_PATH=/vue/` derived from repo name → upload `dist`).

### Rewrite as Vue (React view layer → Vue SFCs / stores)
- `src/core/context/ThemeContext.tsx` → **`src/core/stores/theme.ts`** (Pinia). Logic ports 1:1:
  read `vue-learning-theme` from `localStorage`, fall back to `prefers-color-scheme`, toggle
  `.dark` on `<html>`, persist on change.
- `src/core/context/ProgressContext.tsx` → **`src/core/stores/progress.ts`** (Pinia): complete/
  bookmark lessons, record quiz results, `lastOpenedLesson`, persist to `localStorage`.
- `src/core/context/CourseContext.tsx` → **`src/core/stores/course.ts`** (Pinia): load the
  manifest once, expose lessons by level/slug.
- `src/main.tsx` → **`src/main.ts`**: `createApp(App).use(router).use(pinia).mount('#app')`;
  import Prism + global CSS.
- `src/App.tsx` → **`src/App.vue`**: layout shell (Navbar / `<RouterView>` / Footer).
- `src/shared/components/*.tsx` (≈11) → **`.vue`**: `Navbar`, `Footer`, `Sidebar`,
  `LessonContent`, `LessonCard`, `TableOfContents`, `LessonNavigation`, `QuizQuestion`,
  `QuizProgress`, `QuizResult`, plus a new **`VueLogo.vue`** (official Vue mark).
  `ScrollManager.tsx` is dropped — replaced by Vue Router `scrollBehavior`.
- `src/features/**/*.tsx` (7) → **`.vue`**: `Home`, `Roadmap`, `LessonPage`, `QuizPage`,
  `Dashboard`, `Bookmarks`, `SearchPage`.
- `src/App.routes` → **`src/router/index.ts`**: same routes (`/`, `/roadmap`, `/dashboard`,
  `/bookmarks`, `/search`, `/lesson/:slug`, `/lesson/:slug/quiz`) via Vue Router; lazy-load
  page components.
- `vite.config.ts` — keep the `base: process.env.BASE_PATH || '/'` logic verbatim; swap
  `@vitejs/plugin-react` → `@vitejs/plugin-vue`.
- `index.html` — keep the pre-paint theme script; point the module script at `/src/main.ts`;
  root node `<div id="app">`.
- `tsconfig*.json` + `package.json` — Vue/vue-tsc flavored; `build` = `vue-tsc -b && vite build`,
  keep `postbuild` copy-404.

**Prism languages for Vue content** (import in `prism.ts`): `markup` (HTML templates),
`javascript`, `typescript`, `bash`, `json`, `css`. Allowed lesson code-fence languages:
`vue` → rendered as `html`/`markup`, plus `html`, `javascript`/`js`, `typescript`/`ts`,
`bash`, `json`, `css`, `text`.

---

## Content — the no-hallucination contract

A course-specific authoring prompt lives at **`prompts/vue-authoring-prompt.md`** (modeled on
`git-github/prompts/git-github-authoring-prompt.md`), plus **`prompts/vue-study-pathway.md`**.
Core rules:

- **Truth above all.** Every API, option, default, and behavior must be verifiable in a primary
  source. If unsure, leave it out. Present genuine "it depends" cases (Options vs Composition
  API, `ref` vs `reactive`, watch vs watchEffect) as **trade-offs**, not facts.
- **Language for everyone.** Plain English; define every term (reactivity, ref, reactive,
  directive, SFC, composable, provide/inject) on first use; concrete before abstract.

**Authoritative sources (verify every claim):**
- **Official Vue.js docs** — https://vuejs.org/guide/ and API https://vuejs.org/api/ (primary anchor).
- **Vue SFC spec** — https://vuejs.org/api/sfc-spec.html.
- **Vue Router** — https://router.vuejs.org.
- **Pinia** — https://pinia.vuejs.org.
- **Vitest** — https://vitest.dev and **Vue Test Utils** — https://test-utils.vuejs.org (testing lesson).
- **Vite** — https://vite.dev (tooling lesson).

**High-risk claims to nail (the usual myths):**
- Vue is a **progressive framework** — adoptable incrementally (CDN `<script>` → full SPA/SSR).
- **Options API and Composition API are BOTH first-class**; Options API is *not* deprecated.
  `<script setup>` is the recommended sugar for the Composition API in SFCs.
- **`ref()` vs `reactive()`**: `ref` wraps any value, accessed via `.value` in JS and
  auto-unwrapped in templates; `reactive()` only works on objects, cannot be destructured or
  reassigned without losing reactivity (use `toRefs`). Default to `ref`.
- Vue 3 reactivity is **Proxy-based**; the returned proxy ≠ the original object (identity caveat).
- **`computed` is cached** by reactive dependencies; getters must be side-effect-free; writable
  via `get`/`set`.
- **`watch` vs `watchEffect`**: `watch` is lazy with explicit sources; `watchEffect` runs
  immediately and auto-tracks. Flush timing: `'pre'` (default) / `'post'` / `'sync'`.
- **Props are one-way and read-only** — never mutate a prop; communicate up via emits/`v-model`.
- **`v-model` on components** uses the **`defineModel()`** macro (stable since Vue **3.4**);
  it desugars to `modelValue` + `update:modelValue`.
- **`v-for` needs a `key`**; do **not** put `v-if` and `v-for` on the same element (`v-if` has
  higher precedence in Vue 3).
- **Lifecycle hook names**: Composition API `onMounted`/`onUnmounted`/… vs Options API
  `mounted`/`unmounted`/….
- **`<style scoped>`** attribute-scopes CSS to the component; `:deep()` targets children.
- **Pinia is the official state library** (Vuex is in maintenance) — `defineStore` with
  state/getters/actions.
- **Vapor Mode** is a Vue **3.6 (RC)** compilation strategy — mention as forthcoming; do **not**
  teach it as current stable behavior.

---

## Proposed curriculum (24 lessons, 8 / 8 / 8)

Aligned to the official Vue docs learning path (Essentials → Components in-depth → Reusability →
Built-ins → Scaling Up → Best Practices). Finalized per-lesson against vuejs.org during authoring.

**Beginner — Essentials (8)**
1. Introduction to Vue — progressive framework, Options vs Composition API, SFC overview, ways to use Vue
2. Creating an Application & Template Syntax — `createApp`, mounting; interpolation, `v-bind`, directives
3. Reactivity Fundamentals — `ref()` (and `reactive()`, `.value`, which to use)
4. Computed Properties — caching, vs methods, writable computed
5. Conditional & List Rendering — `v-if`/`v-else`/`v-show`; `v-for` + `key`; precedence pitfalls
6. Class & Style Bindings — object/array syntax, dynamic bindings
7. Event Handling & Form Bindings — `v-on` + modifiers; `v-model` + `.lazy`/`.number`/`.trim`
8. Lifecycle Hooks & Watchers — `onMounted` &c.; `watch` vs `watchEffect`

**Intermediate — Components, Reusability & Scaling (8)**
9. Components Basics & the SFC with `<script setup>`
10. Props In Depth — declaration, TS typing, validation, one-way read-only flow
11. Component Events & `v-model` on Components — `defineEmits`, `defineModel`
12. Slots — default, named, and scoped slots; fallback content
13. Provide / Inject — dependency injection, injection keys, reactivity
14. Composables — reusable stateful logic; conventions; vs mixins
15. Vue Router — routes, dynamic params, nested routes, navigation guards, lazy routes
16. Pinia — `defineStore`, state/getters/actions, using stores, persistence

**Advanced — Built-ins, Internals & Best Practices (8)**
17. Template Refs & Composition API in depth — `useTemplateRef`, `expose`, `nextTick`, `toRef`/`toRefs`
18. Reactivity in Depth — Proxy system, `shallowRef`/`shallowReactive`, `customRef`, flush timing, caveats
19. Built-in Components: Teleport & Suspense — async `setup`, loading/error states
20. Transitions & Animations — `<Transition>`, `<TransitionGroup>`, JS hooks
21. KeepAlive, Async Components & Performance — `defineAsyncComponent`, lazy loading, `v-memo`, big-list tips
22. Custom Directives & Plugins — directive hooks; `app.use()` plugins
23. TypeScript with Vue — typing props/emits/refs, generic components, `vue-tsc`
24. Testing & Tooling — Capstone — Vitest + Vue Test Utils; build & deploy; ties it all together

Each lesson: YAML front-matter (`id`, `slug`, `title`, `level`, `order`, `duration`, `summary`,
`tags`) + body sections (Learning Objectives → Why It Matters → Concept Explanation → Key
Terminology → Options & Trade-offs table → Worked Example → Real World Analogy → Examples →
Common Mistakes → Best Practices → Summary → Flash Cards → Exercises → Further Reading). Each ships
a quiz JSON with the 5 supported types (single-choice, multiple-choice, fill-blank, ordering,
match-pair). Manifest `public/content/course-manifest.json` is **generated from front-matter**.

---

## Branding & portal card

- **Theme color `#42b883`** (Vue green), secondary slate `#35495e`; gradient green→slate.
- **`VueLogo.vue`** = the official Vue triangle mark (simple-icons `vuedotjs` path); `favicon.svg`
  matches; portal `LOGOS['vue']` uses the same path (currentColor, white on cover).
- Storage keys: `vue-learning-progress` / `vue-learning-theme` (avoids the shared-origin
  `localStorage` collision — all courses share `thachthanhthien.github.io`).
- Portal `index.html` gets a new `COURSES` entry + `LOGOS` entry:
  ```js
  {
    id: 'vue', title: 'Vue.js',
    description: 'Learn Vue 3 from reactivity, templates, and components to composables, Vue Router, Pinia, and testing — 24 doc-verified lessons, each with a quiz.',
    url: 'https://thachthanhthien.github.io/vue/',
    difficulty: 'Beginner', category: 'Frontend',
    tags: ['Frontend', 'JavaScript', 'Reactivity', 'Components', 'State Management', 'Routing'],
    technologies: ['Vue 3', 'TypeScript', 'Vite', 'Pinia'],
    themeColor: '#42b883', icon: 'Vue',
    estimatedHours: 38, topics: 24, isNew: true, isFeatured: true,
  }
  ```

---

## Deployment

Same model as every course (no `gh` CLI — use the cached git token + GitHub REST API; never print
the token):
1. `git init` in `vue/`, its own repo → create `ThachThanhThien/vue` via `POST /user/repos`.
2. Enable Pages on the Actions source → `POST /repos/ThachThanhThien/vue/pages -d '{"build_type":"workflow"}'`.
3. `git push` → the `deploy.yml` workflow builds with `BASE_PATH=/vue/` and deploys `dist`.
4. Add the card to the portal `index.html` (`COURSES` + `LOGOS`) and push to `LearningPortal` `main`
   (legacy Pages, tracks only `index.html`).

**Windows note:** build locally via PowerShell `\$env:BASE_PATH='/vue/'; npm run build` (or
`MSYS_NO_PATHCONV=1`) to avoid Git-Bash mangling the base path; CI is unaffected.

---

## Verification

1. **Content validator** (scratchpad `validate.mjs`, adapted from the family): 24 lessons ↔ 24
   quizzes ↔ manifest; quiz schema per type; code-fence langs ∈ allowed set; ≥5 flash cards each;
   front-matter ↔ folder/filename/id/order; `order` 1..24 contiguous. Must report **0 errors**.
2. **Type-check**: `npm run lint` (`vue-tsc -b --noEmit`) clean.
3. **Build**: `npm run build` green; `dist/` has 24 `.md` + 24 quiz `.json` + `404.html` fallback.
4. **Local smoke** (`npm run preview` with base `/vue/`): home renders, roadmap lists 24 lessons,
   a lesson renders Markdown + highlighted code + TOC, a quiz runs and scores, progress persists
   across reload, dark-mode toggle persists, search works, deep-link refresh (`/vue/lesson/...`)
   recovers via the 404 fallback.
5. **Live smoke** after deploy: `/vue/` → 200; `/vue/content/course-manifest.json` → 200 JSON with
   24 ordered lessons; a lesson `.md` and a quiz `.json` → 200; `favicon.svg` → 200; unknown path →
   SPA fallback.
6. **Dogfooding sanity**: confirm the app is genuinely Vue (Vue devtools detect the app; `dist`
   ships the Vue runtime), so the Vue course is served by a Vue app.

---

## Effort & risk

- **Reused** (services, models, prism, deploy, 404 script, Tailwind tokens) → near-zero risk.
- **New work** = the Vue view layer (~11 components + 7 pages as SFCs, 3 Pinia stores, router,
  entry, config) + **24 lessons & 24 quizzes** authored under the no-hallucination contract. The
  content is the bulk of the effort; the ported components are small presentational pieces.
- **Main risk** is content accuracy — mitigated by the authoring contract + validator + per-lesson
  verification against vuejs.org. Vue Router 5 API is v4-compatible for our use; confirm at build
  time.
