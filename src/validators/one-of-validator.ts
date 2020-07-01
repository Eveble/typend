import { isArray } from 'lodash';
import { PatternValidator } from '../pattern-validator';
import { NotAMemberError } from '../errors';
import { types } from '../types';
import { OneOf } from '../patterns/one-of';

export class OneOfValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `OneOf`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof OneOf;
  }

  /**
   * Validates if value matches one of the provided expectations.
   * @param value - Value that is validated against expectation.
   * @param oneOf - Explicit pattern as `OneOf` instance.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is matching one of expectation, else throws.
   * @throws {NotAMemberError}
   * Thrown if the value does not match any provided expectations.
   */
  public validate(
    value: any,
    oneOf: OneOf,
    validator: types.Validator
  ): boolean {
    for (const expectation of oneOf) {
      try {
        if (validator.validate(value, expectation)) {
          return true;
        }
      } catch (err) {}
    }

    let readableDef = this.describe(oneOf);
    if (!isArray(oneOf[0])) {
      readableDef = readableDef
        .replace(/^OneOf\([\d+]\) /, '')
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .trim();
    }

    throw new NotAMemberError(
      'Expected %s to be one of: %s',
      this.describe(value),
      readableDef
    );
  }
}
