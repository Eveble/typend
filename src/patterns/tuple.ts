import { Pattern } from '../pattern';
import { InvalidDefinitionError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

/**
 * Validates if value is matching tuple expectation.
 * @returns Returns `true` if value is matching tuple expectation, else throws.
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import {
 *   check,
 *   validate,
 *   tuple,
 *   Tuple,
 *   PropTypes,
 *   NotAMemberError,
 * } from 'typend';
 *
 * check<[string, number]>(['foo', 1337]);
 * expect(() => check<[string]>(['foo', 1234])).to.throw(
 *   NotAMemberError
 * );
 * expect(() => check<[string, number]>(['foo', 'bar'])).to.throw(
 *   NotAMemberError
 * );
 *
 * validate(['foo', 1337], [String, Number]);
 * validate(['foo', 1337], PropTypes.tuple(String, Number));
 * validate(['foo', 1337], tuple(String, Number));
 * validate(['foo', 1337], new Tuple(String, Number));
 * ```
 */
export class Tuple extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.TUPLE;

  /**
   * Ensures that provided expectations can be set on pattern.
   * @param expectations - Expectation that will be used for validation.
   * @throws {InvalidDefinitionError}
   * Thrown if provided array expectation does not have at least one element defined.
   */
  onValidation(...expectations: any[]): boolean {
    if (Array.isArray(expectations) && expectations.length === 0) {
      throw new InvalidDefinitionError(
        `Tuple expectation is invalid. Expectation must include at least one argument defined like: <tuple(String, Number, 'value')>, got ${Pattern.describer.describe(
          expectations
        )}`
      );
    }
    return true;
  }
}
