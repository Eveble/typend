import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { Collection } from '../patterns/collection';
export declare class CollectionValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation, isStrict?: boolean): boolean;
    validate(value: any, collOrExpect: Collection | Record<keyof any, any>, validator: types.Validator): boolean;
}
