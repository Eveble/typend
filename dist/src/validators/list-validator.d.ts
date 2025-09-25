import { types } from '../types';
import { PatternValidator } from '../pattern-validator';
import { List } from '../patterns/list';
export declare class ListValidator extends PatternValidator implements types.PatternValidator {
    canValidate(expectation: types.Expectation): boolean;
    validate(value: any, listOrExpect: List | any[] | any, validator: types.Validator): boolean;
}
