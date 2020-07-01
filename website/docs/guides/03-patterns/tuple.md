---
title: Tuple
sidebar_label: Array > Tuple
---

#### Array > `Tuple`

Validates if value is matching tuple expectation.

**Returns:** `true` if value is matching tuple expectation, else throws.

```ts
import { expect } from 'chai';
import {
  check,
  validate,
  tuple,
  Tuple,
  PropTypes,
  NotAMemberError,
} from 'typend';

check<[string, number]>(['foo', 1337]);
expect(() => check<[string]>(['foo', 1234])).to.throw(NotAMemberError);
expect(() => check<[string, number]>(['foo', 'bar'])).to.throw(NotAMemberError);

validate(['foo', 1337], [String, Number]);
validate(['foo', 1337], PropTypes.tuple(String, Number));
validate(['foo', 1337], tuple(String, Number));
validate(['foo', 1337], new Tuple(String, Number));
```
