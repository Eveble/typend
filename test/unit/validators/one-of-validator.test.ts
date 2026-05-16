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
import { OneOf } from '../../../src/patterns/one-of';
import { OneOfValidator } from '../../../src/validators/one-of-validator';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { ValidationError, NotAMemberError } from '../../../src/errors';

describe(`OneOf`, () => {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(OneOfValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of OneOf', () => {
        const oneOfValidator = new OneOfValidator();
        expect(oneOfValidator.canValidate(new OneOf(String, Number))).toBe(
          true
        );
      });
    });

    describe('implicit expectation', () => {
      it('returns false for any other implicit expectation that is not instance of OneOf', () => {
        const oneOfValidator = new OneOfValidator();
        expect(oneOfValidator.canValidate(undefined)).toBe(false);
        expect(oneOfValidator.canValidate(null)).toBe(false);
        expect(oneOfValidator.canValidate(true)).toBe(false);
        expect(oneOfValidator.canValidate(false)).toBe(false);
      });
    });
  });

  describe('validation', () => {
    describe('valid values', () => {
      it('returns true on successful validation of value matching first provided expectation on OneOf instance', () => {
        const oneOfValidator = new OneOfValidator();
        const val = 'my-string';
        const oneOf = new OneOf(String, Number);
        validator.validate.withArgs(val, String).returns(true);

        expect(oneOfValidator.validate(val, oneOf, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(1);
        expect(validator.validate).toHaveBeenCalledWith(val, String);
      });

      it('returns true on successful validation of value matching other then first provided expectation on OneOf instance', () => {
        const oneOfValidator = new OneOfValidator();
        const val = 2;
        const oneOf = new OneOf(String, Number);
        validator.validate.withArgs(val, String).returns(false);
        validator.validate.withArgs(val, Number).returns(true);

        expect(oneOfValidator.validate(val, oneOf, validator)).toBe(true);
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith(val, String);
        expect(validator.validate).toHaveBeenCalledWith(val, Number);
      });
    });

    describe('invalid values', () => {
      it('throws NotAMemberError on failed validation result of value not matching any of provided expectations delegated to validator and ensures that expectation is readable', () => {
        const oneOfValidator = new OneOfValidator();
        const val = 'my-string';
        const oneOf = new OneOf(String, Number);
        const error = new ValidationError('my-error');
        validator.validate.withArgs(val, String).throws(error);
        validator.validate.withArgs(val, Number).throws(error);

        const oneOfStr = inspect(oneOf);
        describer.describe.withArgs(oneOf).returns(oneOfStr);

        expect(() => oneOfValidator.validate(val, oneOf, validator)).toThrow(
          NotAMemberError,
          'Expected undefined to be one of: [Function: String], [Function: Number]'
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith(val, String);
        expect(validator.validate).toHaveBeenCalledWith(val, Number);
        expect(describer.describe).toHaveBeenCalledTimes(2);
        expect(describer.describe).toHaveBeenCalledWith(oneOf);
        expect(describer.describe).toHaveBeenCalledWith(val);
      });
    });
  });
});
