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

describe(`InterfaceValidator`, () => {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = mock<types.Describer>();
    validator = mock<types.Validator>();
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
    expect(InterfaceValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of Interface', () => {
        const classValidator = new InterfaceValidator();
        expect(classValidator.canValidate(new Interface({ key: String }))).toBe(
          true
        );
      });
    });

    describe('implicit expectation', () => {
      it('does not support implicit expectations', () => {
        const classValidator = new InterfaceValidator();
        expect(classValidator.canValidate(undefined)).toBe(false);
        expect(classValidator.canValidate(null)).toBe(false);
        expect(classValidator.canValidate(true)).toBe(false);
        expect(classValidator.canValidate(false)).toBe(false);
        expect(classValidator.canValidate({})).toBe(false);
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
      describer.describe.mockReturnValue(valStr);

      expect(() => intfValidator.validate(val, intf, validator)).toThrow(
        InvalidTypeError,
        `Expected ${valStr} to be an Object or class instance`
      );
      expect(describer.describe).toHaveBeenCalled();
      expect(describer.describe).toHaveBeenCalledWith(val);
    });
  });

  describe('valid values', () => {
    it('iterates through each expected properties and methods entries of class instance and validates them against validator', () => {
      const intfValidator = new InterfaceValidator();

      const val = new Person('Jane Doe', 28);
      const intf = new Interface({
        name: String,
        age: Number,
        getName: Function,
        getAge: Function,
      });
      validator.validate.calledWith('Jane Doe', String).mockReturnValue(true);
      validator.validate.calledWith(28, Number).mockReturnValue(true);
      validator.validate.calledWith('getName', Function).mockReturnValue(true);
      validator.validate.calledWith('getAge', Function).mockReturnValue(true);

      expect(intfValidator.validate(val, intf, validator)).toBe(true);
      expect(validator.validate).toHaveBeenCalledTimes(4);
      expect(validator.validate).toHaveBeenCalledWith('Jane Doe', String);
      expect(validator.validate).toHaveBeenCalledWith(28, Number);
      expect(validator.validate).toHaveBeenCalledWith(val.getAge, Function);
      expect(validator.validate).toHaveBeenCalledWith(val.getName, Function);
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
      validator.validate.calledWith('Jane Doe', String).mockReturnValue(true);
      validator.validate.calledWith(28, Number).mockReturnValue(true);
      validator.validate.calledWith('getName', Function).mockReturnValue(true);
      validator.validate.calledWith('getAge', Function).mockReturnValue(true);

      expect(intfValidator.validate(val, intf, validator)).toBe(true);
      expect(validator.validate).toHaveBeenCalledTimes(4);
      expect(validator.validate).toHaveBeenCalledWith('Jane Doe', String);
      expect(validator.validate).toHaveBeenCalledWith(28, Number);
      expect(validator.validate).toHaveBeenCalledWith(val.getAge, Function);
      expect(validator.validate).toHaveBeenCalledWith(val.getName, Function);
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
      describer.describe.calledWith(val).mockReturnValue(valStr);
      validator.validate.calledWith('value', String).mockReturnValue(true);
      validator.validate.calledWith(2, undefined).mockImplementation(() => {
        throw new UnequalValueError(`Expected Number(2) to be a undefined`);
      });

      expect(intfValidator.validate(val, intf, validator)).toBe(true);
      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(validator.validate).toHaveBeenCalledWith('value', String);
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
      describer.describe.calledWith(val).mockReturnValue(valStr);
      validator.validate.calledWith('value', String).mockReturnValue(true);
      validator.validate
        .calledWith(
          expect.objectContaining({
            a: 'a-value',
            unexpected: 'unexpected-value',
          }),
          expect.objectContaining({ a: 'a-value' })
        )
        .mockImplementation(() => {
          throw new UnexpectedKeyError(
            `Unexpected key 'unexpected' in {"a":"a-value","unexpected":"unexpected-value"}`
          );
        });

      expect(intfValidator.validate(val, expectation, validator)).toBe(true);
      expect(validator.validate).toHaveBeenCalledTimes(1);
      expect(validator.validate).toHaveBeenCalledWith('value', String);
    });
  });

  describe('invalid values', () => {
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
      describer.describe.calledWith(val).mockReturnValue(valStr);

      validator.validate.calledWith('a-value', String).mockReturnValue(true);
      validator.validate
        .calledWith('b-invalid-not-a-number', Number)
        .mockImplementation(() => {
          throw new UnequalValueError(
            `Expected Number, got String("invalid-should-be-number")`
          );
        });
      validator.validate.calledWith('c-value', String).mockReturnValue(true);

      expect(() => intfValidator.validate(val, pattern, validator)).toThrow(
        UnequalValueError,
        `(Key 'foo.bar.b': Expected Number, got String("invalid-should-be-number") in {"foo":{"bar":{"a":"a-value","b":"b-invalid-not-a-number"},"baz":{"c":"c-value"}}})`
      );
      expect(validator.validate).toHaveBeenCalledWith('a-value', String);
      expect(validator.validate).toHaveBeenCalledWith(
        'b-invalid-not-a-number',
        Number
      );
    });
  });
});
