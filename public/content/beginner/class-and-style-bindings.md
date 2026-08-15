---
id: lesson-06
slug: class-and-style-bindings
title: "Class & Style Bindings"
level: beginner
order: 6
duration: 15
summary: "Bind CSS classes and inline styles dynamically with :class and :style using object and array syntax, and see how dynamic classes merge with static ones."
tags:
  - class-binding
  - style-binding
  - v-bind
  - css
---

# Learning Objectives

By the end of this lesson you will be able to:

- Toggle classes with the object and array syntax of `:class`.
- Combine static and dynamic classes on one element.
- Bind inline styles with `:style` using object and array syntax.
- Know that Vue auto-prefixes styles that need vendor prefixes.

# Why It Matters

Styling that reacts to state — a highlighted active tab, a red error field, a progress bar
whose width follows a number — is everywhere. Because `class` and `style` are just
attributes, you *could* build strings by hand, but that's error-prone. Vue gives `:class`
and `:style` special powers (object and array forms) that make conditional styling clean and
declarative.

# Concept Explanation

### Binding classes — object syntax

Pass an object to `:class`; each key is a class name, included when its value is truthy:

```html
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
```

Here `active` is applied when `isActive` is truthy, and `text-danger` when `hasError` is.
(Quote class names that aren't valid identifiers, like `text-danger`.)

Dynamic classes **merge** with a static `class` attribute — you can use both together:

```html
<div class="card" :class="{ selected: isSelected }"></div>
```

### Binding classes — array syntax

Pass an array of class names (from variables) to apply several at once:

```html
<div :class="[baseClass, isActive ? activeClass : '']"></div>
```

You can nest an object inside the array for conditional entries:

```html
<div :class="[baseClass, { active: isActive }]"></div>
```

### Binding inline styles — object syntax

`:style` takes an object of CSS properties. Use camelCase (`fontSize`) or quoted kebab-case
(`'font-size'`):

```html
<p :style="{ color: activeColor, fontSize: size + 'px' }">Hello</p>
```

Values are expressions, so you can compute them (e.g. concatenate a unit like `'px'`).

### Array of style objects, and auto-prefixing

`:style` also accepts an array of style objects, which Vue merges:

```html
<p :style="[baseStyles, overrideStyles]"></p>
```

When a CSS property needs vendor prefixes for older browsers, Vue **automatically adds** the
appropriate prefixes at runtime, so you write the standard property name.

# Key Terminology

- **`:class` object syntax** — `{ className: booleanExpression }` toggles classes.
- **`:class` array syntax** — `[a, b]` applies a list of class names.
- **`:style` object syntax** — `{ cssProp: value }` sets inline styles.
- **Auto-prefixing** — Vue adds vendor prefixes for properties that require them.

# Options and Trade-offs

| Option | Best for | Example |
| ------ | -------- | ------- |
| `:class` object | Toggling classes by boolean state | `{ active: isActive }` |
| `:class` array | Applying several dynamic class names | `[base, theme]` |
| `:style` object | A few reactive inline styles | `{ width: pct + '%' }` |
| Prefer a CSS class over `:style` | Anything reusable or themable | Add `.active { … }` and toggle it |

# Worked Example

A progress bar whose width and color follow a number:

```html
<script setup lang="ts">
import { ref, computed } from 'vue'

const percent = ref(35)
const barColor = computed(() => (percent.value < 50 ? 'crimson' : 'seagreen'))
</script>

<template>
  <div class="track">
    <div
      class="fill"
      :class="{ complete: percent === 100 }"
      :style="{ width: percent + '%', backgroundColor: barColor }"
    ></div>
  </div>
  <input type="range" v-model.number="percent" min="0" max="100" />
</template>

<style scoped>
.track { background: #eee; border-radius: 6px; overflow: hidden; }
.fill { height: 12px; transition: width 0.2s; }
.complete { box-shadow: 0 0 0 2px seagreen; }
</style>
```

Drag the slider: `:style` drives the width and color from state, while `:class` adds a
`complete` class only at 100%. Static classes (`fill`) and the dynamic ones coexist.

# Real World Analogy

Think of `:class` as a set of **light switches** — each class is a switch you flip on when
its condition is true. `:style` is a set of **dimmer dials** — you turn each property to a
precise value. Static `class` is the wiring that's always on.

# Examples

## Example 1 — Basic: a single toggle class

```html
<template>
  <button :class="{ 'is-active': isActive }" @click="isActive = !isActive">Toggle</button>
</template>
```

**Why this works:** The `is-active` class is present only while `isActive` is truthy.

## Example 2 — Real-world: theming with an array

```html
<template>
  <div :class="['card', theme === 'dark' ? 'card--dark' : 'card--light']"></div>
</template>
```

**Why this works:** The array applies a base class plus one of two theme classes, chosen by
state.

## Example 3 — Trade-off / pitfall: over-using inline styles

```html
<!-- Works, but hard to reuse or theme -->
<div :style="{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px' }"></div>
```

**Why this bites:** Inline `:style` is great for values computed from state (like a width),
but for fixed, reusable styling a CSS class is cleaner and easier to theme. Reach for
`:class` first; use `:style` for the truly dynamic bits.

# Common Mistakes

- **Quoting issues:** class names with hyphens must be quoted keys — `{ 'text-danger': … }`.
- **Forgetting units:** `fontSize: size` won't work; use `size + 'px'`.
- **Building class strings by hand** with template literals when the object/array syntax is
  clearer and safer.
- **Using `:style` for everything** instead of toggling reusable CSS classes.

# Best Practices

- Prefer `:class` (toggle a CSS class) over `:style` for anything reusable or themable.
- Use `:style` for values genuinely derived from state (widths, positions, colors).
- Combine a static `class` with a dynamic `:class` — they merge cleanly.
- Keep style objects small; move complex styling into scoped CSS classes.

# Summary

- `:class` accepts an **object** (`{ name: bool }`) or **array** (`[a, b]`) to apply classes
  dynamically, and merges with a static `class`.
- `:style` accepts an **object** of CSS properties (camelCase or quoted kebab-case) or an
  array of such objects.
- Vue **auto-prefixes** styles that need vendor prefixes.
- Favor toggling CSS classes over inline styles for reusable styling.

# Flash Cards

Q: What does :class="{ active: isActive }" do?
A: It applies the CSS class "active" whenever the expression isActive is truthy, and removes it otherwise.

Q: Can you use both a static class and :class on the same element?
A: Yes — the static class and the dynamic :class merge, so both sets of classes apply.

Q: How do you write CSS property names in a :style object?
A: In camelCase (fontSize) or as quoted kebab-case strings ('font-size'). Values are expressions, so remember units like '16px'.

Q: When should you prefer :class over :style?
A: For anything reusable or themable — toggle a CSS class. Reserve :style for values genuinely derived from state, like a computed width or color.

Q: What does Vue do about vendor prefixes in :style?
A: It automatically adds the required vendor prefixes at runtime, so you write the standard property name.

# Exercises

### Easy
Bind `:class="{ done: task.done }"` on a list item so completed tasks get a strikethrough
style (define `.done { text-decoration: line-through }`).

### Medium
Make a color swatch grid where the selected swatch gets a `selected` class (object syntax)
and each swatch's background comes from `:style="{ backgroundColor: color }"`.

### Challenging
Build a "meter" component: a `value` (0–100) drives a `:style` width and a `:class` that
switches among `low`/`medium`/`high` based on thresholds. Decide which parts belong in
`:style` versus `:class` and justify it.

# Further Reading

- [Class and Style Bindings](https://vuejs.org/guide/essentials/class-and-style.html)
