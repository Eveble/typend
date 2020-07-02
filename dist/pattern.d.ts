import 'reflect-metadata';
import { types } from './types';
import { Optional } from './patterns/optional';
export declare abstract class Pattern extends Object {
    static kind: string;
    static describer: types.Describer;
    get isOptional(): Optional;
    get isRequired(): any;
    getKind(): string;
    static setDescriber(describer: types.Describer): void;
    static getDescriber(): types.Describer;
    describe(value: any): string;
    setInitializer(initializer: any): void;
    hasInitializer(): boolean;
    getInitializer(): any | undefined;
}
