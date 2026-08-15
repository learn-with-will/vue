// Prism core + the languages the Vue lessons use. Vue markup (templates and the
// `<template>`/`<script>`/`<style>` blocks of a single-file component) is shown in
// `html` fences, which Prism's built-in `markup` grammar highlights. `css` and
// `javascript` ship in Prism core; we add `typescript` (the course is written in
// TS), `bash` (CLI: npm / vite commands), and `json` (config, package.json).
// The `text` fence is left unhighlighted for diagrams and plain output.
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;
