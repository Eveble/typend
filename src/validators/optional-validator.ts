import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { Optional } from '../patterns/optional';

export class OptionalValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Optional`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Optional;
  }

  /**
   * Validates if value is undefined or matches the expectation.
   * @param value - Value that is validated against expectation.
   * @param optional - Explicit pattern as `Optional` instance.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is an undefined or matches expectation, else throws.
   * @throws {ValidationError}
   * Thrown if the argument is not `undefined` or not matching expectation.
   */
  public validate(
    value: any,
    optional: Optional,
    validator: types.Validator
  ): boolean {
    if (value === undefined) {
      return true;
    }
    const expectation = optional instanceof Optional ? optional[0] : optional;

    return validator.validate(value, expectation);
  }
}
