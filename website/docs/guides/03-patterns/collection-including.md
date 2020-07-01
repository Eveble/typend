---
title: CollectionIncluding
sidebar_label: CollectionIncluding
---

#### `CollectionIncluding`

Validates if value matches an `Object` with expected keys and values matching
the given expectations.
The value may also contain other keys with arbitrary values not defined in
pattern(equivalent of Meteor's `Match.ObjectIncluding`).

\*Returns:\*\* `true` if value is matching explicit `CollectionIncluding` pattern
or implicit expectation as plain object even with arbitrary keys, else throws.

```ts
import { expect } from 'chai';
import { validate, ValidationError, CollectionIncluding } from 'typend';

expect(validate({ foo: 'foo' }, new CollectionIncluding({ foo: 'foo' }))).to.be
  .true;

expect(
  validate({ foo: 'foo', bar: 'bar' }, new CollectionIncluding({ foo: 'foo' }))
).to.be.true;

expect(() =>
  validate(
    { foo: 'NOT_foo', bar: 'bar' },
    new CollectionIncluding({ foo: 'foo' })
  )
).to.throw(ValidationError);

// You can omit defining explicit pattern(`CollectionIncluding`) by passing plain  object in loose mode:
validate({ foo: 'foo' }, { foo: 'foo' }, false);
```
