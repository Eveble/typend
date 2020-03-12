import { isFunction } from 'lodash';
import { isNativeType } from '@eveble/helpers';
import { Pattern } from '../pattern';
import { InvalidTypeError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

export class Where extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.WHERE;

  /**
   * Ensures that provided expectations can be set on pattern.
   * @param expectation - Validation function that will be used to validate value.
   * @throws {InvalidTypeError}
   * Thrown if provided expectation is not a function.
   */
  onValidation(expectation): boolean {
    if (
      !isFunction(expectation) ||
      isNativeType(expectation) ||
      [Symbol].includes(expectation as any)
    ) {
      throw new InvalidTypeError(
        `Where expectation is invalid. Expected expectation to be a Function, got ${Pattern.describer.describe(
          expectation
        )}`
      );
    }
    return true;
  }
}
