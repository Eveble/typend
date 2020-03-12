import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { Void } from '../patterns/void';
import { ValidationError } from '../errors';

export class VoidValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Void`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Void;
  }

  /**
   * Validates if value matches pattern definition(undefined).
   * @returns Returns `true` for `undefined`, else thrwos.
   */
  public validate(value: any): boolean {
    if (value === undefined) {
      return true;
    }

    throw new ValidationError(
      'Expected no value, got %s',
      this.describe(value)
    );
  }
}
