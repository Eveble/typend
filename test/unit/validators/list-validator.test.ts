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
import { ListValidator } from '../../../src/validators/list-validator';
import { PatternValidator } from '../../../src/pattern-validator';
import { types } from '../../../src/types';
import { List } from '../../../src/patterns/list';
import {
  InvalidTypeError,
  UnmatchedTypeError,
  ValidationError,
} from '../../../src/errors';

describe(`ListValidator`, () => {
  let describer: any;
  let validator: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    validator = stubInterface<types.Validator>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(ListValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of List', () => {
        const listValidator = new ListValidator();
        expect(listValidator.canValidate(new List([]))).toBe(true);
      });
    });

    describe('implicit expectation', () => {
      describe('valid', () => {
        it('returns true for Array constructor expectation', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate(Array)).toBe(true);
        });

        it('returns true for empty array expectation', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate([])).toBe(true);
        });

        it('returns true for array with single value expectation', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate([String])).toBe(true);
        });
      });

      describe('invalid', () => {
        it('returns false for non-array expectations', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate({})).toBe(false);
        });

        it('returns false for array with more then one value', () => {
          const listValidator = new ListValidator();
          expect(listValidator.canValidate([String, Number])).toBe(false);
        });
      });
    });
  });

  describe('validation', () => {
    it(`throws InvalidTypeError when provided value is not an array`, () => {
      const listValidator = new ListValidator();
      const value = {
        key: 'value',
      };
      const valueStr = inspect(value);

      describer.describe.returns(valueStr);

      expect(() =>
        listValidator.validate(value, new List(Array), validator)
      ).toThrow(InvalidTypeError, `Expected ${valueStr} to be an Array`);
      expect(describer.describe).toHaveBeenCalled();
      expect(describer.describe).toHaveBeenCalledWith(value);
    });

    it('ensures that expectation is pulled from List instance correctly', () => {
      const listValidator = new ListValidator();
      const value = [String];
      const expectation = new List(Array);

      expect(listValidator.validate(value, expectation, validator)).toBe(true);
    });

    describe('expectation requires value to be just an array', () => {
      it('returns true for any value as an array if provided expectation is Array constructor', () => {
        const listValidator = new ListValidator();
        const value = [String];
        const expectation = Array;

        expect(listValidator.validate(value, expectation, validator)).toBe(
          true
        );
      });

      it('returns true for any value as an array if provided expectation is empty Array instance', () => {
        const listValidator = new ListValidator();
        const value = [String];
        const expectation = [];

        expect(listValidator.validate(value, expectation, validator)).toBe(
          true
        );
      });
    });

    describe('expectation requires value to match', () => {
      it('returns true for value as an array matching provided expectation ', () => {
        const listValidator = new ListValidator();
        const value = ['first', 'second'];
        const expectation = [String];

        validator.validate.withArgs('first', String).returns(true);
        validator.validate.withArgs('second', String).returns(true);

        expect(listValidator.validate(value, expectation, validator)).toBe(
          true
        );
        expect(validator.validate).toHaveBeenCalledTimes(2);
        expect(validator.validate).toHaveBeenCalledWith('first', String);
        expect(validator.validate).toHaveBeenCalledWith('second', String);
      });

      it('re-throws ValidationError for value as an array that does not match expectation ', () => {
        const error: ValidationError = new UnmatchedTypeError(
          'Expected Number(2) to be a String'
        );
        validator.validate.withArgs('first').returns(true);
        validator.validate.withArgs(2).throws(error);

        const listValidator = new ListValidator();
        const value = ['first', 2];
        const valueStr = inspect(value);
        const expectation = [String];
        const expectationStr = inspect(expectation);

        describer.describe.withArgs(value).returns(valueStr);
        describer.describe.withArgs(expectation).returns(expectationStr);

        expect(() =>
          listValidator.validate(value, expectation, validator)
        ).toThrow(
          UnmatchedTypeError,
          `Expected ${valueStr} to be matching an ${expectationStr}`
        );
      });
    });
  });
});
