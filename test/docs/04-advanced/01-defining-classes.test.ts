import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
import {
  Type,
  check,
  $PropsOf,
  ValidationError,
  is,
  PropsOf,
  isValid,
} from '../../../src/index';

describe('01-defining-classes', () => {
  @Type()
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
    expect(() => new Person('Jane', 'Doe', 28)).not.toThrow(Error);
    expect(() => new Person('Jane', 'Doe')).not.toThrow(Error);
    expect(() => new Person('Jane', undefined as any)).toThrow(ValidationError); // lastName as string is required
  });

  describe('propsOf', () => {
    it('validates propsOf', () => {
      expect(is<$PropsOf<Person>>({ firstName: 'Jane', lastName: 'Doe' })).toBe(
        true
      );
      expect(
        isValid({ firstName: 'Jane', lastName: 'Doe' }, new PropsOf(Person))
      ).toBe(true);
    });
  });
});
