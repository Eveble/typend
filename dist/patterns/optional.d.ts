import { KINDS } from '../constants/literal-keys';
import { types } from '../types';
export declare class Optional extends Array implements types.Pattern {
    static kind: KINDS;
    static describer: types.Describer;
    constructor(...expectations: any[]);
    static setDescriber(describer: types.Describer): void;
    static getDescriber(): types.Describer;
    describe(value: any): string;
    getKind(): string;
    setInitializer(initializer: any): void;
    hasInitializer(): boolean;
    getInitializer(): any | undefined;
}
