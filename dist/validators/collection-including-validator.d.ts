import { PatternValidator } from '../pattern-validator';
import { types } from '../types';
import { CollectionIncluding } from '../patterns/collection-including';
export declare class CollectionIncludingValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation, isStrict?: boolean): boolean;
    validate(value: any, collIncOrExpect: CollectionIncluding | Record<keyof any, any>, validator: types.Validator): boolean;
}
