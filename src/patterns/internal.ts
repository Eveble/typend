import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

export class Internal extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.INTERNAL;
}
