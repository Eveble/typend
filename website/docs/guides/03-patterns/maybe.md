---
title: Maybe
sidebar_label: Maybe
---

#### `Maybe`

Validates if value is nil or matches expectation.

**Returns:** `true` if value is an `undefined`|`null`(nil) or matches expectation, else throws.

```ts
import { expect } from 'chai';
import { maybe, Maybe, PropTypes, ValidationError, validate } from 'typend';

validate(undefined, PropTypes.maybe(String));
validate(null, PropTypes.maybe(String));
validate('foo', PropTypes.maybe(String));
validate('foo', new Maybe(String));
expect(() => validate('foo', maybe('baz'))).to.throw(ValidationError);
```
