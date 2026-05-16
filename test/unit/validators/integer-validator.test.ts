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
import { Integer } from '../../../src/patterns/integer';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { IntegerValidator } from '../../../src/validators/integer-validator';
import { InvalidValueError, InvalidTypeError } from '../../../src/errors';

describe(`IntegerValidator`, () => {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(IntegerValidator.prototype).toBeInstanceOf(PatternValidator);
  });

  describe('evaluation', () => {
    describe('explicit expectation', () => {
      it('returns true for pattern instance of Integer', () => {
        const intValidator = new IntegerValidator();
        expect(intValidator.canValidate(new Integer())).toBe(true);
      });
    });

    describe('implicit expectation', () => {
      it('returns false for any other expectation that is not instance of Integer', () => {
        const intValidator = new IntegerValidator();
        expect(intValidator.canValidate(undefined)).toBe(false);
        expect(intValidator.canValidate(null)).toBe(false);
        expect(intValidator.canValidate(true)).toBe(false);
        expect(intValidator.canValidate(false)).toBe(false);
        expect(intValidator.canValidate(Number)).toBe(false);
        expect(intValidator.canValidate(1)).toBe(false);
      });
    });
  });

  describe('validation', () => {
    describe('valid values', () => {
      it('returns true for valid Integer as number literal', () => {
        const intValidator = new IntegerValidator();
        const integers: number[] = [
          Number.MAX_VALUE,
          -Number.MAX_VALUE,
          1,
          0,
          -1,
          -2147483648,
          2147483647,
        ];
        for (const value of integers) {
          const valueStr = inspect(value);
          describer.describe.withArgs(value).returns(valueStr);
          expect(
            intValidator.validate(value),
            `Expected Integer, got ${valueStr}`
          ).toBe(true);
        }
      });
    });

    describe('invalid values', () => {
      it('throws InvalidTypeError for any non number values', () => {
        const intValidator = new IntegerValidator();
        const invalidValues: any[] = [
          // String literal
          'abcd',
          // Boolean literal
          true,
          false,
          // Date
          new Date('2017-02-06T20:43:13.464Z'),
          // Regexp
          new RegExp(/fail/),
          /fail/,
          // Symbol
          Symbol('key'),
          // Map
          new Map([['key', 'value']]),
          // Errors
          new Error(),
          // Constructors
          String,
          Number,
        ];
        for (const invalidValue of invalidValues) {
          const invalidValueStr = inspect(invalidValue);
          describer.describe.withArgs(invalidValue).returns(invalidValueStr);

          expect(() => intValidator.validate(invalidValue)).toThrow(
            InvalidTypeError,
            `Expected Number, got ${invalidValueStr}`
          );
        }
      });

      it('throws InvalidValueError for floating point number literals', () => {
        const intValidator = new IntegerValidator();
        const integers: number[] = [1.1, 0.1, -1.1, Math.PI, -Math.PI];
        for (const value of integers) {
          const valueStr = inspect(value);
          describer.describe.withArgs(value).returns(valueStr);

          expect(() => intValidator.validate(value)).toThrow(
            InvalidValueError,
            `Expected Integer, got ${valueStr}`
          );
        }
      });

      it('throws InvalidValueError for infinity', () => {
        const intValidator = new IntegerValidator();
        const integers: number[] = [Infinity, -Infinity];
        for (const value of integers) {
          const valueStr = inspect(value);
          describer.describe.withArgs(value).returns(valueStr);

          expect(() => intValidator.validate(value)).toThrow(
            InvalidValueError,
            `Expected Integer, got ${valueStr}`
          );
        }
      });
    });
  });
});
