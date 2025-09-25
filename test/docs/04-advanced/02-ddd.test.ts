import { expect } from 'chai';
import { Type, validate, PropsOf, ValidationError } from '../../../src/index';

describe('ddd', () => {
  @Type()
  class Struct {
    constructor(props: Record<keyof any, any>) {
      this.onValidation(props);
      Object.assign(this, props);
    }

    onValidation(props: Record<keyof any, any>): boolean {
      return validate(props, new PropsOf(this.constructor));
    }
  }

  @Type()
  class Parent extends Struct {
    parent: string;
  }

  @Type()
  class Child extends Parent {
    child: 'bar';
  }

  it('is valid', () => {
    expect(() => new Parent({ parent: 'foo' })).to.not.throw(Error);
    expect(() => new Child({ parent: 'foo', child: 'bar' })).to.not.throw(
      Error
    );
  });

  it('is invalid', () => {
    expect(() => new Child({ parent: 'foo' })).to.throw(ValidationError);
    expect(
      () =>
        new Child({
          parent: 'foo',
          child: 'bar',
          unexpected: 'unexpected',
        })
    ).to.throw(ValidationError);
  });

  class Aggregate {}

  class ValueObject extends Struct {}

  @Type()
  class PhoneNumber extends ValueObject {
    number: string;
  }

  @Type()
  class EmailAddress extends ValueObject {
    address: string;
  }

  // Example implementation
  @Type()
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

  it('allows to creating complex structures', () => {
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

    expect(
      () =>
        new Customer({
          firstName: 'Jane',
          lastName: 'Doe',
          phoneNumber: '500500500',
          emailAddress: 'jane@doe.com',
        })
    ).to.throw(ValidationError);
  });
});
