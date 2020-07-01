import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
import { Pattern } from '../pattern';

/**
 * Any value will be matching expectation.
 * @returns Returns the default behavior for validation of unknown values.
 * @example
 * ```ts
 * import { check, unknown, validate } from 'typend';
 *
 * check<unknown>(undefined);
 * check<unknown>(null);
 * check<unknown>('foo');
 *
 * validate(undefined, unknown);
 * validate(null, unknown);
 * validate('foo', unknown);
 * ```
 */
export class Unknown extends Pattern implements types.Pattern {
  public static kind = KINDS.UNKNOWN;
}
