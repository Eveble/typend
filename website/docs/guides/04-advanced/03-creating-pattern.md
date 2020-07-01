---
title: Creating Pattern
sidebar_label: Creating Pattern
---

There are two types of patterns:

- _matchers_ - they are passed as instance or class constructor as expectation(`Integer`, `Void`, `Never`, `Any` etc..).
- _containers_ - they require additional expectation(s) to be passed as arguments on construction(`Tuple`, `OneOf`, `Optional`, `List`, `Collection` etc...).

### Creating matcher

For this example were going to create pattern that matches only positive numbers.

1. As first step, we need to create a new pattern that implements [`Pattern`](../../api/classes/pattern) interface:

```ts
import { types, Pattern } from 'typend';

export class PositiveNumber extends Pattern implements types.Pattern {
  public static kind = 'positiveNumber';
}
```

Provided `kind` string returned by `getKind()` method will inform **typend** which [`PatternValidator`](../../api/classes/patternvalidator) should be used to validate the value. This significantly improves performance since selection of validator does not need to be evaluated.

In this example **typend** will search for validator that is registered for `kind` - `positiveNumber`.

2. Second step requires us to create dedicated validator matching [`PatternValidator`](../../api/classes/patternvalidator) interface:

```ts
interface PatternValidator {
  canValidate(expectation: Expectation, isStrict?: boolean): boolean;
  validate(
    value?: any,
    expectation?: Expectation,
    validator?: Validator
  ): boolean;
}
```

First lets import all things that will be needed to finish this pattern :

```ts
import { expect } from 'chai';
import {
  Pattern,
  types,
  InvalidTypeError,
  InvalidValueError,
  PatternValidator,
  typend,
  check,
  validate,
} from 'typend';
```

Second were going to focus on pattern evaluation:

```ts
export class PositiveNumberValidator extends PatternValidator implements types.PatternValidator {
  public canValidate(expectation: types.Expectation): boolean {
    return (expectation instanceof PositiveNumber);
  }
  ....
}
```

This ensures, that only `PositiveNumber` instance as **expectations** can used on value validation.

Next, `validate` method needs to be implemented.

```ts
export class PositiveNumberValidator implements types.PatternValidator {
  ...
  public validate(value: any): boolean {
    if (!(typeof value === 'number')) {
      throw new InvalidTypeError(
        `Expected Number, got %s`,
        PatternValidator.describer.describe(value)
      );
    }

    if (value < 1) {
      throw new InvalidValueError(
        `Expected positive number, got %s`,
        PatternValidator.describer.describe(value)
      );
    }
    return true;
  }
}
```

We ensure that provided value is indeed a `number` type or throw `InvalidTypeError`. Also we ensure that provided number is not less then 1 or throw `InvalidValueError`.

We always **return** `true` on end of the validation function.

3. As third step, we need to wire up our new `PositiveNumber` pattern and `PositiveNumberValidator` validator on **typend**. To do that we use:

```ts
typend.validator.registerValidator(
  'positiveNumber',
  new PositiveNumberValidator()
);
```

**Congratulations, you created new matching pattern!**

Since **Typend** allows matcher patterns to be passed in TypeScript declarations, you are now able to use your matcher like:

```ts
check<PositiveNumber>(1);

expect(() => check<PositiveNumber>(-1)).to.throw(InvalidValueError);
```

You can reassign `PositiveNumber` to other, lowercased variable if you like to mimic TypeScript's notation:

```ts
export { PositiveNumber as positive };
import { positive } from 'my-file';

check<positive>(1);
```

Or you can use it in JavaScript API like:

```js
validate(1, PositiveNumber);

expect(() => validate(-1, PositiveNumber)).to.throw(InvalidValueError);
```

### Creating container

For this example were going to simplify `Optional` pattern already included in **Typend**

1. As first step, we need to create a new pattern that implements [`.Pattern`](../../api/classes/pattern) interface:

```ts
import { expect } from 'chai';
import { types, WrapperPattern, UnmatchedTypeError } from 'typend';

export class Optional extends WrapperPattern implements types.Pattern {
  public static kind = 'optional';
}
```

Were extending here `WrapperPattern`, since its much easier to debug complex, multi-level structures that are displayed in `console.log` like:

```batch
{
  ...
  key: Optional ['my string']
  ...
}
```

> For internal workings go to `WrapperPattern` component source code

2. Second step requires us to create dedicated validator matching [`PatternValidator`](../../api/classes/patternvalidator) interface.

Lets import necessary components:

```ts
import { types } from 'typend';
import { Optional } from '../patterns/optional';
```

Again, we'll be first focusing on pattern evaluation:

```ts
export class OptionalValidator implements types.PatternValidator {
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Optional;
  }
  ...
}
```

This time were ensuring, that only `Optional` pattern expectation can be used to validate related values.

Next, `validate` method needs to be implemented.

```ts
export class OptionalValidator implements types.PatternValidator {
  ...
  public validate(
    value: any,
    optional: Optional,
    validator: types.Validator
  ): boolean {
    if (value === undefined) {
      return true;
    }
    const expectation = optional instanceof Optional ? optional[0] : optional;
    return validator.validate(value, expectation);
  }
}
```

We ensure, that value of `any` type can be validated, however accept only `Optional` expectations. Also, this time we pass third parameter to the function `validator` that on validation will be assigned to [`Validator`](../../api/classes/validator) implementation.

Since we expect(allow) values to be `undefined` - we ensure that `undefined` always return true:

```ts
if (value === undefined) {
  return true;
}
```

However, if value is assigned - we ensure that it's indeed matching the provided expectation (like `new Optional(String)` will require value to be `undefined` or instance of `String`).
We don't need to re-implement whole validation logic related to each type of validation - just pipe-through the enclosed expectation back to the validator:

```ts
const expectation = optional instanceof Optional ? optional[0] : optional;
return validator.validate(value, expectation);
```

This simplifies the validation logic by a lot and enforces consistent results.

3. Third step like before is wiring. We need to wire up our new `Optional` pattern and `OptionalValidator` validator to **typend**. To do that we use:

```ts
typend.validator.registerValidator('optional', new OptionalValidator());
```

**However** since **Typend** already has a existing validator for `optional` kind were going to get error:

> Validator for type 'optional' would be overwritten. To override existing validator use 'Validator::overrideValidator'

We need to explicitly override existing one:

```ts
typend.validator.overrideValidator('optional', new OptionalValidator());
```

**Congratulations, you created new container pattern!**

To use it you just type:

```ts
validate(undefined, new Optional(String));
validate('foo', new Optional(String));
expect(() => validate(1234, new Optional(String))).to.throw(UnmatchedTypeError);
```
