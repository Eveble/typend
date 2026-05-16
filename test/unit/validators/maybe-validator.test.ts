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
import { Maybe } from '../../../src/patterns/maybe';
import { MaybeValidator } from '../../../src/validators/maybe-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { types } from '../../../src/types';
import { ValidationError } from '../../../src/errors';

describe(`MaybeValidator`, () => {
  let validator: any;

  beforeEach(() => {
    validator = stubInterface<types.Validator>();
  });

  it(`extends PatternValidator`, () => {
    expect(MaybeValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of Maybe', () => {
        const maybeValidator = new MaybeValidator();
        expect(maybeValidator.canValidate(new Maybe(String))).toBe(true);
      });
    });

    describe('implicit expectation', () => {
      it('returns false for any other value that is not instance of Maybe', () => {
        const maybeValidator = new MaybeValidator();
        expect(maybeValidator.canValidate(undefined)).toBe(false);
        expect(maybeValidator.canValidate(null)).toBe(false);
        expect(maybeValidator.canValidate(true)).toBe(false);
        expect(maybeValidator.canValidate(false)).toBe(false);
      });
    });
  });

  describe('validation', () => {
    describe('valid values', () => {
      it('returns true for value as undefined', () => {
        const maybeValidator = new MaybeValidator();
        expect(
          maybeValidator.validate(undefined, new Maybe(String), validator)
        ).toBe(true);
      });

      it('returns true for value as null', () => {
        const maybeValidator = new MaybeValidator();
        expect(
          maybeValidator.validate(null, new Maybe(String), validator)
        ).toBe(true);
      });

      it('returns true on successful validation result of value matching expectation delegated to validator', () => {
        const maybeValidator = new MaybeValidator();
        const val = 'my-string';
        const maybe = new Maybe(String);
        validator.validate.withArgs(val, String).returns(true);

        expect(maybeValidator.validate(val, maybe, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith(val, String);
      });
    });

    describe('invalid values', () => {
      it('throws ValidationError on failed validation result of value not matching expectation delegated to validator', () => {
        const maybeValidator = new MaybeValidator();
        const val = 'my-string';
        const maybe = new Maybe(String);
        const error = new ValidationError('my-error');
        validator.validate.withArgs(val, String).throws(error);

        expect(() => maybeValidator.validate(val, maybe, validator)).toThrow(
          error
        );
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith(val, String);
      });
    });
  });
});
