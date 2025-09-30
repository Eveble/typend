import 'reflect-metadata';
import { types } from './types';
import { Optional } from './patterns/optional';
export declare abstract class WrapperPattern extends Array {
    static kind: string | undefined;
    static describer: types.Describer;
    constructor(...expectations: any[]);
    get isOptional(): Optional;
    get isRequired(): any;
    static setDescriber(describer: types.Describer): void;
    static getDescriber(): types.Describer;
    describe(value: any): string;
    getKind(): string;
    onValidation(...expectations: any[]): boolean;
    setInitializer(initializer: any): void;
    hasInitializer(): boolean;
    getInitializer(): any | undefined;
}
