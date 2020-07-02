import 'reflect-metadata';
import { KINDS } from '../constants/literal-keys';
import { WrapperPattern } from '../wrapper-pattern';
import { types } from '../types';
export declare class InstanceOf extends WrapperPattern implements types.Pattern {
    static kind: KINDS;
    onValidation(type: any): boolean;
    protected isValid(type: any): boolean;
}
