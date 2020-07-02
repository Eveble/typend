import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
export declare class Never extends Pattern implements types.Pattern {
    static kind: KINDS;
}
