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
import { Optional } from '../../../src/patterns/optional';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { OptionalValidator } from '../../../src/validators/optional-validator';
import { ValidationError } from '../../../src/errors';

describe(`Optional`, () => {
  let validator: any;

  beforeEach(() => {
    validator = mock<types.Validator>();
  });

  it(`extends PatternValidator`, () => {
    expect(OptionalValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of Optional', () => {
        const optionalValidator = new OptionalValidator();
        expect(optionalValidator.canValidate(new Optional(String))).toBe(true);
      });
    });

    describe('implicit expectation', () => {
      it('returns false for any other implicit expectation that is not instance of Optional', () => {
        const optionalValidator = new OptionalValidator();
        expect(optionalValidator.canValidate(undefined)).toBe(false);
        expect(optionalValidator.canValidate(null)).toBe(false);
        expect(optionalValidator.canValidate(true)).toBe(false);
        expect(optionalValidator.canValidate(false)).toBe(false);
      });
    });
  });

  describe('validation', () => {
    describe('valid values', () => {
      it('returns true for value as undefined', () => {
        const optionalValidator = new OptionalValidator();
        expect(
          optionalValidator.validate(undefined, new Optional(String), validator)
        ).toBe(true);
      });

      it('returns true on successful validation result of value matching expectation delegated to validator', () => {
        const optionalValidator = new OptionalValidator();
        const val = 'my-string';
        const optional = new Optional(String);
        validator.validate.calledWith(val, String).mockReturnValue(true);

        expect(optionalValidator.validate(val, optional, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith(val, String);
      });
    });

    describe('invalid values', () => {
      it('runs validation on non-null values against validator', () => {
        const optionalValidator = new OptionalValidator();

        const val = null;
        const optional = new Optional(String);
        const error = new ValidationError('my-error');

        validator.validate.calledWith(val, String).mockImplementation(() => {
          throw error;
        });

        expect(() =>
          optionalValidator.validate(val, optional, validator)
        ).toThrow(error);
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith(val, String);
      });

      it('throws ValidationError on failed validation result of value not matching expectation delegated to validator', () => {
        const optionalValidator = new OptionalValidator();

        const val = 'my-string';
        const optional = new Optional(String);
        const error = new ValidationError('my-error');

        validator.validate.calledWith(val, String).mockImplementation(() => {
          throw error;
        });

        expect(() =>
          optionalValidator.validate(val, optional, validator)
        ).toThrow(error);
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith(val, String);
      });
    });
  });
});
