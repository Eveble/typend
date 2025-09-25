import { Interface } from '../patterns/interface';
import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
export declare class InterfaceValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, pattern: Interface, validator: types.Validator): boolean;
}
