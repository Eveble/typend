import { PatternValidator } from '../pattern-validator';
import { CollectionWithin } from '../patterns/collection-within';
import { types } from '../types';
export declare class CollectionWithinValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, collectionWithin: CollectionWithin, validator: types.Validator): boolean;
}
