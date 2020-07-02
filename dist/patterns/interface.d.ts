import 'reflect-metadata';
import { Pattern } from '../pattern';
import { types } from '../types';
import { KINDS } from '../constants/literal-keys';
export declare class Interface extends Pattern implements types.Pattern {
    static kind: KINDS;
    constructor(properties: Record<keyof any, any>);
    setName(name: string): void;
    getName(): string;
}
