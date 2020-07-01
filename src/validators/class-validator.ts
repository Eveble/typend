import { get, isEmpty } from 'lodash';
import { diff } from 'deep-diff';
import { isClassInstance, getTypeName } from '@eveble/helpers';
import { PatternValidator } from '../pattern-validator';
import {
  UnexpectedKeyError,
  UnmatchedTypeError,
  InvalidTypeError,
} from '../errors';
import { getResolvablePath, isResolvablePath } from '../helpers';
import { types } from '../types';
import { Class } from '../patterns/class';

export class ClassValidator extends PatternValidator
  implements types.PatternValidator {
  /**
   * Evaluates if validator can handle provided expectation.
   * @param expectation - Evaluated explicit `Pattern` instance or implicit expectation.
   * @returns Returns `true` if pattern is instance of `Class` pattern, else `false`.
   */
  public canValidate(expectation: types.Expectation): boolean {
    return expectation instanceof Class;
  }

  /**
   * Validates value against `Class` with the given type and properties.
   * Properties must not contain any keys not listed in the pattern.
   * Properties argument must be an instance of plain `Object` with no special
   * prototype or instance of `Collection`.
   * @param value - Value that is validated against expectation.
   * @param pattern - Explicit pattern as `Class` instance.
   * @param validator - Validator matching `Validator` interface.
   * @returns Returns `true` if value is matching exactly `Class` pattern expectation.
   * @throws {InvalidTypeError}
   * Thrown if the value is not an class instance.
   * @throws {UnexpectedKeyError}
   * Thrown if the value has unexpected key.
   * @throws {ValidationError}
   * Thrown if the value does not match expectation.
   */
  public validate(
    value: any,
    pattern: Class,
    validator: types.Validator
  ): boolean {
    if (!isClassInstance(value)) {
      throw new InvalidTypeError(
        'Expected %s to be an instance of %s',
        this.describe(value),
        getTypeName(pattern.type) as string
      );
    }

    const properties = pattern.properties;

    const differences = diff(properties, value);
    if (differences === undefined || isEmpty(differences)) {
      return true;
    }
    for (const difference of differences) {
      if (difference === undefined || difference.path === undefined) {
        continue;
      }
      // Ensure that each difference in object is validated against property
      // expectation from same path
      const diffPath: string = difference.path.join('.');
      const key: string = getResolvablePath(diffPath, properties);

      if (!isResolvablePath(key, properties)) {
        const stringifiedValue = this.describe(value);
        throw new UnexpectedKeyError(
          `Unexpected key '%s' in %s`,
          diffPath,
          stringifiedValue
        );
      }

      const valueFromPath = get(value, key);
      const propertiesFromPath = get(properties, key);

      try {
        validator.validate(valueFromPath, propertiesFromPath);
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

    if (!(value instanceof pattern.type)) {
      throw new UnmatchedTypeError(
        `Expected %s to be a instance of %s`,
        this.describe(value),
        getTypeName(pattern.type) as string
      );
    }
    return true;
  }
}
