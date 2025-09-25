import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { Optional } from '../patterns/optional';
export declare class OptionalValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, optional: Optional, validator: types.Validator): boolean;
}
