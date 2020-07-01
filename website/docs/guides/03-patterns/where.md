---
title: where
sidebar_label: where
---

#### where > `Where`

Validates value against expectation function.

**Returns:** `true` if expectation function is truthful for value, else throws.

```ts
import { expect } from 'chai';
import { validate, ValidationError, PropTypes } from '../../../src/index';

function validateFoo(value: string): boolean {
  if (value !== 'foo') {
    throw new ValidationError('my-error');
  }
  return true;
}

validate('foo', PropTypes.where(validateFoo));

expect(() => {
  validate('bar', PropTypes.where(validateFoo));
}).to.throw(ValidationError);
```