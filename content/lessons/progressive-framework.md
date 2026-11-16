---
slug: progressive-framework
title: "The Progressive Framework"
topic: foundations
kind: concept
summary: "Vue scales incrementally from a single script tag embedded in static HTML to a full single-page application with build tools."
tags: [progressive-framework, cdn, spa, build-tools]
related: [what-is-vue, create-app-and-mount, anatomy-of-an-sfc]
---
> **In one line:** Vue is progressive because it adapts to your project scale: from a CDN script tag to a full build-tool SPA.

## The idea

Many frontend frameworks enforce an all-or-nothing architecture. To use them, you must install Node.js, configure complex bundlers, adopt client-side routing, and rewrite your entire backend stack.

Vue takes a different path called the **progressive framework**. You can start using Vue with a single `<script>` tag hosted on a CDN to enhance a static landing page or WordPress site. As your project requirements grow, Vue seamlessly scales with you.

| Architecture | Setup Required | Best For |
|---|---|---|
| Standalone CDN | Single `<script>` tag | Enhancing legacy pages, small widgets |
| SFC with Vite | Node.js + Vite build tool | Single-page apps, rich dashboards |
| Full-Stack SSR | Nuxt framework | SEO-critical apps, enterprise portals |

You never pay an architectural penalty for tools you do not yet need. The core library focuses strictly on the view layer and reactivity, while the official ecosystem provides routing, state management, and tooling that snap in when needed.

## See it

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    <button @click="count++">Count: {{ count }}</button>
  </div>

  <script>
    const { createApp, ref } = Vue;
    createApp({
      setup() {
        const count = ref(0);
        return { count };
      }
    }).mount('#app');
  </script>
</body>
</html>
```

Here Vue runs straight from a CDN script in a browser without any bundler, terminal, or build step.

## Go deeper

When your application expands beyond a few interactive widgets, you graduate to Vite. Vite provides instant server start, hot module replacement, TypeScript checking, and single-file components.

> **Note:** Regardless of whether you use a CDN or Vite, the core reactivity engine and template syntax remain identical.

## Watch out

- Single-File Components (.vue files) require a build step; you cannot run .vue files raw from a CDN script tag.
- Do not prematurely configure complex routing and stores before your app actually demands them.

## Remember

- Vue is progressive: adopt it as a CDN script or as a full build-driven application.
- The core library stays focused on declarative rendering and reactivity.
- The same template syntax and reactivity model work across all deployment scales.
