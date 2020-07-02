import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { Class } from '../patterns/class';
export declare class ClassValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, pattern: Class, validator: types.Validator): boolean;
}
