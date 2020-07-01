---
title: CollectionWithin
sidebar_label: CollectionWithin
---

#### `CollectionWithin`

Validates if value matches an Object with expected keys and values matching the given expectations. The value may also contain other keys with arbitrary values not defined in pattern(equivalent of Meteor's `Match.ObjectIncluding`).

It also can omit nested Object properties(useful for building up configuration a like objects).

**Returns:** true if value is matching explicit `CollectionWithin` pattern even on nested missing object properties, else throws.

```ts
import { expect } from 'chai';
import { validate, CollectionWithin, ValidationError } from 'typend';

const expectation = {
  included: {
    foo: 'foo',
  },
  omitted: {
    bar: 'bar',
  },
};

expect(
  validate(
    { included: { foo: 'foo' }, omitted: { bar: 'bar' } },
    new CollectionWithin(expectation)
  )
).to.be.true;

expect(
  validate({ included: { foo: 'foo' } }, new CollectionWithin(expectation))
).to.be.true;

expect(() =>
  validate({ included: { foo: 'NOT_foo' } }, new CollectionWithin(expectation))
).to.throw(ValidationError);
```
