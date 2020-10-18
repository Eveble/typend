import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

/**
 * Flags property as LocaleString.
 * @returns Returns `true` for undefined.
 * @example
 * ```ts
 * import { expect } from 'chai';
 * import { Pattern } from '../pattern';
 * import {
 *   check,
 *   LocaleString,
 *   InvalidValueError,
 *   validate,
 * } from 'typend';
 *
 * check<LocaleString>(undefined);
 * expect(() => check<LocaleString>(undefined)).to.not.throw(InvalidValueError);
 *
 * validate(undefined, LocaleString);
 * ```
 */
export class LocaleString extends Pattern implements types.Pattern {
  public static kind = KINDS.LOCALE_STRING;
}
