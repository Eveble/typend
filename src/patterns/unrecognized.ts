import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

/**
 * Marks non-convertible arguments as `unrecognized`.
 * @returns Returns the default behavior for validation of unrecognized values.
 */
export class Unrecognized extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.UNRECOGNIZED;
}
