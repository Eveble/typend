import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';

export class Unrecognized extends WrapperPattern implements types.Pattern {
  public static kind = KINDS.UNRECOGNIZED;
}
