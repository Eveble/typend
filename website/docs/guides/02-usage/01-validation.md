---
title: Validation
sidebar_label: Validation
---

## TypeScript API

Validates if provided value matches ≤T≥.

### check

▸ **check≤T≥**(`value`: any, `isStrict`?: boolean): _boolean_

Validates if a value matches an expectation. `check` on values matching expectation will return `true`, else will throw.

**`throws`** {ValidationError}
Thrown if the value does not match expectation.

**Parameters:**

| Name       | Type    | Description                                                    |
| ---------- | ------- | -------------------------------------------------------------- |
| `value`    | any     | Value that needs to validated.                                 |
| `isStrict` | boolean | Flag indicating that evaluation should be done in strict mode. |

**Returns:** _boolean_

Returns `true` if validation is successful, else throws.

---

```ts
import { expect } from 'chai';
import { check, UnmatchedTypeError } from 'typend';

expect(check<string>('im-a-string')).to.be.true;
expect(() => check<number>('im-not-a-number')).to.throw(
  UnmatchedTypeError,
  `Expected String("im-not-a-number") to be a Number`
);
```

`check` throws one of available and matching errors extending `ValidationError`:

```
InvalidTypeError
InvalidValueError
UnequalValueError
UnmatchedTypeError
NotAMemberError
UnexpectedKeyError
UnknownError
```

You can use error's type(`UnmatchedTypeError`) and message(`Expected String("im-not-a-number") to be a Number`) to ensure in your tests that specific error was thrown and provided value is in fact invalid.

You can learn more about [expectations, strict vs loose validation as patterns below][expectations].

## JavaScript API

Native API allows to use all features that JavaScript provides without any limitation that TypeScript declaration notation is enforcing. This allows equality comparable validation on values that are instances of classes like:

```ts
import { validate } from 'typend';

validate(
  new Date('December 17, 1995 03:24:00'),
  new Date('December 17, 1995 03:24:00')
);
```

or even regular expressions:

```ts
import { validate } from 'typend';

validate('foo', /foo/);
```

> Its important to understand that JavaScripts API is exposed on TypeScript environment so it can be used on limiting validation scenarios.

---

### validate

▸ **validate**(`value`: any, `expectation`: [Expectation](../../modules/types.md#expectation) | [Utility](utility.md), `isStrict?`: boolean): _boolean_

_Implementation of [Library](../../interfaces/types.library.md)_

Validates if a value matches an expectation or throws.

**`throws`** {ValidationError}
Thrown if the value does not match provided expectation.

**Parameters:**

| Name          | Type                                                                                               | Description                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `value`       | any                                                                                                | Value that needs to validated.                                                                                                   |
| `expectation` | [Expectation](../../modules/types.md#expectation) &#124; [Utility](../../api/classes/..utility.md) | Expectation as explicit `Pattern` instance, instance of `Utility` or implicit expectation against which value will be validated. |
| `isStrict?`   | boolean                                                                                            | Flag indicating that evaluation should be done in strict mode.                                                                   |

**Returns:** _boolean_

Returns `true` if validation is successful, else throws.

---

`validate` on values matching expectation will return `true`, else will throw one of available and matching errors extending `ValidationError`:

```
InvalidTypeError
InvalidValueError
UnequalValueError
UnmatchedTypeError
NotAMemberError
UnexpectedKeyError
UnknownError
```

```ts
import { expect } from 'chai';
import { validate, UnmatchedTypeError } from 'typend';

expect(validate('im-a-string', String)).to.be.true;
expect(() => validate('im-not-a-number', Number)).to.throw(
  UnmatchedTypeError,
  `Expected String("im-not-a-number") to be a Number`
);
```

```ts
import { expect } from 'chai';
import { define, validate, propsOf, UnequalValueError } from 'typend';

@define()
class Unicorn {
  sentence: 'sparkle';

  constructor(sentence: 'sparkle') {
    validate({ sentence }, propsOf(Unicorn));
    this.sentence = sentence;
  }
}
expect(() => new Unicorn('🦄🦄 Charrlieee! 🍌👑' as any)).to.throw(
  UnequalValueError
);
```

You can learn more about [expectations, strict vs loose evaluation as patterns below][expectations].

## Types of expectations

Typend uses 3 types of expectations to validate provided value:

#### 1. Implicit - _Any passed argument thats used as expectation_

We call them _implicit_ expectations since **typend** must evaluate what validation type should be used. Any provided argument can be used as implicit expectation. **Typend** will try evaluate the best possible validator for provided argument(however that comes with performance impact). By that we mean, if value, expectations are:

| value                            | expectation | typend assumption                                            |
| -------------------------------- | ----------- | ------------------------------------------------------------ |
| `foo`                            | `string`    | evaluate `foo` to be instanceOf a `String`                   |
| `12`                             | `number`    | evaluate `12` to be instanceOf a `Number`                    |
| `new Person({name: 'Jane Doe'})` | `Person`    | evaluate `Person` instance to be instanceOf a class `Person` |
| `foo`                            | `foo`       | evaluate `foo` to be equal `foo`                             |

etc.

Implicit patterns are the core of **typend's** support for TypeScript declarations.

**In more OOP/DDD friendly environments where most of validation is done on class construction level - the performance impact is less the case since we cache the type's definition.**

#### 2. Explicit - `Pattern`

Those are the most efficient way to validate value against specific `Pattern`. They remove the guess work that _implicit_ validation is burden with.

They are the base building blocks of validation - they are used to _explicitly_ tell **Typend** to which validator([PatternValidator](../../api/interfaces/types.patternvalidator)) delegate the validation.

Pattern classes must implement [Pattern](../../api/interfaces/types.pattern) interface, and with that - implement `getKind(): string` method which returns the _validator kind_(used as identifier).

Returned `string` from the method is used to find explicit validator that can evaluate value without using performance-impacting if-else statements(in comparison to using _any passed expectation_ as _implicit_ expectation).

By example:

`List` pattern as defined `kind` uses `LITERAL_KEYS.KINDS.ARRAY`. **Typend** has already registered validator for that type as [ListValidator](../../api/classes/listvalidator)

```ts
export class List extends Array implements types.Pattern {
  public static kind = KINDS.ARRAY;
  ...
  public getKind(): string {
    return (this.constructor as types.PatternType).kind;
  }
}
```

You can learn more about defining your own [patterns and validators][creating-patterns]

#### 3. Utilities

They are generators of _explicit_ expectations.

Currently supported by:

- `$TypeOf<T>` - as [TypeOf](../../api/classes/typeof) pattern
- `$PropsOf<T>` - as [PropsOf](../../api/classes/propsof) pattern

Utilities are special types using generic notation prefixed with `$` symbol. They are responsible for additional _conversion_ of type(`T`) to validable-form and creation of a specific, applicable pattern for validation that are containing converted result.

```ts
import { define, check } from 'typend';

@define()
class MyClass {
  key: string;

  constructor(key: string) {
    this.key = key;
  }
}
const myClass = new MyClass('my-string');

expect(check<$TypeOf<MyClass>>(myClass)).to.be.true;
```

```ts
import { expect } from 'chai';
import { define, check, UnequalValueError, PropsOf } from 'typend';

@define()
class Unicorn {
  sentence: 'sparkle';

  constructor(sentence: 'sparkle') {
    check<PropsOf<Unicorn>>({sentence});
    this.sentence = sentence;
  }
}
expect(() => new Unicorn('🦄🦄 Charrlieee! 🍌👑').to.throw(
  UnequalValueError
);
```

[expectations]: ../../guides/03-patterns/01-introduction#expectations
[creating-patterns]: ../../guides/04-advanced/03-creating-pattern
[react]: https://reactjs.org/
[prop-types]: https://github.com/facebook/prop-types
