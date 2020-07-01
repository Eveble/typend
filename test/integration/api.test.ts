import { expect } from 'chai';
import { ValidationError } from '../../src/errors';
import { define } from '../../src/decorators/define';
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

  @define()
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

  @define()
  class Child extends Parent {}

  @define()
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
        expect(check<string>('my-string')).to.be.true;
      });

      it('re-throws ValidationError thrown on validation', () => {
        expect(() => check<number>('my-string')).to.throw(
          ValidationError,
          'Expected String("my-string") to be a Number'
        );
      });
    });

    describe('is', () => {
      it('returns true on valid value', () => {
        expect(is<string>('my-string')).to.be.true;
      });

      it('returns false on invalid value', () => {
        expect(is<boolean>('my-string')).to.be.false;
      });
    });

    describe('instanceOf', () => {
      context('primitive types', () => {
        it('returns true on value that is instance of primitive type', () => {
          expect(instanceOf<string>('my-string')).to.be.true;
        });

        it('returns false on value that is not instance of primitive type', () => {
          expect(instanceOf<number>(true)).to.be.false;
        });
      });

      context('classes', () => {
        it('returns true on value that is instance of a class', () => {
          expect(instanceOf<Parent>(new Parent('Jane Doe', 28))).to.be.true;
        });
        it('returns true on value that is inheritable instance of a class', () => {
          expect(instanceOf<Parent>(new Child('Stewie Griffin', 2))).to.be.true;
        });

        it('returns false on value that is not instance of a class', () => {
          expect(instanceOf<Parent>(new Person('Rick Sanchez', 60))).to.be
            .false;
        });
      });

      context('interfaces', () => {
        it('returns true on class instance value that is instance of a interface', () => {
          expect(instanceOf<Employee>(new Parent('Jane Doe', 28))).to.be.true;
        });

        it('returns false on class instance value that is not instance of a interface', () => {
          expect(instanceOf<Employee>(new Person('Rick Sanchez', 60))).to.be
            .false;
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
          expect(instanceOf<Employee>(person)).to.be.true;
        });

        it('returns false on object literal value that is not instance of a interface', () => {
          const person = {
            name: 'Jane Doe',
            age: 28,
          };
          expect(instanceOf<Employee>(person)).to.be.false;
        });
      });
    });

    describe('convert', () => {
      it(`converts TypeScript's declaration to validable form`, () => {
        const converted = convert<string>();
        expect(converted).to.be.instanceof(InstanceOf);
        expect(converted).to.be.eql([String]);
      });
    });

    describe('reflect', () => {
      it(`reflects TypeScript's declaration to validable form`, () => {
        const reflected = reflect<string>();
        expect(reflected).to.be.equal(String);
      });
    });
  });

  describe('JavaScript API', () => {
    describe('validate', () => {
      it('returns true on valid value', () => {
        expect(validate('my-string', String)).to.be.true;
      });

      it('re-throws ValidationError thrown on validation', () => {
        expect(() => validate('my-string', Number)).to.throw(
          ValidationError,
          'Expected String("my-string") to be a Number'
        );
      });
    });

    describe('isValid', () => {
      it('returns true on valid value', () => {
        expect(isValid('my-string', String)).to.be.true;
      });

      it('returns false on invalid value', () => {
        expect(isValid('my-string', Boolean)).to.be.false;
      });
    });

    describe('isInstanceOf', () => {
      context('primitive types', () => {
        it('returns true on value that is instance of primitive type', () => {
          expect(isInstanceOf('my-string', String)).to.be.true;
        });

        it('returns false on value that is not instance of primitive type', () => {
          expect(isInstanceOf(true, Number)).to.be.false;
        });
      });

      context('classes', () => {
        it('returns true on value that is instance of a class', () => {
          expect(isInstanceOf(new Parent('Jane Doe', 28), Parent)).to.be.true;
        });
        it('returns true on value that is inheritable instance of a class', () => {
          expect(isInstanceOf(new Child('Stewie Griffin', 2), Parent)).to.be
            .true;
        });

        it('returns false on value that is not instance of a class', () => {
          expect(isInstanceOf(new Person('Rick Sanchez', 60), Parent)).to.be
            .false;
        });
      });

      context('interfaces', () => {
        it('returns true on class instance value that is instance of a interface', () => {
          expect(isInstanceOf(new Parent('Jane Doe', 28), employeeInterface)).to
            .be.true;
        });

        it('returns false on class instance value that is not instance of a interface', () => {
          expect(
            isInstanceOf(new Person('Rick Sanchez', 60), employeeInterface)
          ).to.be.false;
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
          expect(isInstanceOf(person, employeeInterface)).to.be.true;
        });

        it('returns false on object literal value that is not instance of a interface', () => {
          const person = {
            name: 'Jane Doe',
            age: 28,
          };
          expect(isInstanceOf(person, employeeInterface)).to.be.false;
        });
      });
    });
  });
});
