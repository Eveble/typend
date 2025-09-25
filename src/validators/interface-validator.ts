import { get, isEmpty } from 'lodash';
import { diff } from 'deep-diff';
import { isClassInstance } from '@eveble/helpers';
import { Interface } from '../patterns/interface';
import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
import { getResolvablePath, isPlainObjectFast } from '../helpers';
import { InvalidTypeError } from '../errors';

export class InterfaceValidator
  extends PatternValidator
  implements types.PatternValidator
{
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Interface` pattern, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Interface;
  }

  /**
   * Validates value against `Interface` pattern requiring it to match expected
   * properties and available methods(compared only by name - and not by with method parameters).
   * The value may also contain other keys with arbitrary values not defined in
   * pattern(equivalent of Meteor's `Match.ObjectIncluding`).
   * @param value - Value that is validated against expectation.
   * @param interface - Explicit pattern as `Interface` instance.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is matching exactly `Interface` pattern expectation, else throws.
   * @throws {InvalidTypeError}
   * Thrown if the value is not an class instance.
   * @throws {ValidationError}
   * Thrown if the value does not match expectation.
   */
  public validate(
    value: any,
    pattern: Interface,
    validator: types.Validator
  ): boolean {
    if (!isClassInstance(value) && !isPlainObjectFast(value)) {
      throw new InvalidTypeError(
        'Expected %s to be an Object or class instance',
        this.describe(value)
      );
    }
    /*
    Handle TypScript expectations decelerated as:

    Record<keyof any, any>
    { [key: string]: any }

    and similar.
    */
    if (isEmpty(pattern)) {
      return true;
    }

    const differences = diff(pattern, value);
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
      const key = getResolvablePath(diffPath, pattern);
      const valueFromPath = get(value, key);

      const expectationFromPath = get(pattern, key);
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
