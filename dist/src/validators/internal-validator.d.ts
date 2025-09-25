import { types } from '../types';
import { AnyValidator } from './any-validator';
export declare class InternalValidator extends AnyValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(): boolean;
}
