import { Pattern } from '../pattern';
import { InvalidDefinitionError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

/**
 * Validates if value is matching one of the expectations.
 * @returns Returns `true` if value is matching one of expectations, else throws.
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import { check, OneOf, PropTypes, NotAMemberError, validate } from 'typend';
 *
 * check<string | number>('foo');
 * check<string | number>(1337);
 * expect(() => check<string | number>(true)).to.throw(NotAMemberError);
 *
 * validate('foo', PropTypes.oneOf(String, Number));
 * validate(1337, PropTypes.oneOf(String, Number));
 * validate('foo', new OneOf(String, Number));
 * validate(1337, new OneOf(String, Number));
 * ```
 */
export class OneOf extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.ONE_OF;

  /**
   * Ensures that provided expectations can be set on pattern.
   * @param expectations - Expectation that will be used for validation.
   * @throws {InvalidDefinitionError}
   * Thrown if provided array expectation does not have at least one element defined.
   */
  onValidation(...expectations: any[]): boolean {
    if (Array.isArray(expectations) && expectations.length < 1) {
      throw new InvalidDefinitionError(
        `OneOf expectation is invalid. Expectation must include at least one element defined like: <oneOf(String, Number, 'value')>, got ${Pattern.describer.describe(
          expectations
        )}`
      );
    }
    return true;
  }
}
