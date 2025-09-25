import { expect } from 'chai';
import {
  Pattern,
  types,
  InvalidTypeError,
  InvalidValueError,
  PatternValidator,
  typend,
  check,
  validate,
  UnmatchedTypeError,
} from '../../../src';
import { WrapperPattern } from '../../../src/wrapper-pattern';

describe('03-create-pattern', () => {
  it('matcher', () => {
    class PositiveNumber extends Pattern implements types.Pattern {
      public static kind = 'positiveNumber';
    }

    class PositiveNumberValidator
      extends PatternValidator
      implements types.PatternValidator
    {
      public canValidate(expectation: types.Expectation): boolean {
        return expectation instanceof PositiveNumber;
      }

      public validate(value: any): boolean {
        if (!(typeof value === 'number')) {
          throw new InvalidTypeError(
            `Expected Number, got %s`,
            PatternValidator.describer.describe(value)
          );
        }

        if (value < 1) {
          throw new InvalidValueError(
            `Expected positive number, got %s`,
            PatternValidator.describer.describe(value)
          );
        }
        return true;
      }
    }

    typend.validator.registerValidator(
      'positiveNumber',
      new PositiveNumberValidator()
    );

    check<PositiveNumber>(1);

    expect(() => check<PositiveNumber>(-1)).to.throw(InvalidValueError);

    validate(1, PositiveNumber);

    expect(() => validate(-1, PositiveNumber)).to.throw(InvalidValueError);
  });

  it('container', () => {
    class Optional extends WrapperPattern implements types.Pattern {
      public static kind = 'optional2';
    }

    class OptionalValidator implements types.PatternValidator {
      public canValidate(expectation: types.Expectation): boolean {
        return expectation instanceof Optional;
      }

      public validate(
        value: any,
        optional: Optional,
        validator: types.Validator
      ): boolean {
        if (value === undefined) {
          return true;
        }
        const expectation =
          optional instanceof Optional ? optional[0] : optional;
        return validator.validate(value, expectation);
      }
    }
    typend.validator.registerValidator('optional2', new OptionalValidator());
    typend.validator.overrideValidator('optional2', new OptionalValidator());

    validate(undefined, new Optional(String));
    validate('foo', new Optional(String));
    expect(() => validate(1234, new Optional(String))).to.throw(
      UnmatchedTypeError
    );
  });
});
