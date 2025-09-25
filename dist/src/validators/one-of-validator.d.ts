import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { OneOf } from '../patterns/one-of';
export declare class OneOfValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, oneOf: OneOf, validator: types.Validator): boolean;
}
