import { createReflective } from 'tsruntime';
// Declarations
import { types } from './types';
// Utility types
import { $PropsOf, $TypeOf } from './utility-types';
// Constants
import * as METADATA_KEYS from './constants/metadata-keys';
import * as LITERAL_KEYS from './constants/literal-keys';
// Annotations
import { internal } from './annotations/internal';
import { validable } from './annotations/validable';
// Decorators
import { define } from './decorators/define';
// Errors
import {
  ValidationError,
  InvalidDefinitionError,
  InvalidTypeError,
  InvalidValueError,
  UnequalValueError,
  UnmatchedTypeError,
  NotAMemberError,
  UnexpectedKeyError,
  UnknownError,
  TypeDescriberExistsError,
  TypeDescriberNotFoundError,
  PatternValidatorExistError,
  PatternValidatorNotFoundError,
  UndefinableClassError,
  TypeConverterExists,
} from './errors';
// Patterns
import { Any } from './patterns/any';
import { Class } from './patterns/class';
import { Collection } from './patterns/collection';
import { CollectionIncluding } from './patterns/collection-including';
import { CollectionWithin } from './patterns/collection-within';
import { Equals } from './patterns/equals';
import { InstanceOf } from './patterns/instance-of';
import { Integer } from './patterns/integer';
import { Interface } from './patterns/interface';
import { Internal } from './patterns/internal';
import { List } from './patterns/list';
import { Maybe } from './patterns/maybe';
import { Never } from './patterns/never';
import { OneOf } from './patterns/one-of';
import { Optional } from './patterns/optional';
import { Tuple } from './patterns/tuple';
import { Unknown } from './patterns/unknown';
import { Void } from './patterns/void';
import { Where } from './patterns/where';
import { Unrecognized } from './patterns/unrecognized';
// Utilities
import { PropsOf } from './utilities/props-of';
import { TypeOf } from './utilities/type-of';
// Validators
import { AnyValidator } from './validators/any-validator';
import { ClassValidator } from './validators/class-validator';
import { CollectionIncludingValidator } from './validators/collection-including-validator';
import { CollectionWithinValidator } from './validators/collection-within-validator';
import { CollectionValidator } from './validators/collection-validator';
import { EqualsValidator } from './validators/equals-validator';
import { InstanceOfValidator } from './validators/instance-of-validator';
import { IntegerValidator } from './validators/integer-validator';
import { InterfaceValidator } from './validators/interface-validator';
import { InternalValidator } from './validators/internal-validator';
import { ListValidator } from './validators/list-validator';
import { MaybeValidator } from './validators/maybe-validator';
import { NeverValidator } from './validators/never-validator';
import { OneOfValidator } from './validators/one-of-validator';
import { OptionalValidator } from './validators/optional-validator';
import { TupleValidator } from './validators/tuple-validator';
import { UnknownValidator } from './validators/unknown-validator';
import { VoidValidator } from './validators/void-validator';
import { WhereValidator } from './validators/where-validator';
import { UnrecognizedValidator } from './validators/unrecognized-validator';
// Describers
import { ArrayDescriber } from './describers/array-describer';
import { ErrorDescriber } from './describers/error-describer';
import { NativeTypeDescriber } from './describers/native-type-describer';
import { ObjectDescriber } from './describers/object-describer';
import { CompactDescriber } from './describers/compact-describer';
import { ClassDescriber } from './describers/class-describer';
import { FallbackDescriber } from './describers/fallback-describer';
import { DescriptionListDescriber } from './describers/description-list-describer';
import { DebugDescriber } from './describers/debug-describer';
// Type Converters
import { ArrayConverter } from './converters/tsruntime/type-converters/array-converter';
import { ClassConverter } from './converters/tsruntime/type-converters/class-converter';
import { FunctionConverter } from './converters/tsruntime/type-converters/function-converter';
import { NativeConverter } from './converters/tsruntime/type-converters/native-converter';
import { NilConverter } from './converters/tsruntime/type-converters/nil-converter';
import { ObjectConverter } from './converters/tsruntime/type-converters/object-converter';
import { PrimitiveConverter } from './converters/tsruntime/type-converters/primitive-converter';
import { ReferenceConverter } from './converters/tsruntime/type-converters/reference-converter';
import { TupleConverter } from './converters/tsruntime/type-converters/tuple-converter';
import { UnionConverter } from './converters/tsruntime/type-converters/union-converter';
import { UnknownConverter } from './converters/tsruntime/type-converters/unknown-converter';
import { UnrecognizedConverter } from './converters/tsruntime/type-converters/unrecognized-converter';
import { LiteralConverter } from './converters/tsruntime/type-converters/literal-converter';
import { PropsOfConverter } from './converters/tsruntime/validation-converters/props-of-converter';
import { TypeOfConverter } from './converters/tsruntime/validation-converters/type-of-converter';
import { TSRuntimeConverter } from './converters/tsruntime/tsruntime-converter';
// Type transformers
import { InjectingPropsTransformer } from './converters/transformers/injecting-props-transformer';
import { InternalPropsTransformer } from './converters/transformers/internal-props-transformer';
// Components
import { Typend } from './typend';
import { Validator } from './validator';
import { Describer } from './describer';
import { Description, DescriptionList } from './description';
import { Pattern } from './pattern';
import { PatternValidator } from './pattern-validator';
import {
  isInstanceOfExpectation,
  getResolvablePath,
  isResolvablePath,
  isPatternClass,
  isPattern,
  isUtility,
  isDefined,
  isValidable,
  getMatchingParentProto,
  isSpecial,
} from './helpers';

const KINDS = LITERAL_KEYS.KINDS;

// Initialize delegator with default formatting on describer
const describer: types.Describer = new Describer();
describer.setFormatting('default');

// Definition transformers
const classTransformers: Map<string, types.TypeTransformer> = new Map();
classTransformers.set('internal', new InternalPropsTransformer());
classTransformers.set('inject', new InjectingPropsTransformer());

// Converters
const converter: types.Converter = new TSRuntimeConverter();
converter.registerConverter(KINDS.PROPERTIES_OF, new PropsOfConverter());
converter.registerConverter(KINDS.TYPE_OF, new TypeOfConverter());
converter.registerConverter(KINDS.CLASS, new ClassConverter(classTransformers));
converter.registerConverter(KINDS.TUPLE, new TupleConverter());
converter.registerConverter(KINDS.UNION, new UnionConverter());
converter.registerConverter(KINDS.NATIVE, new NativeConverter());
converter.registerConverter(KINDS.NIL, new NilConverter());
converter.registerConverter(KINDS.ARRAY, new ArrayConverter());
converter.registerConverter(KINDS.FUNCTION, new FunctionConverter());
converter.registerConverter(KINDS.OBJECT, new ObjectConverter());
converter.registerConverter(KINDS.PRIMITIVE, new PrimitiveConverter());
converter.registerConverter(KINDS.REFERENCE, new ReferenceConverter());
converter.registerConverter(KINDS.UNKNOWN, new UnknownConverter());
converter.registerConverter(KINDS.UNRECOGNIZED, new UnrecognizedConverter());
converter.registerConverter(KINDS.LITERAL, new LiteralConverter());

// Register pattern validators on validator
const validator: types.Validator = new Validator();
validator.registerValidator(KINDS.ANY, new AnyValidator());
validator.registerValidator(KINDS.ARRAY, new ListValidator());
validator.registerValidator(KINDS.CLASS, new ClassValidator());
validator.registerValidator(KINDS.EQUALS, new EqualsValidator());
validator.registerValidator(KINDS.INSTANCE_OF, new InstanceOfValidator());
validator.registerValidator(KINDS.INTEGER, new IntegerValidator());
validator.registerValidator(KINDS.INTERNAL, new InternalValidator());
validator.registerValidator(KINDS.INTERFACE, new InterfaceValidator());
validator.registerValidator(KINDS.MAYBE, new MaybeValidator());
validator.registerValidator(KINDS.NEVER, new NeverValidator());
validator.registerValidator(KINDS.OBJECT, new CollectionValidator());
validator.registerValidator(
  KINDS.OBJECT_INCLUDING,
  new CollectionIncludingValidator()
);
validator.registerValidator(
  KINDS.OBJECT_WITHIN,
  new CollectionWithinValidator()
);
validator.registerValidator(KINDS.ONE_OF, new OneOfValidator());
validator.registerValidator(KINDS.OPTIONAL, new OptionalValidator());
validator.registerValidator(KINDS.TUPLE, new TupleValidator());
validator.registerValidator(KINDS.UNKNOWN, new UnknownValidator());
validator.registerValidator(KINDS.UNRECOGNIZED, new UnrecognizedValidator());
validator.registerValidator(KINDS.VOID, new VoidValidator());
validator.registerValidator(KINDS.WHERE, new WhereValidator());

// Allow only selected pattern validators to be used on implicit expectations
validator.setOrder([
  KINDS.OBJECT_INCLUDING,
  KINDS.OBJECT,
  KINDS.ARRAY,
  KINDS.TUPLE,
  KINDS.INSTANCE_OF,
  KINDS.CLASS,
  KINDS.EQUALS,
]);

/*
API
*/
const typend: types.Library = new Typend(converter, describer, validator);
// Simple API
const validate = typend.validate.bind(typend);
const isValid = typend.isValid.bind(typend);
const isInstanceOf = typend.isInstanceOf.bind(typend);

// TypeScript API
/**
 * Validates if a value matches a TypeScript's type.
 * @param value - Value that needs to validated.
 * @param isStrict - Flag indicating that evaluation should be done in strict mode.
 * @returns Returns `true` if validation is successful, else throws.
 * @throws {ValidationError}
 * Thrown if the value does not match provided rule.
 * @hidden
 * @remarks
 * Without hidden tag, Docusaurus is unable to render.
 */
const check = createReflective((reflectedType: any) => {
  return <T>(value: any, isStrict?: boolean): boolean => {
    const expectation: types.Expectation = typend.converter.convert(
      reflectedType
    );
    return typend.validate(value, expectation, isStrict);
  };
});

/**
 * Validates if a value matches an expectation.
 * @param value - Value that needs to validated.
 * @param isStrict - Flag indicating that evaluation should be done in strict mode.
 * @returns Returns `true` if validation is successful, else `false`.
 * @hidden
 * @remarks
 * Without hidden tag, Docusaurus is unable to render.
 */
const is = createReflective((reflectedType: any) => {
  return <T>(value: any, isStrict?: boolean): boolean => {
    const expectation: types.Expectation = typend.converter.convert(
      reflectedType
    );
    return typend.isValid(value, expectation, isStrict);
  };
});

/**
 * Validates if a value is a instance of expectation.
 * @param value - Value that needs to validated.
 * @returns Returns `true` if validation is successful, else `false`.
 * @hidden
 * @remarks
 * Without hidden tag, Docusaurus is unable to render.
 */
const instanceOf = createReflective((reflectedType: any) => {
  return <T>(value: any): boolean => {
    const expectation: types.Expectation = typend.converter.convert(
      reflectedType
    );
    return typend.isInstanceOf(value, expectation);
  };
});

/**
 * Converts TypeScript declaration to validable form.
 * @returns Returns converted TypeScript's declaration as validable form.
 * @hidden
 * @remarks
 * Without hidden tag, Docusaurus is unable to render.
 */
const convert = createReflective((reflectedType: any) => {
  return <T>(): any => {
    return typend.converter.convert(reflectedType);
  };
});

/**
 * Reflects TypeScript declaration to readable form.
 * @returns Returns reflected TypeScript's declaration as readable form.
 * @hidden
 * @remarks
 * Without hidden tag, Docusaurus is unable to render.
 */
const reflect = createReflective((reflectedType: any) => {
  return <T>(): any => {
    return typend.converter.reflect(reflectedType);
  };
});

// Wrap Pattern constructors with simple functions so they can simplify
// instantiation
const any = new Any();
const never = new Never();
const voided = new Void();
const unknown = new Unknown();
const integer = Integer;
function collection(properties: Record<keyof any, any>): Collection {
  return new Collection(properties);
}
function collectionIncluding(
  properties: Record<keyof any, any>
): CollectionIncluding {
  return new CollectionIncluding(properties);
}
function collectionWithin(
  properties: Record<keyof any, any>
): CollectionWithin {
  return new CollectionWithin(properties);
}
function list(...expectations: any[]): List {
  return new List(...expectations);
}
function maybe(expectation: any): Maybe {
  return new Maybe(expectation);
}
function oneOf(...expectations: any[]): OneOf {
  return new OneOf(...expectations);
}
function optional(expectation: any): Optional {
  return new Optional(expectation);
}
function tuple(...expectations: any[]): Tuple {
  return new Tuple(...expectations);
}
function unrecognized(expectation?: any): Unrecognized {
  return new Unrecognized(expectation);
}
function where(fn: Function): Where {
  return new Where(fn);
}

function eq(expectation: any): Equals {
  return new Equals(expectation);
}
function iof(type: any): InstanceOf {
  return new InstanceOf(type);
}
// Utilities
function propsOf(type: types.Class): PropsOf {
  return new PropsOf(type);
}
function typeOf(type: types.Class): TypeOf {
  return new TypeOf(type);
}
// Primitive types
const string: Function = String;
const number: Function = Number;
const boolean: Function = Boolean;
const symbol: Function = Symbol;

// Initialize delegator with default formatting on describer
describer.setFormatting('default');

const PropTypes = {
  any,
  array: Array,
  arrayOf: list,
  bool: Boolean,
  func: Function,
  equal: eq,
  instanceOf: iof,
  integer,
  interface(properties: Record<keyof any, any>): Interface {
    return new Interface(properties);
  },
  maybe,
  never,
  number: Number,
  object: new Collection({}),
  objectOf: new Collection({}),
  oneOf,
  oneOfType: oneOf,
  shape(properties: Record<keyof any, any>): Collection {
    return new Collection(properties);
  },
  string: String,
  symbol: Symbol,
  tuple,
  void: voided,
  where,
};

export {
  // Declarations
  types,
  // Utility types,
  $PropsOf,
  $TypeOf,
  // Constants
  METADATA_KEYS,
  LITERAL_KEYS,
  // Errors
  ValidationError,
  InvalidDefinitionError,
  InvalidTypeError,
  InvalidValueError,
  UnequalValueError,
  UnmatchedTypeError,
  NotAMemberError,
  UnexpectedKeyError,
  UnknownError,
  TypeDescriberExistsError,
  TypeDescriberNotFoundError,
  PatternValidatorExistError,
  PatternValidatorNotFoundError,
  UndefinableClassError,
  TypeConverterExists,
  // Patterns
  Any,
  Class,
  Collection,
  CollectionIncluding,
  CollectionWithin,
  Equals,
  InstanceOf,
  Integer,
  Interface,
  Internal,
  List,
  Maybe,
  Never,
  OneOf,
  Optional,
  Tuple,
  Unknown,
  Unrecognized,
  Void,
  Where,
  // Utilities
  PropsOf,
  TypeOf,
  // Validators
  AnyValidator,
  ClassValidator,
  CollectionIncludingValidator,
  CollectionWithinValidator,
  CollectionValidator,
  EqualsValidator,
  InstanceOfValidator,
  IntegerValidator,
  InterfaceValidator,
  InternalValidator,
  ListValidator,
  MaybeValidator,
  NeverValidator,
  OneOfValidator,
  OptionalValidator,
  TupleValidator,
  UnknownValidator,
  UnrecognizedValidator,
  VoidValidator,
  WhereValidator,
  // Describers
  ArrayDescriber,
  ErrorDescriber,
  NativeTypeDescriber,
  ObjectDescriber,
  CompactDescriber,
  ClassDescriber,
  FallbackDescriber,
  DescriptionListDescriber,
  DebugDescriber,
  // Converters
  ArrayConverter,
  ClassConverter,
  FunctionConverter,
  NativeConverter,
  NilConverter,
  ObjectConverter,
  PrimitiveConverter,
  ReferenceConverter,
  TupleConverter,
  UnionConverter,
  UnknownConverter,
  UnrecognizedConverter,
  LiteralConverter,
  PropsOfConverter,
  TypeOfConverter,
  TSRuntimeConverter,
  // Type transformers
  InjectingPropsTransformer,
  InternalPropsTransformer,
  // Components
  Typend,
  Validator,
  Describer,
  Description,
  DescriptionList,
  Pattern,
  PatternValidator,
  // Helpers
  getResolvablePath,
  isInstanceOfExpectation,
  isResolvablePath,
  isPatternClass,
  isPattern,
  isUtility,
  isDefined,
  isValidable,
  getMatchingParentProto,
  isSpecial,
  // Typend end-api
  typend,
  validator,
  describer,
  converter,
  validate,
  isValid,
  isInstanceOf,
  check,
  is,
  instanceOf,
  convert,
  reflect,
  // Annotations
  internal,
  validable,
  // Decorators
  define,
  // Patterns
  any,
  iof,
  collection,
  collectionIncluding,
  collectionWithin,
  eq,
  Integer as integer,
  list,
  maybe,
  never,
  oneOf,
  optional,
  tuple,
  unknown,
  unrecognized,
  voided,
  where,
  PropTypes,
  // Utilities
  propsOf,
  typeOf,
  // Primitive types
  string,
  number,
  boolean,
  symbol,
};
