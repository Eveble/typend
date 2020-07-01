---
title: Interface
sidebar_label: Interface
---

#### `Interface`

Validates value against `Interface` pattern requiring it to match
expected properties and available methods(compared only by name - and not by with
method parameters).
The value may also contain other keys with arbitrary values not defined in
pattern(equivalent of Meteor's `Match.ObjectIncluding`).

**Returns:** `true` if value is matching `Interface` pattern expectation, else throws.

```ts
import { check, ValidationError } from 'typend';

interface PersonInterface {
  firstName: string;
  lastName: string;
  getFullName(): string;
}

class Person implements PersonInterface {
  firstName: string;

  lastName: string;

  age: number; // Arbitrary key not listed on PersonInterface

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(firstName: string, lastName: string, age: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }
}

check<PersonInterface>(new Person('Jane', 'Doe', 175));
expect(
  () => check<PersonInterface>({ firstName: 'Jane', lastName: 'Don' }) // Missing getFullName method
).to.throw(ValidationError);
```
