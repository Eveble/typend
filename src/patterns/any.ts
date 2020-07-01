import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

/**
 * @returns Returns always `true` for any value.
 * @example
 * ```ts
 * import { check, validate, any } from 'typend';
 *
 * check<any>('foo');
 *
 * validate('foo', any);
 * ```
 */
export class Any extends Pattern implements types.Pattern {
  public static kind = KINDS.ANY;
}
