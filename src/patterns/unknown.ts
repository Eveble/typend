import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
import { Pattern } from '../pattern';

export class Unknown extends Pattern implements types.Pattern {
  public static kind = KINDS.UNKNOWN;
}
