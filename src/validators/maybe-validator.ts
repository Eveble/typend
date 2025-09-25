import { PatternValidator } from '../pattern-validator';
import { Maybe } from '../patterns/maybe';
import { types } from '../types';

export class MaybeValidator
  extends PatternValidator
  implements types.PatternValidator
{
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Maybe`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Maybe;
  }

  /**
   * Validates if value matches pattern expectation(is nil(undefined or null) or matches the pattern).
   * @param value - Value that is validated against expectation.
   * @param maybe -Explicit pattern as `Maybe` instance.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is an `undefined`|`null`(nil) or matches expectation, else throws.
   * @throws {ValidationError}
   * Thrown if the argument is not nil or matching expectation.
   */
  public validate(
    value: any,
    maybe: Maybe,
    validator: types.Validator
  ): boolean {
    if (value == null) {
      return true;
    }

    const expectation = maybe instanceof Maybe ? maybe[0] : maybe;

    return validator.validate(value, expectation);
  }
}
