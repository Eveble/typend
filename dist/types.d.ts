import { TypeKind } from './enums/type-kind.enum';
export declare namespace types {
    type Class<T = unknown, Arguments extends any[] = any[]> = new (...arguments_: Arguments) => T;
    type Primitive = null | undefined | string | number | boolean | symbol | bigint;
    type Prototype = Record<keyof any, any>;
    type Native = any | string | number | boolean | symbol | void | undefined | null | never | unknown;
    type PropertyDescriptor = {
        value: any;
        writable: boolean;
        enumerable: boolean;
        configurable: boolean;
    };
    type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
    type Type = any;
    interface Converter {
        typeConverters: Array<types.TypeConverter | undefined>;
        convert(reflectedType: any): Type;
        reflect(reflectedType: any): Type;
        registerConverter(kind: TypeKind, converter: TypeConverter, shouldOverride?: boolean): void;
        overrideConverter(kind: TypeKind, converter: TypeConverter): void;
        getConverter(type: TypeKind): types.TypeConverter;
        hasConverter(kind: TypeKind): boolean;
        removeConverter(kind: TypeKind): void;
    }
    interface TypeConverter {
        priority?: number;
        isConvertible(reflectedType: any, converter?: Converter): boolean;
        convert(reflectedType?: any, converter?: Converter): Type;
        reflect(reflectedType?: any, converter?: Converter): Type;
    }
    type InternalCollection = Record<keyof any, boolean>;
    interface Transformer {
        canTransform<T extends any>(transformable: T, ...args: any[]): boolean;
        transform<T extends any>(transformable: T, ...args: any[]): T;
    }
    interface TypeTransformer extends Transformer {
        canTransform(type: Type, ...args: any[]): boolean;
        transform(type: Type, ...args: any[]): Type;
    }
    interface TypeDefinition {
        kind: string;
        name?: string;
        properties?: Record<string, any>;
        pattern?: Pattern;
        originalType?: any;
    }
    interface Stringifiable {
        toString(): string;
    }
    interface Pattern {
        getKind(): string;
    }
    interface PatternType {
        new (arg: any): Pattern;
        kind: string;
        describer: Describer;
        setDescriber(describer: Describer): void;
        getDescriber(): Describer;
    }
    interface Utility {
        generate(library: Library): Expectation;
    }
    interface UtilityType {
        new (arg: any): Utility;
        describer: Describer;
        setDescriber(describer: Describer): void;
        getDescriber(): Describer;
    }
    type Expectation = Pattern | any;
    interface Validator {
        validate(value: any, expectation: Expectation, isStrict?: boolean): boolean;
        isValid(value: any, expectation: Expectation, isStrict?: boolean): boolean;
        isInstanceOf(value: any, expectation: Expectation): boolean;
        registerValidator(kind: string, validator: PatternValidator, shouldOverride?: boolean): void;
        overrideValidator(kind: string, validator: PatternValidator): void;
        getValidator(kind: string): PatternValidator | undefined;
        getValidatorOrThrow(kind: string): PatternValidator;
        hasValidator(kind: string): boolean;
        removeValidator(kind: string): void;
        getValidators(): PatternValidator[];
        getAllValidators(): Map<string, PatternValidator>;
        setValidators(validators: Map<string, PatternValidator>): void;
        setOrder(order: string[]): void;
        getOrder(): string[];
    }
    interface PatternValidator {
        canValidate(expectation: Expectation, isStrict?: boolean): boolean;
        validate(value?: any, expectation?: Expectation, validator?: Validator): boolean;
    }
    interface PatternValidatorType {
        new (definition: any): PatternValidator;
        describer: Describer;
        setDescriber(describer: Describer): void;
        getDescriber(): Describer;
    }
    interface Describer {
        describe(source: any): string;
        setFormatting(formatting: DescriberFormatting): void;
    }
    interface TypeDescriber {
        describe(arg: any, describer?: Describer): Stringifiable;
    }
    type DescriberFormatting = 'compact' | 'debug' | 'default';
    interface Library {
        converter: types.Converter;
        describer: types.Describer;
        validator: types.Validator;
        validate(value: any, expectation: types.Expectation | Utility, isStrict?: boolean): boolean;
        isValid(value: any, expectation: types.Expectation | Utility, isStrict?: boolean): boolean;
        isInstanceOf(value: any, expectation: types.Expectation): boolean;
        setDescriber(describer: types.Describer): void;
        getDescriber(): types.Describer;
        setConverter(converter: types.Converter): void;
        getConverter(): types.Converter;
        setValidator(validator: types.Validator): void;
        getValidator(): types.Validator;
        debug(isDebugging?: boolean): void;
    }
}
