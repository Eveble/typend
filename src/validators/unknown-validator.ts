import { Unknown } from '../patterns/unknown';
import { PatternValidator } from '../pattern-validator';
import { types } from '../types';

export class UnknownValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` or implicit expectation.
   * @returns Returns true if pattern is instance of `Unknown`, else false.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Unknown;
  }

  /**
   * Validates if value matches pattern(any value can be valid).
   * @returns Returns always `true` for any value.
   */
  public validate(): boolean {
    return true;
  }
}
