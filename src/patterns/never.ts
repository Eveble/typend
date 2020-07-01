import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

/**
 * Value can't be assigned(must be undefined).
 * @returns Returns always `true` for undefined, else throws.
 * @example
 * ```ts
 * import { check, never, PropTypes, validate } from 'typend';
 *
 * check<never>(undefined);
 * validate(undefined, never);
 * validate(undefined, PropTypes.never);
 * ```
 */
export class Never extends Pattern implements types.Pattern {
  public static kind = KINDS.NEVER;
}
