import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
export declare class NeverValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any): boolean;
}
