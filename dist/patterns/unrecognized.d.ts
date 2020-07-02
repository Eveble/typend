import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';
export declare class Unrecognized extends WrapperPattern implements types.Pattern {
    static kind: KINDS;
}
