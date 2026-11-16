---
slug: slot-fallback
title: "Slot Fallback Content"
topic: slots-provide
kind: technique
summary: "Define fallback default content inside the slot tag to display when the parent passes nothing."
tags: [slots, fallback, defaults, ux]
related: [default-slot, named-slots, scoped-slots]
---
> **In one line:** Place content inside <slot>Fallback</slot> to display when the parent passes no content.

## The idea

Components that accept content via slots often have sensible defaults. For example, a submit button component usually says "Submit", but should allow parents to override it with "Save Changes" or "Register Now".

Vue makes this trivial with **slot fallback content**: you simply place default markup *inside* the opening and closing `<slot>` tags in the child component.

```html
<!-- Child component defines default fallback: -->
<button class="btn">
  <slot>Submit</slot> <!-- "Submit" is rendered if parent passes nothing -->
</button>
```

If the parent provides content between the tags (`<PrimaryBtn>Save</PrimaryBtn>`), Vue discards the fallback and renders "Save". If the parent passes nothing (`<PrimaryBtn />`), Vue renders "Submit".

## See it

```html
<!-- ModalDialog.vue (Child) -->
<template>
  <div class="modal-overlay">
    <div class="modal-body">
      <!-- Fallback message if parent leaves slot empty -->
      <slot>
        <p class="default-msg">No dialog content provided.</p>
      </slot>
    </div>
    <div class="modal-actions">
      <!-- Fallback button label -->
      <button>
        <slot name="confirm-text">OK</slot>
      </button>
    </div>
  </div>
</template>
```

Parent usage:

```html
<!-- Case 1: Uses default fallback ("OK") -->
<ModalDialog>
  <p>Are you sure you want to proceed?</p>
</ModalDialog>

<!-- Case 2: Overrides fallback with custom text -->
<ModalDialog>
  <p>Unsaved changes detected.</p>
  <template #confirm-text>Discard & Exit</template>
</ModalDialog>
```

In Case 1, the button automatically renders "OK"; in Case 2, it renders "Discard & Exit".

## Go deeper

Fallback content can be any valid template markup, including images, icons, or other Vue components.

> **Tip:** Use slot fallbacks to make reusable UI components functional out of the box with zero required configuration.

## Watch out

- Passing whitespace-only strings between component tags might count as provided content and suppress the fallback.
- Fallback content is compiled in the child component's scope.

## Remember

- Place default markup inside <slot>...</slot> for fallback content.
- Fallback renders automatically when the parent provides no slot content.
- Parents override fallback simply by passing elements between tags.
