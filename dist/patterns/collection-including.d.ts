import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
export declare class CollectionIncluding extends Pattern implements types.Pattern {
    static kind: KINDS;
    constructor(properties: Record<keyof any, any>);
}
