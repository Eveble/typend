---
title: unknown
sidebar_label: unknown
---

#### unknown > `Unknown`

Any value will be matching expectation.

**Returns:** the default behavior for validation of unknown values.

```ts
import { check, unknown, validate } from 'typend';

check<unknown>(undefined);
check<unknown>(null);
check<unknown>('foo');

validate(undefined, unknown);
validate(null, unknown);
validate('foo', unknown);
```