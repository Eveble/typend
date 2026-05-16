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
import { stubInterface } from '../../vitest-helper';
import { inspect } from 'util';
import { CollectionWithin } from '../../../src/patterns/collection-within';
import { CollectionWithinValidator } from '../../../src/validators/collection-within-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { types } from '../../../src/types';
import {
  InvalidTypeError,
  UnequalValueError,
  UnexpectedKeyError,
} from '../../../src/errors';

describe(`CollectionWithinValidator`, () => {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  class MyClass {
    constructor(props: Record<string, any>) {
      Object.assign(this, props);
    }
  }

  it(`extends PatternValidator`, () => {
    expect(CollectionWithinValidator.prototype).toBeInstanceOf(
      PatternValidator
    );
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of CollectionWithin', () => {
        const collWithinValidator = new CollectionWithinValidator();
        expect(collWithinValidator.canValidate(new CollectionWithin({}))).toBe(
          true
        );
      });
    });

    describe('implicit expectation', () => {
      it('returns false for any other expectation', () => {
        const collWithinValidator = new CollectionWithinValidator();
        expect(collWithinValidator.canValidate({})).toBe(false);
        expect(collWithinValidator.canValidate({})).toBe(false);
        expect(collWithinValidator.canValidate(undefined)).toBe(false);
        expect(collWithinValidator.canValidate(null)).toBe(false);
        expect(collWithinValidator.canValidate(true)).toBe(false);
        expect(collWithinValidator.canValidate(false)).toBe(false);
      });
    });
  });

  describe(`validation`, () => {
    it(`throws InvalidTypeError if provided value is not an plain object`, () => {
      const collWithinValidator = new CollectionWithinValidator();

      const val = new MyClass({
        key: 'value',
      });
      const expectation = new CollectionWithin({
        key: 'value',
      });
      const valStr = inspect(val);
      describer.describe.returns(valStr);

      expect(() =>
        collWithinValidator.validate(val, expectation, validator)
      ).toThrow(InvalidTypeError, `Expected ${valStr} to be an Object`);
      expect(describer.describe).toHaveBeenCalled();
      expect(describer.describe).toHaveBeenCalledWith(val);
    });

    describe('valid values', () => {
      it(`iterates through each expected object entries and validates them against validator`, () => {
        const collWithinValidator = new CollectionWithinValidator();

        const val = {
          first: 'value',
          second: 2,
        };
        const expectation = new CollectionWithin({
          first: String,
          second: Number,
        });
        validator.validate.withArgs('value', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);

        expect(collWithinValidator.validate(val, expectation, validator)).toBe(
          true
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
      });

      it(`returns true even for object value with other arbitrary keys and values`, () => {
        const collWithinValidator = new CollectionWithinValidator();

        const val = {
          first: 'value',
          second: 2,
        };
        const expectation = new CollectionWithin({
          first: String,
        });
        const valStr = inspect(val);
        describer.describe.withArgs(val).returns(valStr);
        validator.validate.withArgs('value', String).returns(true);
        validator.validate
          .withArgs(2, undefined)
          .throws(
            new UnequalValueError(`Expected Number(2) to be a undefined`)
          );

        expect(collWithinValidator.validate(val, expectation, validator)).toBe(
          true
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
        expect(validator.validate).toHaveBeenCalledWith(2, undefined);
      });

      it(`returns true for object value with missing nested object properties`, () => {
        const collWithinValidator = new CollectionWithinValidator();
        const expectation = new CollectionWithin({
          first: String,
          second: {
            third: String,
          },
        });
        const val = {
          first: 'value',
        };

        const valStr = inspect(val, { compact: true });
        describer.describe.withArgs(val).returns(valStr);

        validator.validate.withArgs('value', String).returns(true);
        validator.validate
          .withArgs(undefined, {
            second: {
              third: String,
            },
          })
          .throws(
            new UnequalValueError(
              `(Key second in {"first":"value"}) - Expected undefined to be an Object`
            )
          );

        expect(collWithinValidator.validate(val, expectation, validator)).toBe(
          true
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
        expect(validator.validate).toHaveBeenCalledWith(undefined, {
          third: String,
        });
      });

      it(`returns true even for nested object value with other arbitrary keys and values`, () => {
        const collWithinValidator = new CollectionWithinValidator();

        const val = {
          first: 'value',
          second: {
            a: 'a-value',
            unexpected: 'unexpected-value',
          },
        };
        const expectation = new CollectionWithin({
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

        expect(collWithinValidator.validate(val, expectation, validator)).toBe(
          true
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
        expect(validator.validate).toHaveBeenCalledWith(
          { a: 'a-value', unexpected: 'unexpected-value' },
          { a: 'a-value' }
        );
      });
    });

    describe('invalid values', () => {
      it(`pass-through errors from type validator validation if provided object value contain nested properties that does not match expected one`, () => {
        const collWithinValidator = new CollectionWithinValidator();

        const expectation = new CollectionWithin({
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

        expect(() =>
          collWithinValidator.validate(val, expectation, validator)
        ).toThrow(
          UnequalValueError,
          `(Key 'foo.bar.b': Expected Number, got String("invalid-should-be-number") in {"foo":{"bar":{"a":"a-value","b":"b-invalid-not-a-number"},"baz":{"c":"c-value"}}})`
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('a-value', String);
        expect(validator.validate).toHaveBeenCalledWith(
          'b-invalid-not-a-number',
          Number
        );
      });
    });
  });
});
