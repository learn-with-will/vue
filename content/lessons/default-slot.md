---
slug: default-slot
title: "Content Distribution with Slots"
topic: slots-provide
kind: concept
summary: "The slot outlet lets parent components project arbitrary markup and components into a child."
tags: [slots, composition, content-distribution, templates]
related: [slot-fallback, named-slots, scoped-slots]
---
> **In one line:** The <slot> element acts as an outlet for markup passed between component tags.

## The idea

Props are great for passing data values like strings, numbers, and arrays into components. But when building container components—such as modal dialogs, cards, navigation drawers, or styled buttons—you often want to pass **entire chunks of markup** instead.

Vue implements the Web Components content distribution standard using the **`<slot>`** element.

The child component defines a `<slot></slot>` outlet inside its template. Whatever markup the parent places between the child component's opening and closing tags is rendered right inside that slot outlet:

```tree
Content Distribution Flow
  Parent places markup inside tags:
    <CustomCard>
      <p>Card body text from parent</p>
    </CustomCard>
  Child template renders slot outlet:
    <div class="card-frame">
      <slot></slot> <!-- Parent markup injected here! -->
    </div>
```

The child component controls the outer frame (borders, padding, shadows), while the parent controls the content inside.

## See it

```html
<!-- AlertBox.vue (Child) -->
<template>
  <div class="alert-box">
    <strong>Notification:</strong>
    <!-- Outlet for parent content -->
    <slot></slot>
  </div>
</template>

<style scoped>
.alert-box {
  background-color: #edfaf3;
  border-left: 4px solid #1f8a60;
  padding: 12px;
  border-radius: 4px;
}
</style>
```

Parent usage:

```html
<!-- App.vue (Parent) -->
<script setup lang="ts">
import AlertBox from './AlertBox.vue';
</script>

<template>
  <AlertBox>
    <p>Your profile changes have been successfully saved!</p>
    <a href="#dashboard">Go to Dashboard &rarr;</a>
  </AlertBox>
</template>
```

The paragraph and link are projected into `<AlertBox>` right where `<slot>` was placed.

## Go deeper

Slot content has access to the parent component's data scope because it is compiled in the parent template. A simple rule: **everything in the parent template is compiled in the parent scope**.

> **Tip:** If a component does not contain a `<slot>` outlet, any markup passed between its tags is discarded.

## Watch out

- Slot content cannot access internal variables or methods of the child component directly (use scoped slots for that).
- Do not place slot outlets outside valid HTML parent wrappers if you expect specific CSS flex/grid layout.

## Remember

- <slot> acts as an outlet for markup passed between component tags.
- Container components own the outer shell; parents own the inner content.
- Slot content compiles within the parent component's data scope.
