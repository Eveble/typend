import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { Never } from '../patterns/never';
import { ValidationError } from '../errors';

export class NeverValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Never`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Never;
  }

  /**
   * Validates if value matches pattern expectation(undefined).
   * @returns Returns `true` for `undefined`, else throws.
   */
  public validate(value: any): boolean {
    if (value === undefined) {
      return true;
    }

    throw new ValidationError(
      'Expected value to never be assigned, got %s',
      this.describe(value)
    );
  }
}
