import { types } from './types';
export declare abstract class PatternValidator {
    static describer: types.Describer;
    static setDescriber(describer: types.Describer): void;
    static getDescriber(): types.Describer;
    describe(value: any): string;
}
