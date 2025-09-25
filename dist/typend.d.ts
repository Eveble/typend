import { types } from './types';
import { Utility } from './utility';
declare class Typend implements types.Library {
    converter: types.Converter;
    describer: types.Describer;
    validator: types.Validator;
    constructor(converter: types.Converter, describer: types.Describer, validator: types.Validator);
    validate(value: any, expectation: types.Expectation | Utility, isStrict?: boolean): boolean;
    isValid(value: any, expectation: types.Expectation | Utility, isStrict?: boolean): boolean;
    isInstanceOf(value: any, expectation: any): boolean;
    debug(isDebugging?: boolean): void;
    setDescriber(describer: types.Describer): void;
    getDescriber(): types.Describer;
    setConverter(converter: types.Converter): void;
    getConverter(): types.Converter;
    setValidator(validator: types.Validator): void;
    getValidator(): types.Validator;
    protected processExpectation(expectation: types.Expectation): any;
}
export { Typend };
