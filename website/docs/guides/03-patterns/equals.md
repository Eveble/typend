---
title: Equals
sidebar_label: Equals
---

#### `Equals`

Validates if value is equal to expectation.

**Returns:** `true` if value is equal to expectation, else throws.

```ts
import { check, UnequalValueError, validate, PropTypes } from 'typend';

check<'foo'>('foo');
check<1337>(1337);
expect(() => check<1337>('foo')).to.throw(UnequalValueError);

validate('foo', 'foo');
validate(1337, PropTypes.equal(1337));
```
