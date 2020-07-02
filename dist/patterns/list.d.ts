import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';
export declare class List extends WrapperPattern implements types.Pattern {
    static kind: KINDS;
    onValidation(...expectations: any[]): boolean;
}
