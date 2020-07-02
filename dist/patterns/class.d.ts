import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
import { Collection } from './collection';
export declare class Class extends Pattern implements types.Pattern {
    static kind: KINDS;
    type: types.Class;
    properties: Record<keyof any, any> | Collection;
    constructor(type: any, properties: types.Type);
}
