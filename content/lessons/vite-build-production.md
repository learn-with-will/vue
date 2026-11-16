---
slug: vite-build-production
title: "Building for Production with Vite"
topic: tooling-typescript
kind: tool
summary: "Build, bundle, minify, and preview production-ready Vue applications using Vite."
tags: [vite, production, bundling, deployment]
related: [route-level-code-splitting, type-checking-vue-tsc, history-modes]
---
> **In one line:** vite build compiles, bundles, and minifies your Vue app into optimized static files.

## The idea

When development is complete, your application must be compiled and packaged into optimized static assets (HTML, CSS, JavaScript) ready to be deployed to static hosts like GitHub Pages, Vercel, Netlify, or AWS S3.

In Vue 3, this is powered by **Vite** (`vite build`).

During production build:
1. **Rollup bundling:** Vite bundles your Single-File Components, TypeScript, and dependencies into highly optimized, content-hashed files (e.g. `index-C8s2k1.js`).
2. **Tree shaking:** Unused exports from Vue, Pinia, and third-party packages are automatically eliminated.
3. **CSS inlining and minification:** Scoped styles are extracted into minified CSS bundles.

```flow
src: Source code (.vue, .ts, .css) @primary
vite: vite build (Rollup + esbuild) @blue
dist: dist/ folder (index.html, assets/*.js, assets/*.css) @green
src -> vite: build command
vite -> dist: optimized static production bundle
```

## See it

```json
// package.json scripts:
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  }
}
```

In your terminal:
1. Run `npm run build`: Validates types and builds the `dist/` folder.
2. Run `npm run preview`: Boots a local static web server to test the real production build before deploying!

```text
vite v6.0.0 building for production...
transforming...
✓ 45 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.28 kB
dist/assets/index-D1a2B3.css      1.20 kB │ gzip:  0.60 kB
dist/assets/index-C8s2k1.js      52.40 kB │ gzip: 18.20 kB
✓ built in 240ms
```

The output in `dist/` is 100% static and ready to deploy anywhere.

## Go deeper

If deploying to GitHub Pages under a subpath (e.g. `https://user.github.io/repo-name/`), set `base: '/repo-name/'` in your `vite.config.ts`.

> **Tip:** Always run `npm run preview` locally to verify routing, base paths, and production assets before pushing to GitHub.

**Architectural best practices in production:**

In enterprise codebases, clear separation of concerns accelerates team velocity and simplifies automated testing. When every component and module maintains an explicit contract—documenting its props, emitted events, and reactive dependencies—refactoring complex workflows becomes safe and predictable. Always favor declarative patterns over imperative DOM mutations, and structure data flow so parent components remain the single source of truth for downstream state. Combining these fundamentals with automated unit testing ensures applications scale reliably over years of active development.

## Watch out

- Missing base configuration in vite.config.ts causes 404 errors on asset URLs on GitHub Pages.
- Remember that development environment variables (.env.development) are not included in production builds.

## Remember

- vite build compiles, minifies, and tree-shakes your Vue application.
- Outputs static assets to the dist/ directory ready for CDN deployment.
- Use vite preview to inspect the exact production build locally.
