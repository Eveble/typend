import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';
export declare class Where extends WrapperPattern implements types.Pattern {
    static kind: KINDS;
    onValidation(expectation: any): boolean;
}
