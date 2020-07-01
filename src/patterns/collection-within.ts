import { isPlainObject } from 'lodash';
import { Pattern } from '../pattern';
import { InvalidDefinitionError } from '../errors';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

/**
 * Validates if value matches an Object with expected keys and values matching the
 * given expectations. The value may also contain other keys with arbitrary values not
 * defined in pattern(equivalent of Meteor's `Match.ObjectIncluding`).

 * It also can omit nested  Object properties(useful for building up configuration a
 * like objects).
 *
 * @returns Returns true if value is matching explicit `CollectionWithin` pattern even
 * on nested missing object properties, else throws.
 *
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import {
 *  validate,
 *  CollectionWithin,
 *  ValidationError,
 * } from 'typend';
 *
 * const expectation = {
 *   included: {
 *     foo: 'foo',
 *   },
 *   omitted: {
 *     bar: 'bar',
 *   },
 * };
 *
 * expect(
 *   validate(
 *     { included: { foo: 'foo' }, omitted: { bar: 'bar' } },
 *     new CollectionWithin(expectation)
 *   )
 * ).to.be.true;
 *
 * expect(
 *   validate({ included: { foo: 'foo' } }, new CollectionWithin(expectation))
 * ).to.be.true;
 *
 * expect(() =>
 *   validate(
 *     { included: { foo: 'NOT_foo' } },
 *     new CollectionWithin(expectation)
 *   )
 * ).to.throw(ValidationError);
 * ```
 */
export class CollectionWithin extends Pattern implements types.Pattern {
  public static kind = KINDS.OBJECT_WITHIN;

  /**
   * Creates an instance of an CollectionWithin.
   * @param properties - Properties that will be used to validate value.
   * @throws {InvalidDefinitionError}
   * Thrown if provided properties is invalid(is not an object).
   */
  constructor(properties: Record<keyof any, any>) {
    super();
    if (!isPlainObject(properties)) {
      throw new InvalidDefinitionError(
        `CollectionWithin properties is invalid. Expected properties to be a plain object, got ${this.describe(
          properties
        )}`
      );
    }
    Object.assign(this, properties);
  }
}
