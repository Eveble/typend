import { isPlainObject, get, isEmpty } from 'lodash';
import { diff } from 'deep-diff';
import { isClassInstance } from '@eveble/helpers';
import { PatternValidator } from '../pattern-validator';
import { InvalidTypeError, UnexpectedKeyError } from '../errors';
import { getResolvablePath, isResolvablePath } from '../helpers';
import { types } from '../types';
import { Collection } from '../patterns/collection';

export class CollectionValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Collection` or is plain `Object` validated in strict mode, else `false`.
   */
  public canValidate(
    expectation: types.Expectation,
    isStrict?: boolean
  ): boolean {
    return (
      expectation instanceof Collection ||
      (isStrict === true && isPlainObject(expectation))
    );
  }

  /**
   * Validates an `Object` with the given keys and with values matching the given
   * patterns. The value must not contain any arbitrary keys(not listed in the pattern).
   * The value must be a plain `Object` or class instance.
   * @param value - Value that is validated against expectation..
   * @param collOrExpect - Explicit pattern as `Collection` instance or implicit expectation as plain object against which value is validated.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is matching explicit `Collection` pattern or implicit expectation as plain object, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value is not an object, instance of Collection or class.
   * @throws {UnexpectedKeyError}
   * Thrown if the value has unexpected key.
   * @throws {ValidationError}
   * Thrown if the value does not match expected properties.
   */
  public validate(
    value: any,
    collOrExpect: Collection | Record<keyof any, any>,
    validator: types.Validator
  ): boolean {
    if (!isClassInstance(value) && !isPlainObject(value)) {
      throw new InvalidTypeError(
        'Expected %s to be an Object',
        this.describe(value)
      );
    }
    /*
    Handle TypScript expectations decelerated as:

    Record<keyof any, any>
    { [key: string]: any }

    and similar.
    */
    if (isEmpty(collOrExpect)) {
      return true;
    }

    const differences = diff(collOrExpect, value);
    if (differences === undefined || isEmpty(differences)) {
      return true;
    }
    for (const difference of differences) {
      if (difference === undefined || difference.path === undefined) {
        continue;
      }
      // Ensure that each difference in object is validated against expectation from same path
      const diffPath: string = difference.path.join('.');
      const key: string = getResolvablePath(diffPath, collOrExpect);

      if (!isResolvablePath(key, collOrExpect)) {
        const stringifiedValue = this.describe(value);
        throw new UnexpectedKeyError(
          `Unexpected key '%s' in %s`,
          diffPath,
          stringifiedValue
        );
      }

      const valueFromPath = get(value, key);
      const expectationFromPath = get(collOrExpect, key);

      try {
        validator.validate(valueFromPath, expectationFromPath);
      } catch (err) {
        const stringifiedValue = this.describe(value);
        if (err.message.includes('to be a undefined')) {
          throw new UnexpectedKeyError(
            `Unexpected key '%s' in %s`,
            key,
            stringifiedValue
          );
        } else {
          throw new err.constructor(
            `(Key '${key}': ${err.message} in ${stringifiedValue})`
          );
        }
      }
    }
    return true;
  }
}
