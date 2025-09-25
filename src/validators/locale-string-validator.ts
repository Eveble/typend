import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { LocaleString } from '../patterns/locale-string';
import { ValidationError } from '../errors';

export class LocaleStringValidator
  extends PatternValidator
  implements types.PatternValidator
{
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `LocaleString`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof LocaleString;
  }

  /**
   * Validates if value is undefined.
   * @param value - Value that is validated against expectation.
   * @returns Returns `true` if value is an undefined or matches expectation, else throws.
   * @throws {ValidationError}
   * Thrown if the argument is not `undefined` or not matching expectation.
   */
  public validate(value: any): boolean {
    if (value === undefined || typeof value === 'string') {
      return true;
    }

    throw new ValidationError(
      'Expected value to never be assigned, got %s',
      this.describe(value)
    );
  }
}
