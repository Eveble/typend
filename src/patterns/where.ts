import { isFunction } from 'lodash';
import { isNativeType } from '@eveble/helpers';
import { Pattern } from '../pattern';
import { InvalidTypeError } from '../errors';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

/**
 * Validates value against expectation function.
 * @returns Returns `true` if expectation function is truthful for value, else throws.
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import { validate, ValidationError, PropTypes } from '../../../src/index';
 *
 * function validateFoo(value: string): boolean {
 *   if (value !== 'foo') {
 *     throw new ValidationError('my-error');
 *   }
 *   return true;
 * }
 *
 * validate('foo', PropTypes.where(validateFoo));
 *
 * expect(() => {
 *   validate('bar', PropTypes.where(validateFoo));
 * }).to.throw(ValidationError);
 * ```
 */
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
