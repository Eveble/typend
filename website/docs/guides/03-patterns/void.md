---
title: void
sidebar_label: void
---

#### void > `Void`

Value can't be assigned(must be undefined).

**Returns:** always `true` for undefined, else throws.

```ts
import { check, validate, voided } from 'typend';

check<void>(undefined);

validate(undefined, voided);
```