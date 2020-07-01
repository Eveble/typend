---
title: InstanceOf
sidebar_label: InstanceOf
---

#### `InstanceOf`

Validates if value is instance of an expected type.

**Returns:** `true` if value has same type as expectation, else throws.

```ts
import { expect } from 'chai';
import { check, iof, UnmatchedTypeError, string, number, PropTypes } from 'typend';

check<string>('foo');
check<number>(1337);
expect(() => check<number>('foo')).to.throw(UnmatchedTypeError);

validate('foo', String);
validate(1337, PropTypes.instanceOf(Number));
validate('foo', string);
validate(1337, number);
```