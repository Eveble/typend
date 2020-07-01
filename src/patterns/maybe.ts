import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

/**
 * Validates if value is nil or matches expectation.
 * @returns Returns `true` if value is an `undefined`|`null`(nil) or matches expectation, else throws.
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import { maybe, Maybe, PropTypes, ValidationError, validate } from 'typend';
 *
 * validate(undefined, PropTypes.maybe(String));
 * validate(null, PropTypes.maybe(String));
 * validate('foo', PropTypes.maybe(String));
 * validate('foo', new Maybe(String));
 * expect(() => validate('foo', maybe('baz'))).to.throw(ValidationError);
 * ```
 */
export class Maybe extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.MAYBE;
}
