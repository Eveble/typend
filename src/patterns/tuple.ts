import { Pattern } from '../pattern';
import { InvalidDefinitionError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

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
