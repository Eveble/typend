import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { Interface } from '../../../src/patterns/interface';
import { InterfaceValidator } from '../../../src/validators/interface-validator';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import {
  InvalidTypeError,
  UnequalValueError,
  UnexpectedKeyError,
} from '../../../src/errors';

use(sinonChai);

describe(`InterfaceValidator`, () => {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  class Person {
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

  it(`extends PatternValidator`, () => {
    expect(InterfaceValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of Interface', () => {
        const classValidator = new InterfaceValidator();
        expect(classValidator.canValidate(new Interface({ key: String }))).to.be
          .true;
      });
    });

    context('implicit expectation', () => {
      it('does not support implicit expectations', () => {
        const classValidator = new InterfaceValidator();
        expect(classValidator.canValidate(undefined)).to.be.false;
        expect(classValidator.canValidate(null)).to.be.false;
        expect(classValidator.canValidate(true)).to.be.false;
        expect(classValidator.canValidate(false)).to.be.false;
        expect(classValidator.canValidate({})).to.be.false;
      });
    });
  });

  describe(`validation`, () => {
    it(`throws InvalidTypeError if provided value is not an Object or class instance`, () => {
      const intfValidator = new InterfaceValidator();

      const val = 'my-string';
      const intf = new Interface({
        key: String,
      });
      const valStr = inspect(val);
      describer.describe.returns(valStr);

      expect(() => intfValidator.validate(val, intf, validator)).to.throw(
        InvalidTypeError,
        `Expected ${valStr} to be an Object or class instance`
      );
      expect(describer.describe).to.be.called;
      expect(describer.describe).to.be.calledWith(val);
    });
  });

  context('valid values', () => {
    it('iterates through each expected properties and methods entries of class instance and validates them against validator', () => {
      const intfValidator = new InterfaceValidator();

      const val = new Person('Jane Doe', 28);
      const intf = new Interface({
        name: String,
        age: Number,
        getName: Function,
        getAge: Function,
      });
      validator.validate.withArgs('Jane Doe', String).returns(true);
      validator.validate.withArgs(28, Number).returns(true);
      validator.validate.withArgs('getName', Function).returns(true);
      validator.validate.withArgs('getAge', Function).returns(true);

      expect(intfValidator.validate(val, intf, validator)).to.be.true;
      expect(validator.validate).to.be.callCount(4);
      expect(validator.validate).to.be.calledWith('Jane Doe', String);
      expect(validator.validate).to.be.calledWith(28, Number);
      expect(validator.validate).to.be.calledWith(val.getAge, Function);
      expect(validator.validate).to.be.calledWith(val.getName, Function);
    });

    it('iterates through each expected properties and methods of an object entries and validates them against validator', () => {
      const intfValidator = new InterfaceValidator();

      const val = {
        name: 'Jane Doe',
        age: 28,
        getName(): string {
          return this.name;
        },
        getAge(): number {
          return this.age;
        },
      };
      const intf = new Interface({
        name: String,
        age: Number,
        getName: Function,
        getAge: Function,
      });
      validator.validate.withArgs('Jane Doe', String).returns(true);
      validator.validate.withArgs(28, Number).returns(true);
      validator.validate.withArgs('getName', Function).returns(true);
      validator.validate.withArgs('getAge', Function).returns(true);

      expect(intfValidator.validate(val, intf, validator)).to.be.true;
      expect(validator.validate).to.be.callCount(4);
      expect(validator.validate).to.be.calledWith('Jane Doe', String);
      expect(validator.validate).to.be.calledWith(28, Number);
      expect(validator.validate).to.be.calledWith(val.getAge, Function);
      expect(validator.validate).to.be.calledWith(val.getName, Function);
    });

    it(`returns true for object value with other arbitrary keys and values`, () => {
      const intfValidator = new InterfaceValidator();

      const val = {
        first: 'value',
        second: 2,
      };
      const intf = new Interface({
        first: String,
      });
      const valStr = inspect(val);
      describer.describe.withArgs(val).returns(valStr);
      validator.validate.withArgs('value', String).returns(true);
      validator.validate
        .withArgs(2, undefined)
        .throws(new UnequalValueError(`Expected Number(2) to be a undefined`));

      expect(intfValidator.validate(val, intf, validator)).to.be.true;
      expect(validator.validate).to.be.calledOnce;
      expect(validator.validate).to.be.calledWith('value', String);
    });

    it(`returns true for nested object value with other arbitrary keys and values`, () => {
      const intfValidator = new InterfaceValidator();

      const val = {
        first: 'value',
        second: {
          a: 'a-value',
          unexpected: 'unexpected-value',
        },
      };
      const expectation = new Interface({
        first: String,
        second: {
          a: 'a-value',
        },
      });
      const valStr = inspect(val);
      describer.describe.withArgs(val).returns(valStr);
      validator.validate.withArgs('value', String).returns(true);
      validator.validate
        .withArgs(
          { a: 'a-value', unexpected: 'unexpected-value' },
          { a: 'a-value' }
        )
        .throws(
          new UnexpectedKeyError(
            `Unexpected key 'unexpected' in {"a":"a-value","unexpected":"unexpected-value"}`
          )
        );

      expect(intfValidator.validate(val, expectation, validator)).to.be.true;
      expect(validator.validate).to.be.calledOnce;
      expect(validator.validate).to.be.calledWith('value', String);
    });
  });

  context('invalid values', () => {
    it(`pass-through errors from type validator validation if provided value contain nested properties that does not match expected one`, () => {
      const intfValidator = new InterfaceValidator();

      const pattern = new Interface({
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {
            c: 'value',
          },
        },
      });
      const val = {
        foo: {
          bar: {
            a: 'a-value',
            b: 'b-invalid-not-a-number',
          },
          baz: {
            c: 'c-value',
          },
        },
      };
      const valStr = JSON.stringify(val);
      describer.describe.withArgs(val).returns(valStr);

      validator.validate.withArgs('a-value', String).returns(true);
      validator.validate
        .withArgs('b-invalid-not-a-number', Number)
        .throws(
          new UnequalValueError(
            `Expected Number, got String("invalid-should-be-number")`
          )
        );
      validator.validate.withArgs('c-value', String).returns(true);

      expect(() => intfValidator.validate(val, pattern, validator)).to.throw(
        UnequalValueError,
        `(Key 'foo.bar.b': Expected Number, got String("invalid-should-be-number") in {"foo":{"bar":{"a":"a-value","b":"b-invalid-not-a-number"},"baz":{"c":"c-value"}}})`
      );
      expect(validator.validate).to.be.calledWith('a-value', String);
      expect(validator.validate).to.be.calledWith(
        'b-invalid-not-a-number',
        Number
      );
    });
  });
});
