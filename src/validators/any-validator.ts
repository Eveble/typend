import { Any } from '../patterns/any';
import { PatternValidator } from '../pattern-validator';
import { types } from '../types';

export class AnyValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` or implicit expectation.
   * @returns Returns true if pattern is instance of `Any`, else false.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Any;
  }

  /**
   * Any value will be matching expectation.
   * @returns Returns always `true` for any value.
   */
  public validate(): boolean {
    return true;
  }
}
