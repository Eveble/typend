---
title: OneOf
sidebar_label: OneOf
---

#### `OneOf`

Validates if value is matching one of the expectations.

**Returns:** `true` if value is matching one of expectations, else throws.

```ts
import { expect } from 'chai';
import { check, OneOf, PropTypes, NotAMemberError, validate } from 'typend';

check<string | number>('foo');
check<string | number>(1337);
expect(() => check<string | number>(true)).to.throw(NotAMemberError);

validate('News', PropTypes.oneOf(['News', 'Photos']));
validate(1337, PropTypes.oneOf([String, Number]));
validate(1337, PropTypes.oneOfType([String, Number])); // Sugar-api
validate('foo', new OneOf(String, Number));
validate(1337, new OneOf(String, Number));
```
