import { InvalidTypeError, InvalidValueError } from '../errors';
import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
import { Integer } from '../patterns/integer';

export class IntegerValidator
  extends PatternValidator
  implements types.PatternValidator
{
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Integer`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Integer;
  }

  /**
   * Validates if value(number) is an integer.
   * @param value - Value that is validated against expectation.
   * @returns Returns `true` if value is an Integer, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value type is not a number.
   * @throws {InvalidValueError}
   * Thrown if the value is not a valid integer.
   */
  public validate(value: any): boolean {
    if (!(typeof value === 'number')) {
      throw new InvalidTypeError(
        `Expected Number, got %s`,
        this.describe(value)
      );
    }

    if (!Number.isInteger(value)) {
      throw new InvalidValueError(
        `Expected Integer, got %s`,
        this.describe(value)
      );
    }
    return true;
  }
}
