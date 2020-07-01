import { expect } from 'chai';
import {
  define,
  check,
  $PropsOf,
  ValidationError,
  is,
  PropsOf,
  isValid,
} from '../../../src/index';

describe('01-defining-classes', () => {
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
  it('defining class', () => {
    expect(() => new Person('Jane', 'Doe', 28)).to.not.throw(Error);
    expect(() => new Person('Jane', 'Doe')).to.not.throw(Error);
    expect(() => new Person('Jane', undefined as any)).to.throw(
      ValidationError
    ); // lastName as string is required
  });

  describe('propsOf', () => {
    expect(
      is<$PropsOf<Person>>({ firstName: 'Jane', lastName: 'Doe' })
    ).to.be.true;
    expect(isValid({ firstName: 'Jane', lastName: 'Doe' }, new PropsOf(Person)))
      .to.be.true;
  });
});
