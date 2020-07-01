---
title: Domain Driven Design
sidebar_label: Domain Driven Design
---

### Creating ValueObject(Struct)

In DDD architecture that implements validation on construction of each type - you can be assured that provided instance holds always valid data.

By creating self-validating Value Objects you are limiting scope of validation only to applicable type(`instanceof`) - and not contained data by that instance.

For `Struct` or `ValueObject` a-like constructables that support inheritable structure validation you can use this design pattern:

```ts
import { define, validate, PropsOf, ValidationError } from 'typend';

@define()
class Struct {
  constructor(props: Record<keyof any, any>) {
    this.onValidation(props);
    Object.assign(this, props);
  }

  onValidation(props: Record<keyof any, any>): boolean {
    return validate(props, new PropsOf(this.constructor));
  }
}

@define()
class Parent extends Struct {
  parent: string;
}

@define()
class Child extends Parent {
  child: 'bar';
}

// Valid
expect(() => new Parent({ parent: 'foo' })).to.not.throw(Error);
expect(() => new Child({ parent: 'foo', child: 'bar' })).to.not.throw(Error);

// Invalid
expect(() => new Child({ parent: 'foo' })).to.throw(ValidationError);
expect(
  () => new Child({ parent: 'foo', child: 'bar', unexpected: 'unexpected' })
).to.throw(ValidationError);
```

This allows you for creating other Value Objects, Entities, Aggregates etc. that use them as properties:

```ts
import { define, validate, PropsOf, ValidationError } from 'typend';

class Aggregate {}

class ValueObject extends Struct {}

@define()
class PhoneNumber extends ValueObject {
  number: string;
}

@define()
class EmailAddress extends ValueObject {
  address: string;
}

// Example implementation
@define()
class Customer extends Aggregate {
  firstName: string;

  lastName: string;

  phoneNumber: PhoneNumber;

  emailAddress: EmailAddress;

  constructor(props: Record<keyof any, any>) {
    super();
    this.onValidation(props);
    Object.assign(this, props);
  }

  onValidation(props: Record<keyof any, any>): boolean {
    return validate(props, new PropsOf(Customer));
  }
}

const phoneNumber = new PhoneNumber({ number: '500500500' });
const emailAddress = new EmailAddress({ address: 'jane@doe.com' });
const customer = new Customer({
  firstName: 'Jane',
  lastName: 'Doe',
  phoneNumber,
  emailAddress,
});
expect(customer).to.be.eql({
  firstName: 'Jane',
  lastName: 'Doe',
  phoneNumber,
  emailAddress,
});
// `PhoneNumber` and `EmailAddress` value objects are not used!
expect(
  () =>
    new Customer({
      firstName: 'Jane',
      lastName: 'Doe',
      phoneNumber: '500500500',
      emailAddress: 'jane@doe.com',
    })
).to.throw(ValidationError);
```
