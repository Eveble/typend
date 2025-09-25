import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
import { Tuple } from '../patterns/tuple';
export declare class TupleValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, tupleOrExpect: Tuple | [], validator: types.Validator): boolean;
}
