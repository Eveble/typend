import { TypeKind } from "./enums/type-kind.enum";

/*
https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines

Any type or interface exported in 'root' level of declaration is considered
'first-class' building block.

Types or interfaces enclosed in new dedicated namespace are considered
contracts building blocks for replaceable parts of the system.

This unclutters the availability of names for any other prioritized contracts
that would made naming just simply hard.
*/
export namespace types {
  /*
  GENERIC
  */
  export type Class<T = unknown, Arguments extends any[] = any[]> = new (
    ...arguments_: Arguments
  ) => T;

  export type Primitive =
    | null
    | undefined
    | string
    | number
    | boolean
    | symbol
    | bigint;

  export type Prototype = Record<keyof any, any>;

  export type Native =
    | any
    | string
    | number
    | boolean
    | symbol
    | void
    | undefined
    | null
    | never
    | unknown;

  export type PropertyDescriptor = {
    value: any;
    writable: boolean;
    enumerable: boolean;
    configurable: boolean;
  };

  export type ClassDecorator = <TFunction extends Function>(
    target: TFunction
  ) => TFunction | void;

  /*
  CONVERSION
  */
  export type Type = any;

  export interface Converter {
    typeConverters: Array<types.TypeConverter | undefined>;
    convert(reflectedType: any): Type;
    reflect(reflectedType: any): Type;
    registerConverter(
      kind: TypeKind,
      converter: TypeConverter,
      shouldOverride?: boolean
    ): void;
    overrideConverter(kind: TypeKind, converter: TypeConverter): void;
    getConverter(type: TypeKind): types.TypeConverter;
    hasConverter(kind: TypeKind): boolean;
    removeConverter(kind: TypeKind): void;
  }

  export interface TypeConverter {
    priority?: number;
    isConvertible(reflectedType: any, converter?: Converter): boolean;
    convert(reflectedType?: any, converter?: Converter): Type;
    reflect(reflectedType?: any, converter?: Converter): Type;
  }

  export type InternalCollection = Record<keyof any, boolean>;

  export interface Transformer {
    canTransform<T extends any>(transformable: T, ...args: any[]): boolean;
    transform<T extends any>(transformable: T, ...args: any[]): T;
  }

  export interface TypeTransformer extends Transformer {
    canTransform(type: Type, ...args: any[]): boolean;
    transform(type: Type, ...args: any[]): Type;
  }

  export interface TypeDefinition {
    kind: string;
    name?: string;
    properties?: Record<string, any>;
    pattern?: Pattern;
    originalType?: any;
  }

  /*
  VALIDATION
  */
  export interface Stringifiable {
    toString(): string;
  }

  export interface Pattern {
    getKind(): string;
  }

  export interface PatternType {
    new (arg: any): Pattern;
    kind: string;
    describer: Describer;
    setDescriber(describer: Describer): void;
    getDescriber(): Describer;
  }

  export interface Utility {
    generate(library: Library): Expectation;
  }

  export interface UtilityType {
    new (arg: any): Utility;
    describer: Describer;
    setDescriber(describer: Describer): void;
    getDescriber(): Describer;
  }

  export type Expectation = Pattern | any;

  export interface Validator {
    validate(value: any, expectation: Expectation, isStrict?: boolean): boolean;
    isValid(value: any, expectation: Expectation, isStrict?: boolean): boolean;
    isInstanceOf(value: any, expectation: Expectation): boolean;
    registerValidator(
      kind: string,
      validator: PatternValidator,
      shouldOverride?: boolean
    ): void;
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

  export interface PatternValidator {
    canValidate(expectation: Expectation, isStrict?: boolean): boolean;
    validate(
      value?: any,
      expectation?: Expectation,
      validator?: Validator
    ): boolean;
  }

  export interface PatternValidatorType {
    new (definition: any): PatternValidator;
    describer: Describer;
    setDescriber(describer: Describer): void;
    getDescriber(): Describer;
  }

  /*
  DESCRIBING
  */
  export interface Describer {
    describe(source: any): string;
    setFormatting(formatting: DescriberFormatting): void;
  }

  export interface TypeDescriber {
    describe(arg: any, describer?: Describer): Stringifiable;
  }

  export type DescriberFormatting = 'compact' | 'debug' | 'default';

  /*
  LIBRARY
  */
  export interface Library {
    converter: types.Converter;
    describer: types.Describer;
    validator: types.Validator;

    validate(
      value: any,
      expectation: types.Expectation | Utility,
      isStrict?: boolean
    ): boolean;
    isValid(
      value: any,
      expectation: types.Expectation | Utility,
      isStrict?: boolean
    ): boolean;
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
