import { Pattern } from '../pattern';
import { InvalidTypeError } from '../errors';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
import { isPlainObjectFast } from '../helpers';

/**
 * Validates an Object with the given keys and with values matching the given pattern.
 * The value must not contain any arbitrary keys(not listed in the pattern).
 * The value must be a plain Object or class instance.
 *
 * @returns Returns `true` if value is matching explicit `Collection` pattern or implicit
 * expectation as plain object, else throws.
 *
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import {
 *   check,
 *   validate,
 *   PropTypes,
 *   UnexpectedKeyError,
 * } from 'typend';
 *
 * check<Record<any, any>>({ foo: 'foo' });
 * check<Record<keyof any, any>>({ foo: 'foo' });
 * check<{}>({});
 * check<{ name: string; age: number }>({ name: 'Jane Doe', age: 28 });
 * check<Car>({ brand: 'Tesla' });
 *
 * // Explicit:
 * validate({}, PropTypes.object);
 * validate({ foo: 'foo' }, PropTypes.shape({ foo: 'foo' }));
 * validate(
 *   { name: 'Jane Doe', age: 28 },
 *   PropTypes.shape({
 *     name: String,
 *     age: Number,
 *   })
 * );
 * expect(() =>
 *   validate({ foo: 'foo', bar: 'bar' }, PropTypes.shape({ foo: 'foo' }))
 * ).to.throw(UnexpectedKeyError);
 *
 * // Implicit: you can omit defining explicit pattern(`Collection`) by passing plain object:
 * validate({ foo: 'foo' }, { foo: 'foo' });

 * // By default, validator will run in strict mode - so its equivalent of:
 * validate({ foo: 'foo' }, { foo: 'foo' }, true);
 * ```
 */
export class Collection extends Pattern implements types.Pattern {
  public static kind = KINDS.OBJECT;

  /**
   * Creates an instance of an Collection.
   * @param properties - Properties that will be used to validate value.
   * @throws {InvalidTypeError}
   * Thrown if provided properties is not an object.
   */
  constructor(properties: Record<keyof any, any> = {}) {
    super();
    if (!isPlainObjectFast(properties)) {
      throw new InvalidTypeError(
        `Collection properties are invalid. Expected properties to be a plain object, got ${this.describe(
          properties
        )}`
      );
    }
    Object.assign(this, properties);
  }
}
