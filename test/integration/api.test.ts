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
import { mock } from 'vitest-mock-extended';
import { ValidationError } from '../../src/errors';
import { Interface } from '../../src/patterns/interface';
import { InstanceOf } from '../../src/patterns/instance-of';
import {
  // TypeScript api
  check,
  is,
  instanceOf,
  // JavaScript api
  validate,
  isValid,
  isInstanceOf,
  convert,
  reflect,
} from '../../src/index';
import { Type } from '../../src/decorators/type.decorator';

describe('API', () => {
  interface Employee {
    name: string;

    age: number;

    getName(): string;

    getAge(): number;
  }

  const employeeInterface = new Interface({
    name: String,

    age: Number,

    getName: Function,

    getAge: Function,
  });

  @Type()
  class Parent {
    name: string;

    age: number;

    constructor(name, age) {
      this.name = name;
      this.age = age;
    }

    getName(): string {
      return this.name;
    }

    getAge(): number {
      return this.age;
    }
  }

  @Type()
  class Child extends Parent {}

  @Type()
  class Person {
    name: string;

    age: number;

    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
  }

  describe(`TypeScript API`, () => {
    describe('check', () => {
      it('returns true on valid value', () => {
        expect(check<string>('my-string')).toBe(true);
      });

      it('re-throws ValidationError thrown on validation', () => {
        expect(() => check<number>('my-string')).toThrow(
          ValidationError,
          'Expected String("my-string") to be a Number'
        );
      });
    });

    describe('is', () => {
      it('returns true on valid value', () => {
        expect(is<string>('my-string')).toBe(true);
      });

      it('returns false on invalid value', () => {
        expect(is<boolean>('my-string')).toBe(false);
      });
    });

    describe('instanceOf', () => {
      describe('primitive types', () => {
        it('returns true on value that is instance of primitive type', () => {
          expect(instanceOf<string>('my-string')).toBe(true);
        });

        it('returns false on value that is not instance of primitive type', () => {
          expect(instanceOf<number>(true)).toBe(false);
        });
      });

      describe('classes', () => {
        it('returns true on value that is instance of a class', () => {
          expect(instanceOf<Parent>(new Parent('Jane Doe', 28))).toBe(true);
        });
        it('returns true on value that is inheritable instance of a class', () => {
          expect(instanceOf<Parent>(new Child('Stewie Griffin', 2))).toBe(true);
        });

        it('returns false on value that is not instance of a class', () => {
          expect(instanceOf<Parent>(new Person('Rick Sanchez', 60))).toBe(
            false
          );
        });
      });

      describe('interfaces', () => {
        it('returns true on class instance value that is instance of a interface', () => {
          expect(instanceOf<Employee>(new Parent('Jane Doe', 28))).toBe(true);
        });

        it('returns false on class instance value that is not instance of a interface', () => {
          expect(instanceOf<Employee>(new Person('Rick Sanchez', 60))).toBe(
            false
          );
        });

        it('returns true on object literal value that is instance of a interface', () => {
          const person = {
            name: 'Jane Doe',
            age: 28,
            getName(): string {
              return this.name;
            },

            getAge(): number {
              return this.age;
            },
          };
          expect(instanceOf<Employee>(person)).toBe(true);
        });

        it('returns false on object literal value that is not instance of a interface', () => {
          const person = {
            name: 'Jane Doe',
            age: 28,
          };
          expect(instanceOf<Employee>(person)).toBe(false);
        });
      });
    });

    describe('convert', () => {
      it(`converts TypeScript's declaration to validable form`, () => {
        const converted = convert<string>();
        expect(converted).toBeInstanceOf(InstanceOf);
        expect(converted).toEqual([String]);
      });
    });

    describe('reflect', () => {
      it(`reflects TypeScript's declaration to validable form`, () => {
        const reflected = reflect<string>();
        expect(reflected).toBe(String);
      });
    });
  });

  describe('JavaScript API', () => {
    describe('validate', () => {
      it('returns true on valid value', () => {
        expect(validate('my-string', String)).toBe(true);
      });

      it('re-throws ValidationError thrown on validation', () => {
        expect(() => validate('my-string', Number)).toThrow(
          ValidationError,
          'Expected String("my-string") to be a Number'
        );
      });
    });

    describe('isValid', () => {
      it('returns true on valid value', () => {
        expect(isValid('my-string', String)).toBe(true);
      });

      it('returns false on invalid value', () => {
        expect(isValid('my-string', Boolean)).toBe(false);
      });
    });

    describe('isInstanceOf', () => {
      describe('primitive types', () => {
        it('returns true on value that is instance of primitive type', () => {
          expect(isInstanceOf('my-string', String)).toBe(true);
        });

        it('returns false on value that is not instance of primitive type', () => {
          expect(isInstanceOf(true, Number)).toBe(false);
        });
      });

      describe('classes', () => {
        it('returns true on value that is instance of a class', () => {
          expect(isInstanceOf(new Parent('Jane Doe', 28), Parent)).toBe(true);
        });
        it('returns true on value that is inheritable instance of a class', () => {
          expect(isInstanceOf(new Child('Stewie Griffin', 2), Parent)).toBe(
            true
          );
        });

        it('returns false on value that is not instance of a class', () => {
          expect(isInstanceOf(new Person('Rick Sanchez', 60), Parent)).toBe(
            false
          );
        });
      });

      describe('interfaces', () => {
        it('returns true on class instance value that is instance of a interface', () => {
          expect(isInstanceOf(new Parent('Jane Doe', 28), employeeInterface)).to
            .be.true;
        });

        it('returns false on class instance value that is not instance of a interface', () => {
          expect(
            isInstanceOf(new Person('Rick Sanchez', 60), employeeInterface)
          ).toBe(false);
        });

        it('returns true on object literal value that is instance of a interface', () => {
          const person = {
            name: 'Jane Doe',
            age: 28,
            getName(): string {
              return this.name;
            },

            getAge(): number {
              return this.age;
            },
          };
          expect(isInstanceOf(person, employeeInterface)).toBe(true);
        });

        it('returns false on object literal value that is not instance of a interface', () => {
          const person = {
            name: 'Jane Doe',
            age: 28,
          };
          expect(isInstanceOf(person, employeeInterface)).toBe(false);
        });
      });
    });
  });
});
