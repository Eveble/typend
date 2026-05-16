import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
import { stubInterface } from '../vitest-helper';
// Annotations
import { Internal } from '../../src/annotations/internal';
import { Validable } from '../../src/annotations/validable';
// Decorators
import { Type } from '../../src/decorators/type.decorator';
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
} from '../../src/errors';
// Patterns
import { Any } from '../../src/patterns/any';
import { Class } from '../../src/patterns/class';
import { Collection } from '../../src/patterns/collection';
import { CollectionIncluding } from '../../src/patterns/collection-including';
import { CollectionWithin } from '../../src/patterns/collection-within';
import { Equals } from '../../src/patterns/equals';
import { InstanceOf } from '../../src/patterns/instance-of';
import { Integer } from '../../src/patterns/integer';
import { Interface } from '../../src/patterns/interface';
import { Internal as InternalPattern } from '../../src/patterns/internal';
import { List } from '../../src/patterns/list';
import { LocaleString } from '../../src/patterns/locale-string';
import { Maybe } from '../../src/patterns/maybe';
import { Never } from '../../src/patterns/never';
import { OneOf } from '../../src/patterns/one-of';
import { Optional } from '../../src/patterns/optional';
import { Tuple } from '../../src/patterns/tuple';
import { Unknown } from '../../src/patterns/unknown';
import { Unrecognized } from '../../src/patterns/unrecognized';
import { Void } from '../../src/patterns/void';
import { Where } from '../../src/patterns/where';
import { WrapperPattern } from '../../src/wrapper-pattern';
// Utilities
import { PropsOf } from '../../src/utilities/props-of';
import { TypeOf } from '../../src/utilities/type-of';
// Validators
import { AnyValidator } from '../../src/validators/any-validator';
import { ClassValidator } from '../../src/validators/class-validator';
import { CollectionIncludingValidator } from '../../src/validators/collection-including-validator';
import { CollectionWithinValidator } from '../../src/validators/collection-within-validator';
import { CollectionValidator } from '../../src/validators/collection-validator';
import { EqualsValidator } from '../../src/validators/equals-validator';
import { InstanceOfValidator } from '../../src/validators/instance-of-validator';
import { IntegerValidator } from '../../src/validators/integer-validator';
import { InterfaceValidator } from '../../src/validators/interface-validator';
import { InternalValidator } from '../../src/validators/internal-validator';
import { ListValidator } from '../../src/validators/list-validator';
import { LocaleStringValidator } from '../../src/validators/locale-string-validator';
import { MaybeValidator } from '../../src/validators/maybe-validator';
import { NeverValidator } from '../../src/validators/never-validator';
import { OneOfValidator } from '../../src/validators/one-of-validator';
import { OptionalValidator } from '../../src/validators/optional-validator';
import { TupleValidator } from '../../src/validators/tuple-validator';
import { UnknownValidator } from '../../src/validators/unknown-validator';
import { UnrecognizedValidator } from '../../src/validators/unrecognized-validator';
import { VoidValidator } from '../../src/validators/void-validator';
import { WhereValidator } from '../../src/validators/where-validator';
// Describers
import { ArrayDescriber } from '../../src/describers/array-describer';
import { ErrorDescriber } from '../../src/describers/error-describer';
import { NativeTypeDescriber } from '../../src/describers/native-type-describer';
import { ObjectDescriber } from '../../src/describers/object-describer';
import { CompactDescriber } from '../../src/describers/compact-describer';
import { ClassDescriber } from '../../src/describers/class-describer';
import { FallbackDescriber } from '../../src/describers/fallback-describer';
import { DescriptionListDescriber } from '../../src/describers/description-list-describer';
import { DebugDescriber } from '../../src/describers/debug-describer';
// Type Converters
import { AnyConverter } from '../../src/converters/tsruntime/type-converters/any.converter';
import { StringConverter } from '../../src/converters/tsruntime/type-converters/string.converter';
import { NumberConverter } from '../../src/converters/tsruntime/type-converters/number.converter';
import { BooleanConverter } from '../../src/converters/tsruntime/type-converters/boolean.converter';
import { StringLiteralConverter } from '../../src/converters/tsruntime/type-converters/string-literal.converter';
import { NumberLiteralConverter } from '../../src/converters/tsruntime/type-converters/number-literal.converter';
import { FalseLiteralConverter } from '../../src/converters/tsruntime/type-converters/false-literal.converter';
import { TrueLiteralConverter } from '../../src/converters/tsruntime/type-converters/true-literal.converter';
import { EnumLiteralConverter } from '../../src/converters/tsruntime/type-converters/enum-literal.converter';
import { ESSymbolConverter } from '../../src/converters/tsruntime/type-converters/essymbol.converter';
import { VoidConverter } from '../../src/converters/tsruntime/type-converters/void.converter';
import { NullConverter } from '../../src/converters/tsruntime/type-converters/null.converter';
import { UndefinedConverter } from '../../src/converters/tsruntime/type-converters/undefined.converter';
import { NeverConverter } from '../../src/converters/tsruntime/type-converters/never.converter';
import { TupleConverter } from '../../src/converters/tsruntime/type-converters/tuple.converter';
import { UnionConverter } from '../../src/converters/tsruntime/type-converters/union.converter';
import { ReferenceConverter } from '../../src/converters/tsruntime/type-converters/reference.converter';
import { ClassConverter } from '../../src/converters/tsruntime/type-converters/class.converter';
import { UnknownConverter } from '../../src/converters/tsruntime/type-converters/unknown.converter';
import { FunctionConverter } from '../../src/converters/tsruntime/type-converters/function.converter';
import { ArrayConverter } from '../../src/converters/tsruntime/type-converters/array.converter';
import { PropsOfConverter } from '../../src/converters/tsruntime/validation-converters/props-of-converter';
import { TypeOfConverter } from '../../src/converters/tsruntime/validation-converters/type-of-converter';
import { TSRuntimeConverter } from '../../src/converters/tsruntime/tsruntime-converter';
// Type transformers
import { InjectingPropsTransformer } from '../../src/converters/transformers/injecting-props-transformer';
import { InternalPropsTransformer } from '../../src/converters/transformers/internal-props-transformer';
// Components
import { Typend } from '../../src/typend';
import { Validator } from '../../src/validator';
import { Describer } from '../../src/describer';
import { Description, DescriptionList } from '../../src/description';
import { Pattern } from '../../src/pattern';
import { PatternValidator } from '../../src/pattern-validator';
import {
  isInstanceOfExpectation,
  getResolvablePath,
  isResolvablePath,
  isPatternClass,
  isPattern,
  isUtility,
  isType,
  isValidable,
  getMatchingParentProto,
  isSpecial,
} from '../../src/helpers';
// Chai
import { equivalentClassChai } from '../../src/chai/equivalent-class.chai-plugin';

import {
  // Errors
  ValidationError as ValidationErrorExported,
  InvalidDefinitionError as InvalidDefinitionErrorExported,
  InvalidTypeError as InvalidTypeErrorExported,
  InvalidValueError as InvalidValueErrorExported,
  UnequalValueError as UnequalValueErrorExported,
  UnmatchedTypeError as UnmatchedTypeErrorExported,
  NotAMemberError as NotAMemberErrorExported,
  UnexpectedKeyError as UnexpectedKeyErrorExported,
  UnknownError as UnknownErrorExported,
  TypeDescriberExistsError as TypeDescriberExistsErrorExported,
  TypeDescriberNotFoundError as TypeDescriberNotFoundErrorExported,
  PatternValidatorExistError as PatternValidatorExistErrorExported,
  PatternValidatorNotFoundError as PatternValidatorNotFoundErrorExported,
  UndefinableClassError as UndefinableClassErrorExported,
  TypeConverterExists as TypeConverterExistsExported,
  // Patterns
  Any as AnyExported,
  Class as ClassExported,
  Collection as CollectionExported,
  CollectionIncluding as CollectionIncludingExported,
  CollectionWithin as CollectionWithinExported,
  Equals as EqualsExported,
  InstanceOf as InstanceOfExported,
  Integer as IntegerExported,
  Interface as InterfaceExported,
  InternalPattern as InternalPatternExported,
  List as ListExported,
  LocaleString as LocaleStringExported,
  Maybe as MaybeExported,
  Never as NeverExported,
  OneOf as OneOfExported,
  Optional as OptionalExported,
  Tuple as TupleExported,
  Unknown as UnknownExported,
  Unrecognized as UnrecognizedExported,
  Void as VoidExported,
  Where as WhereExported,
  WrapperPattern as WrapperPatternExported,
  // Utilities
  PropsOf as PropsOfExported,
  TypeOf as TypeOfExported,
  // Validators
  AnyValidator as AnyValidatorExported,
  ClassValidator as ClassValidatorExported,
  CollectionIncludingValidator as CollectionIncludingValidatorExported,
  CollectionWithinValidator as CollectionWithinValidatorExported,
  CollectionValidator as CollectionValidatorExported,
  EqualsValidator as EqualsValidatorExported,
  InstanceOfValidator as InstanceOfValidatorExported,
  IntegerValidator as IntegerValidatorExported,
  InterfaceValidator as InterfaceValidatorExported,
  InternalValidator as InternalValidatorExported,
  ListValidator as ListValidatorExported,
  LocaleStringValidator as LocaleStringValidatorExported,
  MaybeValidator as MaybeValidatorExported,
  NeverValidator as NeverValidatorExported,
  OneOfValidator as OneOfValidatorExported,
  OptionalValidator as OptionalValidatorExported,
  TupleValidator as TupleValidatorExported,
  UnknownValidator as UnknownValidatorExported,
  UnrecognizedValidator as UnrecognizedValidatorExported,
  VoidValidator as VoidValidatorExported,
  WhereValidator as WhereValidatorExported,
  // Describers
  ArrayDescriber as ArrayDescriberExported,
  ErrorDescriber as ErrorDescriberExported,
  NativeTypeDescriber as NativeTypeDescriberExported,
  ObjectDescriber as ObjectDescriberExported,
  CompactDescriber as CompactDescriberExported,
  ClassDescriber as ClassDescriberExported,
  FallbackDescriber as FallbackDescriberExported,
  DescriptionListDescriber as DescriptionListDescriberExported,
  DebugDescriber as DebugDescriberExported,
  // Type Converters
  AnyConverter as AnyConverterExported,
  StringConverter as StringConverterExported,
  NumberConverter as NumberConverterExported,
  BooleanConverter as BooleanConverterExported,
  StringLiteralConverter as StringLiteralConverterExported,
  NumberLiteralConverter as NumberLiteralConverterExported,
  FalseLiteralConverter as FalseLiteralConverterExported,
  TrueLiteralConverter as TrueLiteralConverterExported,
  EnumLiteralConverter as EnumLiteralConverterExported,
  ESSymbolConverter as ESSymbolConverterExported,
  VoidConverter as VoidConverterExported,
  NullConverter as NullConverterExported,
  UndefinedConverter as UndefinedConverterExported,
  NeverConverter as NeverConverterExported,
  TupleConverter as TupleConverterExported,
  UnionConverter as UnionConverterExported,
  ReferenceConverter as ReferenceConverterExported,
  ClassConverter as ClassConverterExported,
  UnknownConverter as UnknownConverterExported,
  FunctionConverter as FunctionConverterExported,
  ArrayConverter as ArrayConverterExported,
  PropsOfConverter as PropsOfConverterExported,
  TypeOfConverter as TypeOfConverterExported,
  TSRuntimeConverter as TSRuntimeConverterExported,

  // Type transformers
  InjectingPropsTransformer as InjectingPropsTransformerExported,
  InternalPropsTransformer as InternalPropsTransformerExported,
  // Components
  Typend as TypendExported,
  Validator as ValidatorExported,
  Describer as DescriberExported,
  Description as DescriptionExported,
  DescriptionList as DescriptionListExported,
  Pattern as PatternExported,
  PatternValidator as PatternValidatorExported,
  // Helpers
  isInstanceOfExpectation as isInstanceOfExpectationExported,
  getResolvablePath as getResolvablePathExported,
  isResolvablePath as isResolvablePathExported,
  isPatternClass as isPatternClassExported,
  isPattern as isPatternExported,
  isUtility as isUtilityExported,
  isType as isTypeExported,
  isValidable as isValidableExported,
  getMatchingParentProto as getMatchingParentProtoExported,
  isSpecial as isSpecialExported,
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
  Internal as InternalExported,
  Validable as ValidableExported,
  // Decorators
  Type as TypeExported,
  // Chai
  equivalentClassChai as equivalentClassChaiExported,
  // Patterns
  any,
  iof,
  collection,
  collectionIncluding,
  collectionWithin,
  eq,
  integer,
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
  // Utilities
  propsOf,
  typeOf,
  // Primitive types
  string,
  number,
  boolean,
  symbol,
  // Property types
  PropTypes,
} from '../../src/index';

describe('exports', () => {
  describe('annotations', () => {
    it('internal', () => {
      expect(Internal).toBe(InternalExported);
    });
    it('Validable', () => {
      expect(Validable).toBe(ValidableExported);
    });
  });

  describe('decorators', () => {
    it('Type', () => {
      expect(Type).toBe(TypeExported);
    });
  });

  describe('errors', () => {
    it('ValidationError', () => {
      expect(ValidationError).toBe(ValidationErrorExported);
    });
    it('InvalidDefinitionError', () => {
      expect(InvalidDefinitionError).toBe(InvalidDefinitionErrorExported);
    });
    it('InvalidTypeError', () => {
      expect(InvalidTypeError).toBe(InvalidTypeErrorExported);
    });
    it('InvalidValueError', () => {
      expect(InvalidValueError).toBe(InvalidValueErrorExported);
    });
    it('UnequalValueError', () => {
      expect(UnequalValueError).toBe(UnequalValueErrorExported);
    });
    it('UnmatchedTypeError', () => {
      expect(UnmatchedTypeError).toBe(UnmatchedTypeErrorExported);
    });
    it('NotAMemberError', () => {
      expect(NotAMemberError).toBe(NotAMemberErrorExported);
    });
    it('UnexpectedKeyError', () => {
      expect(UnexpectedKeyError).toBe(UnexpectedKeyErrorExported);
    });
    it('UnknownError', () => {
      expect(UnknownError).toBe(UnknownErrorExported);
    });
    it('TypeDescriberExistsError', () => {
      expect(TypeDescriberExistsError).toBe(TypeDescriberExistsErrorExported);
    });
    it('TypeDescriberNotFoundError', () => {
      expect(TypeDescriberNotFoundError).toBe(
        TypeDescriberNotFoundErrorExported
      );
    });
    it('PatternValidatorExistError', () => {
      expect(PatternValidatorExistError).toBe(
        PatternValidatorExistErrorExported
      );
    });
    it('PatternValidatorNotFoundError', () => {
      expect(PatternValidatorNotFoundError).toBe(
        PatternValidatorNotFoundErrorExported
      );
    });
    it('UndefinableClassError', () => {
      expect(UndefinableClassError).toBe(UndefinableClassErrorExported);
    });
    it('TypeConverterExists', () => {
      expect(TypeConverterExists).toBe(TypeConverterExistsExported);
    });
  });

  describe('patterns', () => {
    it('Any', () => {
      expect(Any).toBe(AnyExported);
    });
    it('Class', () => {
      expect(Class).toBe(ClassExported);
    });
    it('Collection', () => {
      expect(Collection).toBe(CollectionExported);
    });
    it('CollectionIncluding', () => {
      expect(CollectionIncluding).toBe(CollectionIncludingExported);
    });
    it('CollectionWithin', () => {
      expect(CollectionWithin).toBe(CollectionWithinExported);
    });
    it('Equals', () => {
      expect(Equals).toBe(EqualsExported);
    });
    it('InstanceOf', () => {
      expect(InstanceOf).toBe(InstanceOfExported);
    });
    it('Integer', () => {
      expect(Integer).toBe(IntegerExported);
    });
    it('Interface', () => {
      expect(Interface).toBe(InterfaceExported);
    });
    it('InternalPattern', () => {
      expect(InternalPattern).toBe(InternalPatternExported);
    });
    it('List', () => {
      expect(List).toBe(ListExported);
    });
    it('LocaleString', () => {
      expect(LocaleString).toBe(LocaleStringExported);
    });
    it('Maybe', () => {
      expect(Maybe).toBe(MaybeExported);
    });
    it('Never', () => {
      expect(Never).toBe(NeverExported);
    });
    it('OneOf', () => {
      expect(OneOf).toBe(OneOfExported);
    });
    it('Optional', () => {
      expect(Optional).toBe(OptionalExported);
    });
    it('Tuple', () => {
      expect(Tuple).toBe(TupleExported);
    });
    it('Unknown', () => {
      expect(Unknown).toBe(UnknownExported);
    });
    it('Unrecognized', () => {
      expect(Unrecognized).toBe(UnrecognizedExported);
    });
    it('Void', () => {
      expect(Void).toBe(VoidExported);
    });
    it('Where', () => {
      expect(Where).toBe(WhereExported);
    });
    it('WrapperPattern', () => {
      expect(WrapperPattern).toBe(WrapperPatternExported);
    });
  });

  describe('', () => {
    it('PropsOf', () => {
      expect(PropsOf).toBe(PropsOfExported);
    });
    it('TypeOf', () => {
      expect(TypeOf).toBe(TypeOfExported);
    });
  });

  describe('validators', () => {
    it('AnyValidator', () => {
      expect(AnyValidator).toBe(AnyValidatorExported);
    });
    it('ClassValidator', () => {
      expect(ClassValidator).toBe(ClassValidatorExported);
    });
    it('CollectionIncludingValidator', () => {
      expect(CollectionIncludingValidator).toBe(
        CollectionIncludingValidatorExported
      );
    });
    it('CollectionWithinValidator', () => {
      expect(CollectionWithinValidator).toBe(CollectionWithinValidatorExported);
    });
    it('CollectionValidator', () => {
      expect(CollectionValidator).toBe(CollectionValidatorExported);
    });
    it('EqualsValidator', () => {
      expect(EqualsValidator).toBe(EqualsValidatorExported);
    });
    it('InstanceOfValidator', () => {
      expect(InstanceOfValidator).toBe(InstanceOfValidatorExported);
    });
    it('IntegerValidator', () => {
      expect(IntegerValidator).toBe(IntegerValidatorExported);
    });
    it('InterfaceValidator', () => {
      expect(InterfaceValidator).toBe(InterfaceValidatorExported);
    });
    it('InternalValidator', () => {
      expect(InternalValidator).toBe(InternalValidatorExported);
    });
    it('ListValidator', () => {
      expect(ListValidator).toBe(ListValidatorExported);
    });
    it('LocaleStringValidator', () => {
      expect(LocaleStringValidator).toBe(LocaleStringValidatorExported);
    });
    it('MaybeValidator', () => {
      expect(MaybeValidator).toBe(MaybeValidatorExported);
    });
    it('NeverValidator', () => {
      expect(NeverValidator).toBe(NeverValidatorExported);
    });
    it('OneOfValidator', () => {
      expect(OneOfValidator).toBe(OneOfValidatorExported);
    });
    it('OptionalValidator', () => {
      expect(OptionalValidator).toBe(OptionalValidatorExported);
    });
    it('TupleValidator', () => {
      expect(TupleValidator).toBe(TupleValidatorExported);
    });
    it('UnknownValidator', () => {
      expect(UnknownValidator).toBe(UnknownValidatorExported);
    });
    it('UnrecognizedValidator', () => {
      expect(UnrecognizedValidator).toBe(UnrecognizedValidatorExported);
    });
    it('VoidValidator', () => {
      expect(VoidValidator).toBe(VoidValidatorExported);
    });
    it('WhereValidator', () => {
      expect(WhereValidator).toBe(WhereValidatorExported);
    });
  });

  describe('describers', () => {
    it('ArrayDescriber', () => {
      expect(ArrayDescriber).toBe(ArrayDescriberExported);
    });
    it('ErrorDescriber', () => {
      expect(ErrorDescriber).toBe(ErrorDescriberExported);
    });
    it('NativeTypeDescriber', () => {
      expect(NativeTypeDescriber).toBe(NativeTypeDescriberExported);
    });
    it('ObjectDescriber', () => {
      expect(ObjectDescriber).toBe(ObjectDescriberExported);
    });
    it('CompactDescriber', () => {
      expect(CompactDescriber).toBe(CompactDescriberExported);
    });
    it('ClassDescriber', () => {
      expect(ClassDescriber).toBe(ClassDescriberExported);
    });
    it('FallbackDescriber', () => {
      expect(FallbackDescriber).toBe(FallbackDescriberExported);
    });
    it('DescriptionListDescriber', () => {
      expect(DescriptionListDescriber).toBe(DescriptionListDescriberExported);
    });
    it('DebugDescriber', () => {
      expect(DebugDescriber).toBe(DebugDescriberExported);
    });
  });

  describe('converters', () => {
    it('AnyConverter', () => {
      expect(AnyConverter).toBe(AnyConverterExported);
    });
    it('StringConverter', () => {
      expect(StringConverter).toBe(StringConverterExported);
    });
    it('NumberConverter', () => {
      expect(NumberConverter).toBe(NumberConverterExported);
    });
    it('BooleanConverter', () => {
      expect(BooleanConverter).toBe(BooleanConverterExported);
    });
    it('StringLiteralConverter', () => {
      expect(StringLiteralConverter).toBe(StringLiteralConverterExported);
    });
    it('NumberLiteralConverter', () => {
      expect(NumberLiteralConverter).toBe(NumberLiteralConverterExported);
    });
    it('FalseLiteralConverter', () => {
      expect(FalseLiteralConverter).toBe(FalseLiteralConverterExported);
    });
    it('TrueLiteralConverter', () => {
      expect(TrueLiteralConverter).toBe(TrueLiteralConverterExported);
    });
    it('EnumLiteralConverter', () => {
      expect(EnumLiteralConverter).toBe(EnumLiteralConverterExported);
    });
    it('ESSymbolConverter', () => {
      expect(ESSymbolConverter).toBe(ESSymbolConverterExported);
    });
    it('VoidConverter', () => {
      expect(VoidConverter).toBe(VoidConverterExported);
    });
    it('NullConverter', () => {
      expect(NullConverter).toBe(NullConverterExported);
    });
    it('UndefinedConverter', () => {
      expect(UndefinedConverter).toBe(UndefinedConverterExported);
    });
    it('NeverConverter', () => {
      expect(NeverConverter).toBe(NeverConverterExported);
    });
    it('TupleConverter', () => {
      expect(TupleConverter).toBe(TupleConverterExported);
    });
    it('UnionConverter', () => {
      expect(UnionConverter).toBe(UnionConverterExported);
    });
    it('ReferenceConverter', () => {
      expect(ReferenceConverter).toBe(ReferenceConverterExported);
    });
    it('ClassConverter', () => {
      expect(ClassConverter).toBe(ClassConverterExported);
    });
    it('UnknownConverter', () => {
      expect(UnknownConverter).toBe(UnknownConverterExported);
    });
    it('FunctionConverter', () => {
      expect(FunctionConverter).toBe(FunctionConverterExported);
    });
    it('ArrayConverter', () => {
      expect(ArrayConverter).toBe(ArrayConverterExported);
    });
    it('PropsOfConverter', () => {
      expect(PropsOfConverter).toBe(PropsOfConverterExported);
    });
    it('TypeOfConverter', () => {
      expect(TypeOfConverter).toBe(TypeOfConverterExported);
    });
    it('TSRuntimeConverter', () => {
      expect(TSRuntimeConverter).toBe(TSRuntimeConverterExported);
    });
  });

  describe('type transformers', () => {
    it('InjectingPropsTransformer', () => {
      expect(InjectingPropsTransformer).toBe(InjectingPropsTransformerExported);
    });
    it('InternalPropsTransformer', () => {
      expect(InternalPropsTransformer).toBe(InternalPropsTransformerExported);
    });
  });

  describe('components', () => {
    it('Typend', () => {
      expect(Typend).toBe(TypendExported);
    });
    it('Validator', () => {
      expect(Validator).toBe(ValidatorExported);
    });
    it('Describer', () => {
      expect(Describer).toBe(DescriberExported);
    });
    it('Description', () => {
      expect(Description).toBe(DescriptionExported);
    });
    it('DescriptionList', () => {
      expect(DescriptionList).toBe(DescriptionListExported);
    });
    it('Pattern', () => {
      expect(Pattern).toBe(PatternExported);
    });
    it('PatternValidator', () => {
      expect(PatternValidator).toBe(PatternValidatorExported);
    });
    it('isInstanceOfExpectation', () => {
      expect(isInstanceOfExpectation).toBe(isInstanceOfExpectationExported);
    });

    describe('helpers', () => {
      it('getResolvablePath', () => {
        expect(getResolvablePath).toBe(getResolvablePathExported);
      });
      it('isResolvablePath', () => {
        expect(isResolvablePath).toBe(isResolvablePathExported);
      });
      it('isPatternClass', () => {
        expect(isPatternClass).toBe(isPatternClassExported);
      });
      it('isPattern', () => {
        expect(isPattern).toBe(isPatternExported);
      });
      it('isUtility', () => {
        expect(isUtility).toBe(isUtilityExported);
      });
      it('isType', () => {
        expect(isType).toBe(isTypeExported);
      });
      it('isValidable', () => {
        expect(isValidable).toBe(isValidableExported);
      });
      it('getMatchingParentProto', () => {
        expect(getMatchingParentProto).toBe(getMatchingParentProtoExported);
      });
      it('isSpecial', () => {
        expect(isSpecial).toBe(isSpecialExported);
      });
    });
  });

  describe('typend end-api', () => {
    it('typend', () => {
      expect(typend).toBeInstanceOf(Typend);
    });
    it('validator', () => {
      expect(validator).toBeInstanceOf(Validator);
    });
    it('describer', () => {
      expect(describer).toBeInstanceOf(Describer);
    });
    it('converter', () => {
      expect(converter).toBeInstanceOf(TSRuntimeConverter);
    });
    it('validate', () => {
      expect(validate).toBeInstanceOf(Function);
    });
    it('isValid', () => {
      expect(isValid).toBeInstanceOf(Function);
    });
    it('isInstanceOf', () => {
      expect(isInstanceOf).toBeInstanceOf(Function);
    });
    it('check', () => {
      expect(check).toBeInstanceOf(Function);
    });
    it('is', () => {
      expect(is).toBeInstanceOf(Function);
    });
    it('instanceOf', () => {
      expect(instanceOf).toBeInstanceOf(Function);
    });
    it('convert', () => {
      expect(convert).toBeInstanceOf(Function);
    });
    it('reflect', () => {
      expect(reflect).toBeInstanceOf(Function);
    });

    describe('default api for patterns', () => {
      it('any', () => {
        expect(any).toBeInstanceOf(Any);
      });
      it('iof', () => {
        expect(iof(String)).toBeInstanceOf(InstanceOf);
      });
      it('collection', () => {
        expect(collection({})).toBeInstanceOf(Collection);
      });
      it('collectionIncluding', () => {
        expect(collectionIncluding({})).toBeInstanceOf(CollectionIncluding);
      });
      it('collectionWithin', () => {
        expect(collectionWithin({})).toBeInstanceOf(CollectionWithin);
      });
      it('eq', () => {
        expect(eq('my-value')).toBeInstanceOf(Equals);
      });
      it('integer', () => {
        expect(integer).toBe(Integer);
      });
      it('list', () => {
        expect(list([String])).toBeInstanceOf(List);
      });
      it('maybe', () => {
        expect(maybe('my-value')).toBeInstanceOf(Maybe);
      });
      it('never', () => {
        expect(never).toBeInstanceOf(Never);
      });
      it('oneOf', () => {
        expect(oneOf([String, Number])).toBeInstanceOf(OneOf);
      });
      it('optional', () => {
        expect(optional(String)).toBeInstanceOf(Optional);
      });
      it('unknown', () => {
        expect(unknown).toBeInstanceOf(Unknown);
      });
      it('unrecognized', () => {
        expect(unrecognized('my-unrecognized-value')).toBeInstanceOf(
          Unrecognized
        );
      });
      it('voided', () => {
        expect(voided).toBeInstanceOf(Void);
      });
      it('where', () => {
        expect(where((): boolean => true)).toBeInstanceOf(Where);
      });
      it('tuple', () => {
        expect(tuple([String, Number, 'my-value'])).toBeInstanceOf(Tuple);
      });
      it('string', () => {
        expect(string).toBe(String);
      });
      it('number', () => {
        expect(number).toBe(Number);
      });
      it('boolean', () => {
        expect(boolean).toBe(Boolean);
      });
      it('symbol', () => {
        expect(symbol).toBe(Symbol);
      });
    });

    describe('PropTypes api for patterns', () => {
      it('PropType.any', () => {
        expect(PropTypes.any).toBeInstanceOf(Any);
      });

      it('PropType.array', () => {
        expect(PropTypes.array).toBe(Array);
      });

      it('PropType.arrayOf', () => {
        expect(PropTypes.arrayOf()).toBeInstanceOf(List);
      });

      it('PropTypes.bool', () => {
        expect(PropTypes.bool).toBe(Boolean);
      });

      it('PropTypes.func', () => {
        expect(PropTypes.func).toBe(Function);
      });

      it('PropType.equal', () => {
        expect(PropTypes.equal('my-value')).toBeInstanceOf(Equals);
      });

      it('PropTypes.instanceOf', () => {
        expect(PropTypes.instanceOf(String)).toBeInstanceOf(InstanceOf);
      });

      it('PropTypes.integer', () => {
        expect(PropTypes.integer).toBe(Integer);
      });

      it('PropTypes.Integer', () => {
        expect(PropTypes.integer).toBe(Integer);
      });

      it('PropTypes.interface', () => {
        expect(PropTypes.interface({})).toBeInstanceOf(Interface);
      });

      it('PropTypes.maybe', () => {
        expect(PropTypes.maybe('my-value')).toBeInstanceOf(Maybe);
      });

      it('PropTypes.never', () => {
        expect(PropTypes.never).toBeInstanceOf(Never);
      });

      it('PropTypes.number', () => {
        expect(PropTypes.number).toBe(Number);
      });

      it('PropTypes.object', () => {
        expect(PropTypes.object).toBeInstanceOf(Collection);
      });

      it('PropTypes.objectOf', () => {
        expect(PropTypes.objectOf(PropTypes.number)).toBeInstanceOf(Collection);
      });

      it('PropTypes.oneOf', () => {
        expect(PropTypes.oneOf([1, 'my-string'])).toBeInstanceOf(OneOf);
      });

      it('PropTypes.oneOfType', () => {
        expect(PropTypes.oneOfType([String, Number])).toBeInstanceOf(OneOf);
      });

      it('PropTypes.shape', () => {
        expect(PropTypes.shape({})).toBeInstanceOf(Collection);
      });

      it('PropTypes.string', () => {
        expect(PropTypes.string).toBe(String);
      });

      it('PropTypes.symbol', () => {
        expect(PropTypes.symbol).toBe(Symbol);
      });

      it('PropTypes.tuple', () => {
        expect(PropTypes.tuple([String, Number, 'my-value'])).toBeInstanceOf(
          Tuple
        );
      });

      it('PropTypes.void', () => {
        expect(PropTypes.void).toBeInstanceOf(Void);
      });

      it('PropTypes.where', () => {
        expect(PropTypes.where((): boolean => true)).toBeInstanceOf(Where);
      });
    });
    it('propsOf', () => {
      class MyClass {}
      expect(propsOf(MyClass)).toBeInstanceOf(PropsOf);
    });
    it('typeOf', () => {
      class MyClass {}
      expect(typeOf(MyClass)).toBeInstanceOf(TypeOf);
    });
  });

  describe('chai', () => {
    it('equivalentClassChaiExported', () => {
      expect(equivalentClassChai).toBe(equivalentClassChaiExported);
    });
  });
});
