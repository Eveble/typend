import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
export declare class IntegerValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any): boolean;
}
