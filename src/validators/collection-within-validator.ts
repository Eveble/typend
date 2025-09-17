import { get, isEmpty } from 'lodash';
import { diff } from 'deep-diff';
import { PatternValidator } from '../pattern-validator';
import { InvalidTypeError } from '../errors';
import { getResolvablePath, isPlainObjectFast } from '../helpers';
import { CollectionWithin } from '../patterns/collection-within';
import { types } from '../types';

export class CollectionWithinValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns true if pattern is instance of `CollectionWithin`, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof CollectionWithin;
  }

  /**
   * Validates if value matches an `Object` with expected keys and values matching
   * the given expectations.
   * The value may also contain other keys with arbitrary values not defined in
   * pattern(equivalent of Meteor's `Match.ObjectIncluding`).
   * It also can omit nested `Object` properties(useful for building up
   * configuration a like objects).
   * @param value - Value that is validated against expectation.
   * @param collectionWithin - Explicit pattern as `CollectionWithin` instance.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is matching explicit `CollectionWithin` pattern even on nested missing object properties, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value is not an object.
   * @throws {ValidationError}
   * Thrown if the value does not match properties.
   */
  public validate(
    value: any,
    collectionWithin: CollectionWithin,
    validator: types.Validator
  ): boolean {
    if (!isPlainObjectFast(value)) {
      throw new InvalidTypeError(
        'Expected %s to be an Object',
        this.describe(value)
      );
    }

    const differences = diff(collectionWithin, value);
    if (differences === undefined || isEmpty(differences)) {
      return true;
    }
    for (const difference of differences) {
      if (difference === undefined || difference.path === undefined) {
        continue;
      }
      // Ensure that each difference in object is validated against expectation from same path
      const diffPath = difference.path.join('.');
      const key = getResolvablePath(diffPath, collectionWithin);
      const valueFromPath = get(value, key);
      const expectationFromPath = get(collectionWithin, key);
      try {
        validator.validate(valueFromPath, expectationFromPath);
      } catch (err) {
        if (
          err.message.includes('Unexpected key') ||
          err.message.includes('to be a undefined') ||
          err.message.includes('Expected undefined to be an Object')
        ) {
          continue;
        } else {
          const stringifiedValue = this.describe(value);
          throw new err.constructor(
            `(Key '${key}': ${err.message} in ${stringifiedValue})`
          );
        }
      }
    }
    return true;
  }
}
