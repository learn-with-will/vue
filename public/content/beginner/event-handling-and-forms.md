---
id: lesson-07
slug: event-handling-and-forms
title: "Event Handling & Form Bindings"
level: beginner
order: 7
duration: 20
summary: "Handle DOM events with v-on (@) and its modifiers, then bind form inputs two-way with v-model across text, checkboxes, radios, and selects, including the .lazy, .number, and .trim modifiers."
tags:
  - v-on
  - events
  - v-model
  - forms
---

# Learning Objectives

By the end of this lesson you will be able to:

- Handle events with `v-on` (`@`) using inline and method handlers.
- Use event modifiers like `.prevent`, `.stop`, and key modifiers like `.enter`.
- Bind form inputs two-way with `v-model`.
- Apply `v-model` to checkboxes, radios, and selects.
- Use the `.lazy`, `.number`, and `.trim` `v-model` modifiers.

# Why It Matters

Interactivity is events plus forms. `v-on` lets you respond to clicks, key presses, and
submits; `v-model` keeps form inputs and your reactive state in sync without manual wiring.
Together they cover the vast majority of "user does something, state changes" in an app.

# Concept Explanation

### Listening to events

`v-on` (shorthand `@`) attaches an event listener. The handler can be an inline expression
or a method:

```html
<button @click="count++">Add</button>
<button @click="increment">Add</button>
```

To access the native event object in an inline handler, use the special `$event` variable;
in a method handler it's passed as the first argument:

```html
<input @input="onInput($event)" />
```

```typescript
function onInput(e: Event) {
  console.log((e.target as HTMLInputElement).value)
}
```

### Event modifiers

Common DOM chores get their own **modifiers**, so you don't call them by hand:

- `.prevent` → `event.preventDefault()`
- `.stop` → `event.stopPropagation()`
- `.once` → the handler runs at most once
- `.self` → only fire if the event target is this element itself
- `.capture`, `.passive` → change how the listener is attached

```html
<form @submit.prevent="onSubmit">…</form>
```

### Key and mouse modifiers

For keyboard events, add the key name: `@keyup.enter`, `@keyup.esc`. There are system
modifiers (`.ctrl`, `.alt`, `.shift`, `.meta`), `.exact` for precise combinations, and mouse
button modifiers (`.left`, `.right`, `.middle`):

```html
<input @keyup.enter="submit" />
<button @click.ctrl="openInNewTab">Ctrl-click me</button>
```

### Two-way binding with `v-model`

`v-model` keeps a form input and a piece of reactive state in sync. For a text input it's
shorthand for binding `:value` and listening to `@input`:

```html
<input v-model="name" />
<!-- roughly equivalent to -->
<input :value="name" @input="name = $event.target.value" />
```

### `v-model` on different inputs

`v-model` adapts to the control:

```html
<!-- text / textarea: string -->
<textarea v-model="bio"></textarea>

<!-- single checkbox: boolean -->
<input type="checkbox" v-model="agreed" />

<!-- multiple checkboxes: bind to an array -->
<input type="checkbox" value="vue" v-model="tags" />
<input type="checkbox" value="react" v-model="tags" />

<!-- radios: the selected value -->
<input type="radio" value="s" v-model="size" />
<input type="radio" value="m" v-model="size" />

<!-- select: the chosen option's value -->
<select v-model="country">
  <option value="us">United States</option>
  <option value="vn">Vietnam</option>
</select>
```

### `v-model` modifiers

- `.lazy` — sync on `change` (e.g. blur) instead of every keystroke.
- `.number` — cast the input to a number (empty stays as is).
- `.trim` — trim leading/trailing whitespace.

```html
<input v-model.number="age" />
<input v-model.trim="username" />
```

# Key Terminology

- **`v-on` / `@`** — attach an event listener.
- **Handler** — the inline expression or method that runs on the event.
- **Modifier** — a suffix (`.prevent`, `.enter`) that adjusts event handling.
- **`v-model`** — two-way binding between a form input and reactive state.

# Options and Trade-offs

| Option | What it does | Use when | Watch out for |
| ------ | ------------ | -------- | ------------- |
| Inline handler `@click="count++"` | Runs a short expression | Trivial updates | Keep it tiny; move logic to a method |
| Method handler `@click="save"` | Calls a function | Any real logic | Don't call it (`save()`) unless you need to pass args |
| `.prevent` / `.stop` modifiers | Handle preventDefault/stopPropagation declaratively | Forms, nested clickables | Order can matter (e.g. `.prevent.self`) |
| `v-model` | Two-way input binding | Form fields | For components, `v-model` uses props/events (later lesson) |

# Worked Example

A small sign-up form that uses events and several `v-model` flavors:

```html
<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const age = ref<number | null>(null)
const plan = ref('free')
const interests = ref<string[]>([])
const agreed = ref(false)

function submit() {
  console.log({ name: name.value, age: age.value, plan: plan.value, interests: interests.value })
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model.trim="name" placeholder="Name" />
    <input v-model.number="age" type="number" placeholder="Age" />

    <label><input type="radio" value="free" v-model="plan" /> Free</label>
    <label><input type="radio" value="pro" v-model="plan" /> Pro</label>

    <label><input type="checkbox" value="vue" v-model="interests" /> Vue</label>
    <label><input type="checkbox" value="ts" v-model="interests" /> TypeScript</label>

    <label><input type="checkbox" v-model="agreed" /> I agree to the terms</label>

    <button type="submit" :disabled="!agreed">Sign up</button>
  </form>
</template>
```

`@submit.prevent` stops the page reload; `.trim` and `.number` clean the inputs; radios bind
to a single value, and the interest checkboxes collect into an array.

# Real World Analogy

`v-on` is a **doorbell**: when the event happens, your handler answers. `v-model` is a
**two-way intercom** wired between the form field and your state — talk into either end and
the other hears it instantly.

# Examples

## Example 1 — Basic: submit on Enter

```html
<template>
  <input v-model="text" @keyup.enter="add" />
</template>
```

**Why this works:** The `.enter` key modifier runs `add` only when the Enter key is released.

## Example 2 — Real-world: preventing a form reload

```html
<template>
  <form @submit.prevent="save">…</form>
</template>
```

**Why this works:** `.prevent` calls `event.preventDefault()` for you, so the browser doesn't
reload the page on submit.

## Example 3 — Trade-off / pitfall: v-model.number on empty input

```html
<input v-model.number="age" type="number" />
```

**Why this bites:** `.number` casts to a number, but an empty field yields an empty string,
not `0`. Handle the "no value yet" case (e.g. type it as `number | null`) instead of
assuming a number is always present.

# Common Mistakes

- **Calling the handler by mistake:** `@click="save()"` runs `save` immediately at render;
  use `@click="save"` unless you're passing arguments.
- **Forgetting `.prevent` on form submit**, causing a full-page reload.
- **Binding multiple checkboxes to a boolean** — bind them to an **array** to collect values.
- **Expecting `.number` to give `0` for empty input** — it doesn't; plan for empty/`null`.

# Best Practices

- Use `@submit.prevent` on forms and handle submission in a method.
- Keep inline handlers to tiny expressions; move real logic into named functions.
- Use `.lazy` for expensive updates you don't need on every keystroke, and `.trim` for
  free-text fields.
- Reach for key modifiers (`.enter`, `.esc`) instead of checking `event.key` by hand.

# Summary

- `v-on` (`@`) listens for events; handlers are inline expressions or methods, with `$event`
  for the native event.
- **Modifiers** (`.prevent`, `.stop`, `.once`, key modifiers like `.enter`) handle common
  event chores declaratively.
- `v-model` is two-way binding; it's sugar for `:value` + an input event.
- `v-model` adapts to checkboxes (boolean or array), radios, and selects, and supports
  `.lazy`, `.number`, and `.trim`.

# Flash Cards

Q: What is the difference between @click="save" and @click="save()"?
A: @click="save" passes the function as the handler; @click="save()" calls save immediately during render and uses its return value as the handler — usually a bug unless you intend to pass arguments.

Q: What does @submit.prevent do?
A: It listens for the form's submit event and calls event.preventDefault() for you, stopping the default full-page reload.

Q: What is v-model shorthand for on a text input?
A: Binding :value to the state and updating that state on the input event — roughly :value="x" plus @input="x = $event.target.value".

Q: How do you collect several checkboxes into one value?
A: Bind them all to the same array with v-model; each checked box's value is added to the array.

Q: What do the .number and .trim v-model modifiers do?
A: .number casts the input to a number, and .trim removes leading and trailing whitespace from the value.

Q: How do you run a handler only when the Enter key is pressed?
A: Use the key modifier: @keyup.enter="handler".

# Exercises

### Easy
Add a text input with `@keyup.enter` that pushes the current value into a list and clears the
input.

### Medium
Build a filter panel: checkboxes bound to a `selectedTags` array and a `<select v-model>` for
a category. Show the current selection below.

### Challenging
Create a number field with `v-model.number` that never allows values below 0 or above 100.
Handle the empty-input case cleanly, and add a keyboard shortcut (`@keyup.up`/`.down`) to
step the value.

# Further Reading

- [Event Handling](https://vuejs.org/guide/essentials/event-handling.html)
- [Form Input Bindings (`v-model`)](https://vuejs.org/guide/essentials/forms.html)
