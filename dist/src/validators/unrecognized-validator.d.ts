import { Unrecognized } from '../patterns/unrecognized';
import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
export declare class UnrecognizedValidator extends PatternValidator implements types.PatternValidator {
    private readonly _isValid;
    constructor(isValid?: boolean);
    canValidate(expectation: types.Expectation): boolean;
    getDefaultBehavior(): boolean;
    validate(value: any, unrecognized: Unrecognized): boolean;
}
