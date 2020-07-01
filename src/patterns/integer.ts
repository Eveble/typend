import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

/**
 * Validates if value(number) is an integer.
 * @returns Returns `true` if value is an integer, else throws.
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import {
 *   check,
 *   integer,
 *   Integer,
 *   InvalidValueError,
 *   validate,
 * } from 'typend';
 *
 * check<integer>(10);
 * expect(() => check<integer>(Math.PI)).to.throw(InvalidValueError);
 *
 * validate(10, Integer);
 * validate(10, integer);
 * ```
 */
export class Integer extends Pattern implements types.Pattern {
  public static kind = KINDS.INTEGER;
}
