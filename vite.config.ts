import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves project sites under /<repo>/, so the production build needs
// a matching base path. CI sets BASE_PATH (e.g. "/vue/"); local dev and build
// default to "/". Everything that fetches assets goes through import.meta.env.BASE_URL
// (see src/core/services/asset.ts) and the router uses createWebHistory(BASE_URL),
// so setting base here is enough.
// `process` is provided by Node when Vite evaluates this config; declare it minimally
// so the file type-checks without adding @types/node to the project.
declare const process: { env: Record<string, string | undefined> };

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [vue(), tailwindcss()],
});
