---
title: List
sidebar_label: Array > List
---

#### Array > `List`

Validates if value matches list expectation.

**Returns:** `true` if value is matching expectation list, else throws.

```ts
import { expect } from 'chai';
import { check, validate, PropTypes, List, ValidationError } from 'typend';

check<string[]>(['foo']);
expect(() => check<number>(['foo'])).to.throw(ValidationError);

validate(['foo'], [String]);
validate(['foo'], PropTypes.arrayOf(String));
validate(['foo'], new List(String));
```