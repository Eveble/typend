import { isPlainObject } from 'lodash';
import { Pattern } from '../pattern';
import { InvalidTypeError } from '../errors';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

/**
 * Validates if value matches an `Object` with expected keys and values matching
 * the given expectations.
 * The value may also contain other keys with arbitrary values not defined in
 * pattern(equivalent of Meteor's `Match.ObjectIncluding`).
 *
 * @returns Returns `true` if value is matching explicit `CollectionIncluding` pattern
 * or implicit expectation as plain object even with arbitrary keys, else throws.
 *
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import { validate, ValidationError, CollectionIncluding } from 'typend';
 *
 * expect(validate({ foo: 'foo' }, new CollectionIncluding({ foo: 'foo' }))).to.be
 *   .true;
 *
 * expect(
 *   validate({ foo: 'foo', bar: 'bar' }, new CollectionIncluding({ foo: 'foo' }))
 * ).to.be.true;
 *
 * expect(() =>
 *   validate(
 *     { foo: 'NOT_foo', bar: 'bar' },
 *     new CollectionIncluding({ foo: 'foo' })
 *   )
 * ).to.throw(ValidationError);
 *
 * // You can omit defining explicit pattern(`CollectionIncluding`) by passing plain  object in loose mode:
 * validate({ foo: 'foo' }, { foo: 'foo' }, false);
 * ```
 */
export class CollectionIncluding extends Pattern implements types.Pattern {
  public static kind = KINDS.OBJECT_INCLUDING;

  /**
   * Creates an instance of an ObjectPattern.
   * @param properties - Properties that will be used to validate value.
   * @throws {InvalidTypeError}
   * Thrown if provided properties is invalid(is not an object).
   */
  constructor(properties: Record<keyof any, any>) {
    super();
    if (!isPlainObject(properties)) {
      throw new InvalidTypeError(
        `CollectionIncluding properties are invalid. Expected properties to be a plain object, got ${this.describe(
          properties
        )}`
      );
    }
    Object.assign(this, properties);
  }
}
