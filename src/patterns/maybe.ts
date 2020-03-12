import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

export class Maybe extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.MAYBE;
}
