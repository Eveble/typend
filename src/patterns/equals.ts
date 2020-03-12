import { isArray, isPlainObject } from 'lodash';
import { Pattern } from '../pattern';
import { InvalidTypeError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

export class Equals extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.EQUALS;

  /**
   * Ensures that provided expectations can be set on pattern.
   * @param expectation - Expectation that will be used to validate value.
   * @throws {InvalidTypeError}
   * Thrown if provided expectation is an array or plain object(use List or Collection patterns for that).
   */
  onValidation(expectation): boolean {
    if (isArray(expectation) || isPlainObject(expectation)) {
      throw new InvalidTypeError(
        `Equality pattern expectation is invalid. Expected expectation to not be an plain object nor an array, got ${Pattern.describer.describe(
          expectation
        )}`
      );
    }
    return true;
  }
}
