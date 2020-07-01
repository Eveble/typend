---
title: Collection
sidebar_label: Object > Collection
---

#### Object > `Collection`

Validates an Object with the given keys and with values matching the given patterns.
The value must not contain any arbitrary keys(not listed in the pattern).
The value must be a plain Object or class instance.

**Returns:** `true` if value is matching explicit `Collection` pattern or implicit expectation as plain object, else throws.

```ts
import { expect } from 'chai';
import {
  check,
  validate,
  PropTypes,
  UnexpectedKeyError,
} from 'typend';

check<Record<any, any>>({ foo: 'foo' });
check<Record<keyof any, any>>({ foo: 'foo' });
check<{}>({});
check<{ name: string; age: number }>({ name: 'Jane Doe', age: 28 });
check<Car>({ brand: 'Tesla' });

// Explicit:
validate({}, PropTypes.object);
validate({ foo: 'foo' }, PropTypes.shape({ foo: 'foo' }));
validate(
  { name: 'Jane Doe', age: 28 },
  PropTypes.shape({
    name: String,
    age: Number,
  })
);
expect(() =>
  validate({ foo: 'foo', bar: 'bar' }, PropTypes.shape({ foo: 'foo' }))
).to.throw(UnexpectedKeyError);

// Implicit: you can omit defining explicit pattern(`Collection`) by passing plain object:
validate({ foo: 'foo' }, { foo: 'foo' });

// By default, validator will run in strict mode - so its equivalent of:
validate({ foo: 'foo' }, { foo: 'foo' }, true);
```