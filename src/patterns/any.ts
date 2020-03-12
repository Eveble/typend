import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';

export class Any extends Pattern implements types.Pattern {
  public static kind = KINDS.ANY;
}
