import { get, isEmpty } from 'lodash';
import { diff } from 'deep-diff';
import { PatternValidator } from '../pattern-validator';
import { InvalidTypeError } from '../errors';
import { getResolvablePath, isPlainObjectFast } from '../helpers';
import { types } from '../types';
import { CollectionIncluding } from '../patterns/collection-including';

export class CollectionIncludingValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided explicit pattern or implicit expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `CollectionIncluding` or is plain `Object` validated in loose mode, else `false`.
   */
  public canValidate(
    expectation: types.Expectation,
    isStrict?: boolean
  ): boolean {
    return (
      expectation instanceof CollectionIncluding ||
      (!isStrict && isPlainObjectFast(expectation))
    );
  }

  /**
   * Validates if value matches an `Object` with expected keys and values matching
   * the given expectations.
   * The value may also contain other keys with arbitrary values not defined in
   * pattern(equivalent of Meteor's `Match.ObjectIncluding`).
   * @param value - Value that is validated against expectation.
   * @param collIncOrExpect - Explicit pattern as `CollectionIncluding` instance or implicit expectation as plain `Object` against which value is validated.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is matching explicit `CollectionIncluding` pattern or implicit expectation as plain object even with arbitrary keys, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value is not an object.
   * @throws {ValidationError}
   * Thrown if the value does not match properties.
   */
  public validate(
    value: any,
    collIncOrExpect: CollectionIncluding | Record<keyof any, any>,
    validator: types.Validator
  ): boolean {
    if (!isPlainObjectFast(value)) {
      throw new InvalidTypeError(
        'Expected %s to be an Object',
        this.describe(value)
      );
    }

    const differences = diff(collIncOrExpect, value);
    if (differences === undefined || isEmpty(differences)) {
      return true;
    }
    for (const difference of differences) {
      if (
        difference === undefined ||
        // Omit new entries, interfaces should allow arbitrary values
        difference.kind === 'N' ||
        difference.path === undefined
      ) {
        continue;
      }
      // Ensure that each difference in object is validated against expectation from same path
      const diffPath = difference.path.join('.');
      const key = getResolvablePath(diffPath, collIncOrExpect);
      const valueFromPath = get(value, key);
      const expectationFromPath = get(collIncOrExpect, key);

      try {
        validator.validate(valueFromPath, expectationFromPath);
      } catch (err) {
        if (
          err.message.includes('Unexpected key') ||
          err.message.includes('to be a undefined')
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
