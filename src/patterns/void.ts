import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

/**
 * Value can't be assigned(must be undefined).
 * @returns Returns always `true` for undefined, else throws.
 * @example
 * ```ts
 * import { check, validate, voided } from 'typend';
 *
 * check<void>(undefined);
 *
 * validate(undefined, voided);
 * ```
 */
export class Void extends Pattern implements types.Pattern {
  public static kind = KINDS.VOID;
}
