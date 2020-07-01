import { expect } from 'chai';
import { check, ValidationError } from '../../../src';

describe('interface', () => {
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

  it('check', () => {
    check<PersonInterface>(new Person('Jane', 'Doe', 175));
    expect(
      () => check<PersonInterface>({ firstName: 'Jane', lastName: 'Don' }) // Missing getFullName method
    ).to.throw(ValidationError);
  });
});
