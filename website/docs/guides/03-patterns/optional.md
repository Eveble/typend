---
title: Optional
sidebar_label: Optional
---

#### `Optional`

Validates if value is undefined or matches the expectation.

**Returns:** `true` if value is an undefined or matches expectation, else throws.

```ts
import {
  check,
  define,
  Class,
  Optional,
  ValidationError,
  convert,
  validate,
  PropTypes,
} from 'typend';

@define()
class Sandwich {
  pickles?: boolean;
}

expect(convert<Sandwich>()).to.be.eql(
  new Class(Sandwich, {
    pickles: PropTypes.equal(Boolean).isOptional,
  })
);
check<undefined | string>('foo');
check<undefined | string>(undefined);
expect(() => check<undefined | number>('foo')).to.throw(ValidationError);

validate(undefined, PropTypes.equal(String).isOptional);
validate('foo', PropTypes.instanceOf(String).isOptional);
validate('foo', new Optional(String));
expect(() => validate('foo', PropTypes.equal(Number).isOptional)).to.throw(
  ValidationError
);
```
