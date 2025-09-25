import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
import { Pattern } from '../pattern';
export declare class Unknown extends Pattern implements types.Pattern {
    static kind: KINDS;
}
