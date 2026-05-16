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
import { Tuple } from '../../../src/patterns/tuple';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { TupleValidator } from '../../../src/validators/tuple-validator';
import {
  InvalidTypeError,
  NotAMemberError,
  ValidationError,
} from '../../../src/errors';
import { Optional } from '../../../src/patterns/optional';

describe(`TupleValidator`, () => {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = mock<types.Describer>();
    validator = mock<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(TupleValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of Tuple', () => {
        const tupleValidator = new TupleValidator();
        expect(tupleValidator.canValidate(new Tuple(String, Number))).toBe(
          true
        );
      });
    });

    describe('implicit expectation', () => {
      describe('valid', () => {
        it('returns true for array with single value expectation', () => {
          const tupleValidator = new TupleValidator();
          expect(tupleValidator.canValidate([String])).toBe(true);
        });

        it('returns true for array with two or more values expectation', () => {
          const tupleValidator = new TupleValidator();
          expect(tupleValidator.canValidate([String, Number])).toBe(true);
        });
      });

      describe('invalid', () => {
        it('returns false for non-array expectations', () => {
          const tupleValidator = new TupleValidator();
          expect(tupleValidator.canValidate({})).toBe(false);
          expect(tupleValidator.canValidate(true)).toBe(false);
          expect(tupleValidator.canValidate(false)).toBe(false);
          expect(tupleValidator.canValidate(undefined)).toBe(false);
          expect(tupleValidator.canValidate(null)).toBe(false);
        });

        it('returns false for empty array instance', () => {
          const tupleValidator = new TupleValidator();
          expect(tupleValidator.canValidate([])).toBe(false);
        });
      });
    });
  });

  describe('validation', () => {
    it(`throws InvalidTypeError when provided value is not an array`, () => {
      const tupleValidator = new TupleValidator();
      const value = {
        key: 'value',
      };
      const valueStr = inspect(value);

      describer.describe.mockReturnValue(valueStr);

      expect(() =>
        tupleValidator.validate(value, new Tuple(String), validator)
      ).toThrow(InvalidTypeError, `Expected ${valueStr} to be an Array`);
      expect(describer.describe).toHaveBeenCalled();
      expect(describer.describe).toHaveBeenCalledWith(value);
    });

    describe('valid values', () => {
      it(`iterates through each expectation item and validates them against validator`, () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string', 2];
        const tuple = new Tuple(String, Number);
        validator.validate
          .calledWith('my-string', String)
          .mockReturnValue(true);
        validator.validate.calledWith(2, Number).mockReturnValue(true);

        expect(tupleValidator.validate(val, tuple, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('my-string', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
      });
    });

    describe('invalid values', () => {
      it('throws NotAMemberError on failed validation result of value not matching one of provided expectations delegated to validator', () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string'];
        const tuple = new Tuple(Number);
        const error = new ValidationError('my-error');
        validator.validate
          .calledWith('my-string', Number)
          .mockImplementation(() => {
            throw error;
          });

        const tupleStr = inspect(tuple);
        describer.describe.calledWith(tuple).mockReturnValue(tupleStr);

        expect(() => tupleValidator.validate(val, tuple, validator)).toThrow(
          NotAMemberError,
          `Expected undefined to be matching an ${tupleStr}`
        );
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith('my-string', Number);
        expect(describer.describe).toHaveBeenCalledTimes(2);
        expect(describer.describe).toHaveBeenCalledWith(tuple);
        expect(describer.describe).toHaveBeenCalledWith(val);
      });

      it('throws NotAMemberError when there are more values in tuple then expected ones', () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string', 1234];
        const tuple = new Tuple(String);

        const error = new ValidationError('my-error');
        validator.validate
          .calledWith('my-string', String)
          .mockReturnValue(true);
        validator.validate
          .calledWith(1234, undefined)
          .mockImplementation(() => {
            throw error;
          });

        const valStr = inspect(val);
        const tupleStr = inspect(tuple);
        describer.describe.calledWith(val).mockReturnValue(valStr);
        describer.describe.calledWith(tuple).mockReturnValue(tupleStr);

        expect(() => tupleValidator.validate(val, tuple, validator)).toThrow(
          NotAMemberError,
          `Expected ${valStr} to be matching an ${tupleStr}`
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('my-string', String);
        expect(validator.validate).toHaveBeenCalledWith(1234, undefined);
        expect(describer.describe).toHaveBeenCalledTimes(2);
        expect(describer.describe).toHaveBeenCalledWith(tuple);
        expect(describer.describe).toHaveBeenCalledWith(val);
      });

      it('throws NotAMemberError when there are less values in tuple then expected ones', () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string'];
        const tuple = new Tuple(String, Number);

        const error = new ValidationError('my-error');
        validator.validate
          .calledWith('my-string', String)
          .mockReturnValue(true);
        validator.validate
          .calledWith(undefined, Number)
          .mockImplementation(() => {
            throw error;
          });

        const valStr = inspect(val);
        const tupleStr = inspect(tuple);
        describer.describe.calledWith(val).mockReturnValue(valStr);
        describer.describe.calledWith(tuple).mockReturnValue(tupleStr);

        expect(() => tupleValidator.validate(val, tuple, validator)).toThrow(
          NotAMemberError,
          `Expected ${valStr} to be matching an ${tupleStr}`
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('my-string', String);
        expect(validator.validate).toHaveBeenCalledWith(undefined, Number);
        expect(describer.describe).toHaveBeenCalledTimes(2);
        expect(describer.describe).toHaveBeenCalledWith(tuple);
        expect(describer.describe).toHaveBeenCalledWith(val);
      });

      it('does not throw NotAMemberError when there are less values in tuple then expected ones if they are optional', () => {
        const tupleValidator = new TupleValidator();
        const val = ['my-string', 2];
        const tuple = new Tuple(String, Number, new Optional(Boolean));

        validator.validate
          .calledWith('my-string', String)
          .mockReturnValue(true);
        validator.validate.calledWith(2, Number).mockReturnValue(true);
        validator.validate
          .calledWith(undefined, new Optional(Boolean))
          .mockReturnValue(true);

        expect(() =>
          tupleValidator.validate(val, tuple, validator)
        ).not.toThrow(NotAMemberError);

        expect(validator.validate).toHaveBeenCalledTimes(3);
        expect(validator.validate).toHaveBeenCalledWith('my-string', String);
        expect(validator.validate).toHaveBeenCalledWith(2, Number);
        expect(validator.validate).toHaveBeenCalledWith(
          undefined,
          new Optional(Boolean)
        );
        expect(describer.describe).not.toHaveBeenCalled();
      });
    });
  });
});
