---
title: Classes
sidebar_label: Classes
---

**To use class properties validation or evaluation additional `define` class decorator must be applied beforehand.**

You can use utility type `$PropsOf`(or `PropsOf` for JS) to ensure that passed properties durning construction are valid:

```ts
import { define, check, $PropsOf, ValidationError } from 'typend';

@define()
class Person {
  firstName: string;

  lastName: string;

  age?: number;

  constructor(firstName: string, lastName: string, age?: number) {
    check<$PropsOf<Person>>({ firstName, lastName, age });

    this.firstName = firstName;
    this.lastName = lastName;
    if (age) this.age = age;
  }
}

expect(() => new Person('Jane', 'Doe', 28)).to.not.throw(Error);
expect(() => new Person('Jane', 'Doe')).to.not.throw(Error);
expect(() => new Person('Jane', undefined as any)).to.throw(ValidationError); // lastName as string is required
```

You can use `$PropsOf`(or `PropsOf` for JS) inside class constructor for construction validation or outside of it:

```ts
expect(
  is<$PropsOf<Person>>({ firstName: 'Jane', lastName: 'Doe' })
).to.be.true;
```

```js
expect(isValid({ firstName: 'Jane', lastName: 'Doe' }, new PropsOf(Person))).to
  .be.true;
```

This can be useful in scenarios like: evaluation of received data from third-party API.

This removes necessity to maintain unconfined, duplicated data structures all over the code-base(separated class definition and another just for data validation that is most of the cases for other 3d-party validation packages).

### Internal

When creating framework that is using class properties for validation sometimes fields should not be exposed on serialization or even validation. You can flag such fields by using `@internal` annotation:

```ts
import { define, check, $PropsOf, ValidationError } from 'typend';

@define()
class Person {
  firstName: string;

  lastName: string;

  age?: number;

  @internal
  version: number
  ...
}
```

### Validable

You can skip validating class permanently or just initially by annotating class with `@validable` annotation:

```ts
import { define, check, $PropsOf, ValidationError } from 'typend';

@validable(false)
class Person {
  ...
}
```
