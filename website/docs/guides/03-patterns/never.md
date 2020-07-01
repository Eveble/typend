---
title: never
sidebar_label: never
---

#### never > `Never`

Value can't be assigned(must be undefined).

**Returns:** always `true` for undefined, else throws.

```ts
import { check, never, PropTypes, validate } from 'typend';

check<never>(undefined);
validate(undefined, never);
validate(undefined, PropTypes.never);
```