---
title: Introduction
sidebar_label: Introduction
---

**Typend** exposed two kinds of API:

1. One that uses `generic<T>` TypeScript's notation to define required expectation(`T`).
2. One that can be used outside(and at) TypeScript environment(using vanilla JavaScript).

Since generic notation has it's own limitations thats why both apis exist on this module.

Comparison of exposed APIs:

| TypeScript API | JavaScript API   |
| -------------- | ---------------- |
| `check()`      | `validate()`     |
| `is()`         | `isValid()`      |
| `instanceOf()` | `isInstanceOf()` |
