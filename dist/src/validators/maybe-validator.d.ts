import { PatternValidator } from '../pattern-validator';
import { Maybe } from '../patterns/maybe';
import { types } from '../types';
export declare class MaybeValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, maybe: Maybe, validator: types.Validator): boolean;
}
