import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { inspect } from 'util';
import { Integer } from '../../../src/patterns/integer';
import { types } from '../../../src/types';
import { PatternValidator } from '../../../src/pattern-validator';
import { IntegerValidator } from '../../../src/validators/integer-validator';
import { InvalidValueError, InvalidTypeError } from '../../../src/errors';

describe(`IntegerValidator`, function () {
  let describer: any;

  beforeEach(() => {
    describer = stubInterface<types.Describer>();
    PatternValidator.setDescriber(describer);
  });

  it(`extends PatternValidator`, () => {
    expect(IntegerValidator.prototype).to.instanceof(PatternValidator);
  });

  describe('evaluation', () => {
    context('explicit expectation', () => {
      it('returns true for pattern instance of Integer', () => {
        const intValidator = new IntegerValidator();
        expect(intValidator.canValidate(new Integer())).to.be.true;
      });
    });

    context('implicit expectation', () => {
      it('returns false for any other expectation that is not instance of Integer', () => {
        const intValidator = new IntegerValidator();
        expect(intValidator.canValidate(undefined)).to.be.false;
        expect(intValidator.canValidate(null)).to.be.false;
        expect(intValidator.canValidate(true)).to.be.false;
        expect(intValidator.canValidate(false)).to.be.false;
        expect(intValidator.canValidate(Number)).to.be.false;
        expect(intValidator.canValidate(1)).to.be.false;
      });
    });
  });

  describe('validation', () => {
    context('valid values', () => {
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
          ).to.true;
        }
      });
    });

    context('invalid values', () => {
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

          expect(() => intValidator.validate(invalidValue)).to.throw(
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

          expect(() => intValidator.validate(value)).to.throw(
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

          expect(() => intValidator.validate(value)).to.throw(
            InvalidValueError,
            `Expected Integer, got ${valueStr}`
          );
        }
      });
    });
  });
});
