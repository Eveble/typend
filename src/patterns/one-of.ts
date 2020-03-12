import { Pattern } from '../pattern';
import { InvalidDefinitionError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

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
