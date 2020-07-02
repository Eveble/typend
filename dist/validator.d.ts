import { types } from './types';
export declare class Validator implements types.Validator {
    protected validators: Map<string, types.PatternValidator>;
    protected order: string[];
    constructor(validators?: Map<string, types.PatternValidator>);
    validate(value: any, expectation: types.Expectation, isStrict?: boolean): boolean;
    isValid(value: any, expectation: types.Expectation, isStrict?: boolean): boolean;
    isInstanceOf(value: any, expectation: types.Expectation): boolean;
    registerValidator(kind: string, validator: types.PatternValidator, shouldOverride?: boolean): void;
    overrideValidator(kind: string, validator: types.PatternValidator): void;
    getValidator(kind: string): types.PatternValidator | undefined;
    getValidatorOrThrow(kind: string): types.PatternValidator;
    hasValidator(kind: string): boolean;
    removeValidator(kind: string): void;
    getValidators(): types.PatternValidator[];
    getAllValidators(): Map<string, types.PatternValidator>;
    setValidators(validators: Map<string, types.PatternValidator>): void;
    setOrder(order: string[]): void;
    getOrder(): string[];
    protected handleExplicitPattern(value: any, pattern: types.Pattern): boolean;
    protected handleImplicitExpectation(value: any, expectation: types.Expectation, isStrict: boolean): boolean | undefined;
}
