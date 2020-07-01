import { Pattern } from '../pattern';
import { InvalidDefinitionError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

/**
 * Validates if value matches list expectation.
 * @returns Returns `true` if value is matching expectation list, else throws.
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import { check, validate, PropTypes, List, ValidationError } from 'typend';
 *
 * check<string[]>(['foo']);
 * expect(() => check<number>(['foo'])).to.throw(ValidationError);
 *
 * validate(['foo'], [String]);
 * validate(['foo'], PropTypes.arrayOf(String));
 * validate(['foo'], new List(String));
 * ```
 */
export class List extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.ARRAY;

  /**
   * Ensures that provided expectations can be set on pattern.
   * @param expectations - Expectations that will be used for validation.
   * @throws {InvalidDefinitionError}
   * Thrown if provided expectations has more then one argument.
   */
  onValidation(...expectations: any[]): boolean {
    if (expectations.length > 1 && expectations[0] !== Array) {
      throw new InvalidDefinitionError(
        `List expectation is invalid. Expected expectation to have maximum of one argument, got ${Pattern.describer.describe(
          expectations
        )}`
      );
    }
    return true;
  }
}
