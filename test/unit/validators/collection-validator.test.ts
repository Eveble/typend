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
import { Collection } from '../../../src/patterns/collection';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { CollectionValidator } from '../../../src/validators/collection-validator';
import {
  UnequalValueError,
  InvalidTypeError,
  UnexpectedKeyError,
  ValidationError,
} from '../../../src/errors';

describe(`CollectionValidator`, () => {
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
    expect(CollectionValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of Collection', () => {
        const collValidator = new CollectionValidator();
        expect(collValidator.canValidate(new Collection({}))).toBe(true);
      });
    });

    describe('implicit expectation', () => {
      it('returns true for expectation as plain object in strict mode', () => {
        const collValidator = new CollectionValidator();
        expect(collValidator.canValidate({}, true)).toBe(true);
      });

      it('returns false for expectation as plain object in loose mode', () => {
        const collValidator = new CollectionValidator();
        expect(collValidator.canValidate({}, false)).toBe(false);
      });

      it('returns false for any other not matching expectation', () => {
        const collValidator = new CollectionValidator();
        expect(collValidator.canValidate(undefined)).toBe(false);
        expect(collValidator.canValidate(null)).toBe(false);
        expect(collValidator.canValidate(true)).toBe(false);
        expect(collValidator.canValidate(false)).toBe(false);
      });
    });
  });

  describe(`validation`, () => {
    it(`throws InvalidTypeError if provided value is not an plain object or class instance`, () => {
      const collValidator = new CollectionValidator();

      const val = ['value'];
      const expectation = {
        key: 'value',
      };
      const valStr = inspect(val);
      describer.describe.returns(valStr);

      expect(() => collValidator.validate(val, expectation, validator)).toThrow(
        InvalidTypeError,
        `Expected ${valStr} to be an Object`
      );
      expect(describer.describe).toHaveBeenCalled();
      expect(describer.describe).toHaveBeenCalledWith(val);
    });

    describe('valid values', () => {
      it(`iterates through each expected object entries and validates them against validator`, () => {
        const collValidator = new CollectionValidator();

        const val = {
          first: 'value',
          second: 2,
        };
        const expectation = {
          first: String,
          second: Number,
        };
        validator.validate.withArgs('value', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);

        expect(collValidator.validate(val, expectation, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
      });

      it(`iterates through each expected Collection entries and validates them against validator`, () => {
        const collValidator = new CollectionValidator();

        const val = {
          first: 'value',
          second: 2,
        };
        const pattern = new Collection({
          first: String,
          second: Number,
        });
        validator.validate.withArgs('value', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);

        expect(collValidator.validate(val, pattern, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
      });

      it(`allows to validate class instance`, () => {
        const collValidator = new CollectionValidator();

        const val = new MyClass({
          first: 'value',
          second: 2,
        });
        const expectation = {
          first: String,
          second: Number,
        };
        validator.validate.withArgs('value', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);

        expect(collValidator.validate(val, expectation, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
      });

      it(`returns true for empty instance of collection`, () => {
        const collValidator = new CollectionValidator();

        const val = new MyClass({
          first: 'value',
          second: 2,
        });
        const expectation = new Collection({});

        expect(collValidator.validate(val, expectation, validator)).toBe(true);
        expect(validator.validate).not.toHaveBeenCalled();
      });

      it(`returns true for empty instance of object`, () => {
        const collValidator = new CollectionValidator();

        const val = new MyClass({
          first: 'value',
          second: 2,
        });
        const expectation = {};

        expect(collValidator.validate(val, expectation, validator)).toBe(true);
        expect(validator.validate).not.toHaveBeenCalled();
      });
    });

    describe('invalid values', () => {
      it(`throws UnexpectedKeyError if provided object value contain keys not listed in
    the pattern`, () => {
        const collValidator = new CollectionValidator();

        const val = {
          first: 'value',
          second: 2,
        };
        const expectation = {
          first: String,
        };
        const valStr = JSON.stringify(val);
        describer.describe.withArgs(val).returns(valStr);
        validator.validate.withArgs('value', String).returns(true);
        validator.validate
          .withArgs(2, undefined)
          .throws(
            new UnequalValueError(`Expected Number(2) to be a undefined`)
          );

        expect(() =>
          collValidator.validate(val, expectation, validator)
        ).toThrow(UnexpectedKeyError, `Unexpected key 'second' in ${valStr}`);
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith('value', String);
      });

      it(`pass-through errors from type validator validation if provided object value contain nested properties that does not match expected ones`, () => {
        const collValidator = new CollectionValidator();

        const expectation = {
          foo: {
            bar: {
              a: String,
              b: Number,
            },
            baz: {
              c: 'value',
            },
          },
        };
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
          collValidator.validate(val, expectation, validator)
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

      it(`throws UnexpectedKeyError if provided object value contain nested keys not listed in the expectation`, () => {
        const collValidator = new CollectionValidator();

        const expectation = {
          foo: {
            bar: {
              a: String,
              b: Number,
            },
            baz: {
              c: 'c-value',
            },
          },
        };
        const val = {
          foo: {
            bar: {
              a: 'a-value',
              b: 2,
            },
            baz: {
              c: 'c-value',
              unexpected: 'unexpected',
            },
          },
        };
        const valStr = JSON.stringify(val);
        describer.describe.withArgs(val).returns(valStr);

        validator.validate.withArgs('a-value', String).returns(true);
        validator.validate.withArgs(2, Number).returns(true);
        validator.validate.withArgs('c-value', String).returns(true);
        validator.validate
          .withArgs(
            {
              c: 'c-value',
              unexpected: 'unexpected',
            },
            {
              c: 'c-value',
            }
          )
          .throws(
            new UnexpectedKeyError(
              `Unexpected key 'unexpected' in {"c":"value","unexpected":"unexpected"}`
            )
          );

        expect(() =>
          collValidator.validate(val, expectation, validator)
        ).toThrow(
          ValidationError,
          `(Key 'foo.baz': Unexpected key 'unexpected' in {"c":"value","unexpected":"unexpected"} in {"foo":{"bar":{"a":"a-value","b":2},"baz":{"c":"c-value","unexpected":"unexpected"}}})`
        );
        expect(validator.validate).toHaveBeenCalledTimes(3);
        expect(validator.validate).toHaveBeenCalledWith('a-value', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
        expect(validator.validate).toHaveBeenCalledWith(
          {
            c: 'c-value',
            unexpected: 'unexpected',
          },
          {
            c: 'c-value',
          }
        );
      });
    });
  });
});
