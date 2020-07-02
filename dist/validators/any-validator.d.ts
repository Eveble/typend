import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
export declare class AnyValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(): boolean;
}
