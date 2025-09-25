import { isFunction, isArray } from 'lodash';
import { isErrorInstance, isNativeType } from '@eveble/helpers';
import { UnequalValueError, InvalidTypeError } from '../errors';
import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
import { Equals } from '../patterns/equals';
import { isPlainObjectFast } from '../helpers';

export class EqualsValidator
  extends PatternValidator
  implements types.PatternValidator
{
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns true if pattern is: instance of Equals, definition is Error instance, is not array or plain object; else false.
   */
  public canValidate(expectation: types.Expectation): boolean {
    if (expectation instanceof Equals) {
      return true;
    }
    // This validator allows reference based equality check for constructors,
    // however for simplicity sake we disallow reference checking on array
    // and object since this can be confusing for new developers(use Collection|List for that)
    if (isArray(expectation) || isPlainObjectFast(expectation)) {
      return false;
    }

    return true;
  }

  /**
   * Validates if value is equal to expectation.
   * @param value - Value that is validated against expectation.
   * @param equalsOrExpect - Explicit pattern as `Equals` instance or implicit expectation
   * against which value is validated.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is equal to expectation, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value is an array(use `List`, `Tuple`, `OneOf` patterns for array values).
   * @throws {InvalidTypeError}
   * Thrown if the value is a plain object(use `Collection` pattern for object values).
   * @throws {UnequalValueError}
   * Thrown if the value is not equal to the expectation.
   */
  public validate(value: any, equalsOrExpect: types.Expectation): boolean {
    if (isArray(value)) {
      throw new InvalidTypeError(
        `Expected %s to not be an Array`,
        this.describe(value)
      );
    }
    if (isPlainObjectFast(value)) {
      throw new InvalidTypeError(
        `Expected %s to not be a plain Object`,
        this.describe(value)
      );
    }

    const expectation =
      equalsOrExpect instanceof Equals ? equalsOrExpect[0] : equalsOrExpect;
    if (expectation === value) {
      return true;
    }

    let isValid = false;
    let errorMessage = 'Expected %s to be equal to %s';

    // nil
    if (value == null) {
      isValid = expectation === value;
      // RegExp
    } else if (expectation instanceof RegExp) {
      isValid = expectation.test(value);
      errorMessage = 'Expected %s to match %s';
      // Error instances
    } else if (isErrorInstance(expectation)) {
      isValid =
        expectation.message === value.message &&
        expectation.constructor === value.constructor;
      // ValueObject specific case helpers
    } else if (isFunction(expectation?.isSame)) {
      isValid = expectation.isSame(value);
      errorMessage = `Expected %s to pass %s is same evaluation`;
      // ValueObject
    } else if (isFunction(expectation?.equals)) {
      isValid = expectation.equals(value);
      errorMessage = `Expected %s to pass %s equality evaluation`;
      // Dates instances or other values with valueOf method
    } else if (
      !['string', 'number', 'boolean', 'symbol'].includes(typeof value) &&
      !(value instanceof Map) &&
      !isNativeType(value) &&
      !isNativeType(expectation) &&
      !isErrorInstance(value)
    ) {
      isValid = expectation.valueOf() === value.valueOf();
      errorMessage = `Expected %s value to be equal to %s`;
    }

    if (!isValid) {
      throw new UnequalValueError(
        errorMessage,
        this.describe(value),
        this.describe(expectation)
      );
    }

    return isValid;
  }
}
