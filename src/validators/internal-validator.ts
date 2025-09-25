import { types } from '../types';
import { Internal } from '../patterns/internal';
import { AnyValidator } from './any-validator';

export class InternalValidator
  extends AnyValidator
  implements types.PatternValidator
{
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Internal`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Internal;
  }

  /**
   * Validates if value matches expectation(any internal value can be valid).
   * @returns Returns always `true` for any value.
   */
  public validate(): boolean {
    return true;
  }
}
