import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
export declare class InstanceOfValidator extends PatternValidator implements types.PatternValidator {
    static MAPPINGS: {
        readonly symbol: SymbolConstructor;
    };
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, instanceOfOrExpect: types.Expectation): boolean;
}
