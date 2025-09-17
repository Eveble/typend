import {  get, isEmpty } from 'lodash';
import { diff } from 'deep-diff';
import { isClassInstance } from '@eveble/helpers';
import { PatternValidator } from '../pattern-validator';
import { InvalidTypeError, UnexpectedKeyError } from '../errors';
import { getResolvablePath, isPlainObjectFast, isResolvablePath } from '../helpers';
import { types } from '../types';
import { Collection } from '../patterns/collection';
import { Optional } from '../patterns/optional';

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
      (isStrict === true && isPlainObjectFast(expectation))
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
    collOrExpected: Collection | Record<keyof any, any>,
    validator: types.Validator
  ): boolean {
    // Early type validation
    if (!isClassInstance(value) && !isPlainObjectFast(value)) {
      throw new InvalidTypeError(
        'Expected %s to be an Object',
        this.describe(value)
      );
    }

    // Handle empty expectations early
    if (isEmpty(collOrExpected)) {
      return true;
    }

    const differences = diff(collOrExpected, value);
    if (differences === undefined || isEmpty(differences)) {
      return true;
    }

    // Pre-compute stringified value for error messages
    let stringifiedValue: string | undefined;
    const getStringifiedValue = () => {
      if (stringifiedValue === undefined) {
        stringifiedValue = this.describe(value);
      }
      return stringifiedValue;
    };

    for (const difference of differences) {
      if (difference === undefined || difference.path === undefined) {
        continue;
      }

      // Ensure that each difference in object is validated against expectation from same path
      let diffPath: string;
      // Case "optional array property on collection":
      // {prop: new Optional(new List('my-element'))}
      //   > referenced by diff tool on difference.path as `prop[0]`, so it would end up
      //     comparing first element from expectation without taking Optional pattern instance
      //     in to account(equal to failed validation)
      const joinedPath = difference.path.join('.');
      const optionalPath = joinedPath.replace('.0', '');

      if (get(collOrExpected, optionalPath) instanceof Optional) {
        diffPath = optionalPath;
      } else {
        diffPath = joinedPath;
      }

      const key: string = getResolvablePath(diffPath, collOrExpected);

      if (!isResolvablePath(key, collOrExpected)) {
        throw new UnexpectedKeyError(
          `Unexpected key '%s' in %s`,
          diffPath,
          getStringifiedValue()
        );
      }

      const valueFromPath = get(value, key);
      const expectationFromPath = get(collOrExpected, key);

      try {
        validator.validate(valueFromPath, expectationFromPath);
      } catch (err) {
        if (err.message.includes('to be a undefined')) {
          throw new UnexpectedKeyError(
            `Unexpected key '%s' in %s`,
            key,
            getStringifiedValue()
          );
        } else {
          throw new err.constructor(
            `(Key '${key}': ${err.message} in ${getStringifiedValue()})`
          );
        }
      }
    }
    return true;
  }
}
