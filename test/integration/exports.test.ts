import { expect } from 'chai';
// Annotations
import { internal } from '../../src/annotations/internal';
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
import { Internal } from '../../src/patterns/internal';
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
  Internal as InternalExported,
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
  internal as internalExported,
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
      expect(internal).to.be.equal(internalExported);
    });
    it('Validable', () => {
      expect(Validable).to.be.equal(ValidableExported);
    });
  });

  describe('decorators', () => {
    it('Type', () => {
      expect(Type).to.be.equal(TypeExported);
    });
  });

  describe('errors', () => {
    it('ValidationError', () => {
      expect(ValidationError).to.be.equal(ValidationErrorExported);
    });
    it('InvalidDefinitionError', () => {
      expect(InvalidDefinitionError).to.be.equal(
        InvalidDefinitionErrorExported
      );
    });
    it('InvalidTypeError', () => {
      expect(InvalidTypeError).to.be.equal(InvalidTypeErrorExported);
    });
    it('InvalidValueError', () => {
      expect(InvalidValueError).to.be.equal(InvalidValueErrorExported);
    });
    it('UnequalValueError', () => {
      expect(UnequalValueError).to.be.equal(UnequalValueErrorExported);
    });
    it('UnmatchedTypeError', () => {
      expect(UnmatchedTypeError).to.be.equal(UnmatchedTypeErrorExported);
    });
    it('NotAMemberError', () => {
      expect(NotAMemberError).to.be.equal(NotAMemberErrorExported);
    });
    it('UnexpectedKeyError', () => {
      expect(UnexpectedKeyError).to.be.equal(UnexpectedKeyErrorExported);
    });
    it('UnknownError', () => {
      expect(UnknownError).to.be.equal(UnknownErrorExported);
    });
    it('TypeDescriberExistsError', () => {
      expect(TypeDescriberExistsError).to.be.equal(
        TypeDescriberExistsErrorExported
      );
    });
    it('TypeDescriberNotFoundError', () => {
      expect(TypeDescriberNotFoundError).to.be.equal(
        TypeDescriberNotFoundErrorExported
      );
    });
    it('PatternValidatorExistError', () => {
      expect(PatternValidatorExistError).to.be.equal(
        PatternValidatorExistErrorExported
      );
    });
    it('PatternValidatorNotFoundError', () => {
      expect(PatternValidatorNotFoundError).to.be.equal(
        PatternValidatorNotFoundErrorExported
      );
    });
    it('UndefinableClassError', () => {
      expect(UndefinableClassError).to.be.equal(UndefinableClassErrorExported);
    });
    it('TypeConverterExists', () => {
      expect(TypeConverterExists).to.be.equal(TypeConverterExistsExported);
    });
  });

  describe('patterns', () => {
    it('Any', () => {
      expect(Any).to.be.equal(AnyExported);
    });
    it('Class', () => {
      expect(Class).to.be.equal(ClassExported);
    });
    it('Collection', () => {
      expect(Collection).to.be.equal(CollectionExported);
    });
    it('CollectionIncluding', () => {
      expect(CollectionIncluding).to.be.equal(CollectionIncludingExported);
    });
    it('CollectionWithin', () => {
      expect(CollectionWithin).to.be.equal(CollectionWithinExported);
    });
    it('Equals', () => {
      expect(Equals).to.be.equal(EqualsExported);
    });
    it('InstanceOf', () => {
      expect(InstanceOf).to.be.equal(InstanceOfExported);
    });
    it('Integer', () => {
      expect(Integer).to.be.equal(IntegerExported);
    });
    it('Interface', () => {
      expect(Interface).to.be.equal(InterfaceExported);
    });
    it('Internal', () => {
      expect(Internal).to.be.equal(InternalExported);
    });
    it('List', () => {
      expect(List).to.be.equal(ListExported);
    });
    it('LocaleString', () => {
      expect(LocaleString).to.be.equal(LocaleStringExported);
    });
    it('Maybe', () => {
      expect(Maybe).to.be.equal(MaybeExported);
    });
    it('Never', () => {
      expect(Never).to.be.equal(NeverExported);
    });
    it('OneOf', () => {
      expect(OneOf).to.be.equal(OneOfExported);
    });
    it('Optional', () => {
      expect(Optional).to.be.equal(OptionalExported);
    });
    it('Tuple', () => {
      expect(Tuple).to.be.equal(TupleExported);
    });
    it('Unknown', () => {
      expect(Unknown).to.be.equal(UnknownExported);
    });
    it('Unrecognized', () => {
      expect(Unrecognized).to.be.equal(UnrecognizedExported);
    });
    it('Void', () => {
      expect(Void).to.be.equal(VoidExported);
    });
    it('Where', () => {
      expect(Where).to.be.equal(WhereExported);
    });
    it('WrapperPattern', () => {
      expect(WrapperPattern).to.be.equal(WrapperPatternExported);
    });
  });

  describe('', () => {
    it('PropsOf', () => {
      expect(PropsOf).to.be.equal(PropsOfExported);
    });
    it('TypeOf', () => {
      expect(TypeOf).to.be.equal(TypeOfExported);
    });
  });

  describe('validators', () => {
    it('AnyValidator', () => {
      expect(AnyValidator).to.be.equal(AnyValidatorExported);
    });
    it('ClassValidator', () => {
      expect(ClassValidator).to.be.equal(ClassValidatorExported);
    });
    it('CollectionIncludingValidator', () => {
      expect(CollectionIncludingValidator).to.be.equal(
        CollectionIncludingValidatorExported
      );
    });
    it('CollectionWithinValidator', () => {
      expect(CollectionWithinValidator).to.be.equal(
        CollectionWithinValidatorExported
      );
    });
    it('CollectionValidator', () => {
      expect(CollectionValidator).to.be.equal(CollectionValidatorExported);
    });
    it('EqualsValidator', () => {
      expect(EqualsValidator).to.be.equal(EqualsValidatorExported);
    });
    it('InstanceOfValidator', () => {
      expect(InstanceOfValidator).to.be.equal(InstanceOfValidatorExported);
    });
    it('IntegerValidator', () => {
      expect(IntegerValidator).to.be.equal(IntegerValidatorExported);
    });
    it('InterfaceValidator', () => {
      expect(InterfaceValidator).to.be.equal(InterfaceValidatorExported);
    });
    it('InternalValidator', () => {
      expect(InternalValidator).to.be.equal(InternalValidatorExported);
    });
    it('ListValidator', () => {
      expect(ListValidator).to.be.equal(ListValidatorExported);
    });
    it('LocaleStringValidator', () => {
      expect(LocaleStringValidator).to.be.equal(LocaleStringValidatorExported);
    });
    it('MaybeValidator', () => {
      expect(MaybeValidator).to.be.equal(MaybeValidatorExported);
    });
    it('NeverValidator', () => {
      expect(NeverValidator).to.be.equal(NeverValidatorExported);
    });
    it('OneOfValidator', () => {
      expect(OneOfValidator).to.be.equal(OneOfValidatorExported);
    });
    it('OptionalValidator', () => {
      expect(OptionalValidator).to.be.equal(OptionalValidatorExported);
    });
    it('TupleValidator', () => {
      expect(TupleValidator).to.be.equal(TupleValidatorExported);
    });
    it('UnknownValidator', () => {
      expect(UnknownValidator).to.be.equal(UnknownValidatorExported);
    });
    it('UnrecognizedValidator', () => {
      expect(UnrecognizedValidator).to.be.equal(UnrecognizedValidatorExported);
    });
    it('VoidValidator', () => {
      expect(VoidValidator).to.be.equal(VoidValidatorExported);
    });
    it('WhereValidator', () => {
      expect(WhereValidator).to.be.equal(WhereValidatorExported);
    });
  });

  describe('describers', () => {
    it('ArrayDescriber', () => {
      expect(ArrayDescriber).to.be.equal(ArrayDescriberExported);
    });
    it('ErrorDescriber', () => {
      expect(ErrorDescriber).to.be.equal(ErrorDescriberExported);
    });
    it('NativeTypeDescriber', () => {
      expect(NativeTypeDescriber).to.be.equal(NativeTypeDescriberExported);
    });
    it('ObjectDescriber', () => {
      expect(ObjectDescriber).to.be.equal(ObjectDescriberExported);
    });
    it('CompactDescriber', () => {
      expect(CompactDescriber).to.be.equal(CompactDescriberExported);
    });
    it('ClassDescriber', () => {
      expect(ClassDescriber).to.be.equal(ClassDescriberExported);
    });
    it('FallbackDescriber', () => {
      expect(FallbackDescriber).to.be.equal(FallbackDescriberExported);
    });
    it('DescriptionListDescriber', () => {
      expect(DescriptionListDescriber).to.be.equal(
        DescriptionListDescriberExported
      );
    });
    it('DebugDescriber', () => {
      expect(DebugDescriber).to.be.equal(DebugDescriberExported);
    });
  });

  describe('converters', () => {
    it('AnyConverter', () => {
      expect(AnyConverter).to.be.equal(AnyConverterExported);
    });
    it('StringConverter', () => {
      expect(StringConverter).to.be.equal(StringConverterExported);
    });
    it('NumberConverter', () => {
      expect(NumberConverter).to.be.equal(NumberConverterExported);
    });
    it('BooleanConverter', () => {
      expect(BooleanConverter).to.be.equal(BooleanConverterExported);
    });
    it('StringLiteralConverter', () => {
      expect(StringLiteralConverter).to.be.equal(
        StringLiteralConverterExported
      );
    });
    it('NumberLiteralConverter', () => {
      expect(NumberLiteralConverter).to.be.equal(
        NumberLiteralConverterExported
      );
    });
    it('FalseLiteralConverter', () => {
      expect(FalseLiteralConverter).to.be.equal(FalseLiteralConverterExported);
    });
    it('TrueLiteralConverter', () => {
      expect(TrueLiteralConverter).to.be.equal(TrueLiteralConverterExported);
    });
    it('EnumLiteralConverter', () => {
      expect(EnumLiteralConverter).to.be.equal(EnumLiteralConverterExported);
    });
    it('ESSymbolConverter', () => {
      expect(ESSymbolConverter).to.be.equal(ESSymbolConverterExported);
    });
    it('VoidConverter', () => {
      expect(VoidConverter).to.be.equal(VoidConverterExported);
    });
    it('NullConverter', () => {
      expect(NullConverter).to.be.equal(NullConverterExported);
    });
    it('UndefinedConverter', () => {
      expect(UndefinedConverter).to.be.equal(UndefinedConverterExported);
    });
    it('NeverConverter', () => {
      expect(NeverConverter).to.be.equal(NeverConverterExported);
    });
    it('TupleConverter', () => {
      expect(TupleConverter).to.be.equal(TupleConverterExported);
    });
    it('UnionConverter', () => {
      expect(UnionConverter).to.be.equal(UnionConverterExported);
    });
    it('ReferenceConverter', () => {
      expect(ReferenceConverter).to.be.equal(ReferenceConverterExported);
    });
    it('ClassConverter', () => {
      expect(ClassConverter).to.be.equal(ClassConverterExported);
    });
    it('UnknownConverter', () => {
      expect(UnknownConverter).to.be.equal(UnknownConverterExported);
    });
    it('FunctionConverter', () => {
      expect(FunctionConverter).to.be.equal(FunctionConverterExported);
    });
    it('ArrayConverter', () => {
      expect(ArrayConverter).to.be.equal(ArrayConverterExported);
    });
    it('PropsOfConverter', () => {
      expect(PropsOfConverter).to.be.equal(PropsOfConverterExported);
    });
    it('TypeOfConverter', () => {
      expect(TypeOfConverter).to.be.equal(TypeOfConverterExported);
    });
    it('TSRuntimeConverter', () => {
      expect(TSRuntimeConverter).to.be.equal(TSRuntimeConverterExported);
    });
  });

  describe('type transformers', () => {
    it('InjectingPropsTransformer', () => {
      expect(InjectingPropsTransformer).to.be.equal(
        InjectingPropsTransformerExported
      );
    });
    it('InternalPropsTransformer', () => {
      expect(InternalPropsTransformer).to.be.equal(
        InternalPropsTransformerExported
      );
    });
  });

  describe('components', () => {
    it('Typend', () => {
      expect(Typend).to.be.equal(TypendExported);
    });
    it('Validator', () => {
      expect(Validator).to.be.equal(ValidatorExported);
    });
    it('Describer', () => {
      expect(Describer).to.be.equal(DescriberExported);
    });
    it('Description', () => {
      expect(Description).to.be.equal(DescriptionExported);
    });
    it('DescriptionList', () => {
      expect(DescriptionList).to.be.equal(DescriptionListExported);
    });
    it('Pattern', () => {
      expect(Pattern).to.be.equal(PatternExported);
    });
    it('PatternValidator', () => {
      expect(PatternValidator).to.be.equal(PatternValidatorExported);
    });
    it('isInstanceOfExpectation', () => {
      expect(isInstanceOfExpectation).to.be.equal(
        isInstanceOfExpectationExported
      );
    });

    describe('helpers', () => {
      it('getResolvablePath', () => {
        expect(getResolvablePath).to.be.equal(getResolvablePathExported);
      });
      it('isResolvablePath', () => {
        expect(isResolvablePath).to.be.equal(isResolvablePathExported);
      });
      it('isPatternClass', () => {
        expect(isPatternClass).to.be.equal(isPatternClassExported);
      });
      it('isPattern', () => {
        expect(isPattern).to.be.equal(isPatternExported);
      });
      it('isUtility', () => {
        expect(isUtility).to.be.equal(isUtilityExported);
      });
      it('isType', () => {
        expect(isType).to.be.equal(isTypeExported);
      });
      it('isValidable', () => {
        expect(isValidable).to.be.equal(isValidableExported);
      });
      it('getMatchingParentProto', () => {
        expect(getMatchingParentProto).to.be.equal(
          getMatchingParentProtoExported
        );
      });
      it('isSpecial', () => {
        expect(isSpecial).to.be.equal(isSpecialExported);
      });
    });
  });

  describe('typend end-api', () => {
    it('typend', () => {
      expect(typend).to.be.instanceof(Typend);
    });
    it('validator', () => {
      expect(validator).to.be.instanceOf(Validator);
    });
    it('describer', () => {
      expect(describer).to.be.instanceOf(Describer);
    });
    it('converter', () => {
      expect(converter).to.be.instanceOf(TSRuntimeConverter);
    });
    it('validate', () => {
      expect(validate).to.be.instanceof(Function);
    });
    it('isValid', () => {
      expect(isValid).to.be.instanceof(Function);
    });
    it('isInstanceOf', () => {
      expect(isInstanceOf).to.be.instanceof(Function);
    });
    it('check', () => {
      expect(check).to.be.instanceof(Function);
    });
    it('is', () => {
      expect(is).to.be.instanceof(Function);
    });
    it('instanceOf', () => {
      expect(instanceOf).to.be.instanceof(Function);
    });
    it('convert', () => {
      expect(convert).to.be.instanceof(Function);
    });
    it('reflect', () => {
      expect(reflect).to.be.instanceof(Function);
    });

    describe('default api for patterns', () => {
      it('any', () => {
        expect(any).to.be.instanceof(Any);
      });
      it('iof', () => {
        expect(iof(String)).to.be.instanceof(InstanceOf);
      });
      it('collection', () => {
        expect(collection({})).to.be.instanceof(Collection);
      });
      it('collectionIncluding', () => {
        expect(collectionIncluding({})).to.be.instanceof(CollectionIncluding);
      });
      it('collectionWithin', () => {
        expect(collectionWithin({})).to.be.instanceof(CollectionWithin);
      });
      it('eq', () => {
        expect(eq('my-value')).to.be.instanceof(Equals);
      });
      it('integer', () => {
        expect(integer).to.be.equal(Integer);
      });
      it('list', () => {
        expect(list([String])).to.be.instanceof(List);
      });
      it('maybe', () => {
        expect(maybe('my-value')).to.be.instanceof(Maybe);
      });
      it('never', () => {
        expect(never).to.be.instanceof(Never);
      });
      it('oneOf', () => {
        expect(oneOf([String, Number])).to.be.instanceof(OneOf);
      });
      it('optional', () => {
        expect(optional(String)).to.be.instanceof(Optional);
      });
      it('unknown', () => {
        expect(unknown).to.be.instanceof(Unknown);
      });
      it('unrecognized', () => {
        expect(unrecognized('my-unrecognized-value')).to.be.instanceof(
          Unrecognized
        );
      });
      it('voided', () => {
        expect(voided).to.be.instanceof(Void);
      });
      it('where', () => {
        expect(where((): boolean => true)).to.be.instanceof(Where);
      });
      it('tuple', () => {
        expect(tuple([String, Number, 'my-value'])).to.be.instanceof(Tuple);
      });
      it('string', () => {
        expect(string).to.be.equal(String);
      });
      it('number', () => {
        expect(number).to.be.equal(Number);
      });
      it('boolean', () => {
        expect(boolean).to.be.equal(Boolean);
      });
      it('symbol', () => {
        expect(symbol).to.be.equal(Symbol);
      });
    });

    describe('PropTypes api for patterns', () => {
      it('PropType.any', () => {
        expect(PropTypes.any).to.be.instanceof(Any);
      });

      it('PropType.array', () => {
        expect(PropTypes.array).to.be.equal(Array);
      });

      it('PropType.arrayOf', () => {
        expect(PropTypes.arrayOf()).to.be.instanceof(List);
      });

      it('PropTypes.bool', () => {
        expect(PropTypes.bool).to.be.equal(Boolean);
      });

      it('PropTypes.func', () => {
        expect(PropTypes.func).to.be.equal(Function);
      });

      it('PropType.equal', () => {
        expect(PropTypes.equal('my-value')).to.be.instanceof(Equals);
      });

      it('PropTypes.instanceOf', () => {
        expect(PropTypes.instanceOf(String)).to.be.instanceof(InstanceOf);
      });

      it('PropTypes.integer', () => {
        expect(PropTypes.integer).to.be.equal(Integer);
      });

      it('PropTypes.Integer', () => {
        expect(PropTypes.integer).to.be.equal(Integer);
      });

      it('PropTypes.interface', () => {
        expect(PropTypes.interface({})).to.be.instanceof(Interface);
      });

      it('PropTypes.maybe', () => {
        expect(PropTypes.maybe('my-value')).to.be.instanceof(Maybe);
      });

      it('PropTypes.never', () => {
        expect(PropTypes.never).to.be.instanceof(Never);
      });

      it('PropTypes.number', () => {
        expect(PropTypes.number).to.be.equal(Number);
      });

      it('PropTypes.object', () => {
        expect(PropTypes.object).to.be.instanceof(Collection);
      });

      it('PropTypes.objectOf', () => {
        expect(PropTypes.objectOf(PropTypes.number)).to.be.instanceof(
          Collection
        );
      });

      it('PropTypes.oneOf', () => {
        expect(PropTypes.oneOf([1, 'my-string'])).to.be.instanceof(OneOf);
      });

      it('PropTypes.oneOfType', () => {
        expect(PropTypes.oneOfType([String, Number])).to.be.instanceof(OneOf);
      });

      it('PropTypes.shape', () => {
        expect(PropTypes.shape({})).to.be.instanceof(Collection);
      });

      it('PropTypes.string', () => {
        expect(PropTypes.string).to.be.equal(String);
      });

      it('PropTypes.symbol', () => {
        expect(PropTypes.symbol).to.be.equal(Symbol);
      });

      it('PropTypes.tuple', () => {
        expect(PropTypes.tuple([String, Number, 'my-value'])).to.be.instanceof(
          Tuple
        );
      });

      it('PropTypes.void', () => {
        expect(PropTypes.void).to.be.instanceof(Void);
      });

      it('PropTypes.where', () => {
        expect(PropTypes.where((): boolean => true)).to.be.instanceof(Where);
      });
    });
    it('propsOf', () => {
      class MyClass {}
      expect(propsOf(MyClass)).to.be.instanceof(PropsOf);
    });
    it('typeOf', () => {
      class MyClass {}
      expect(typeOf(MyClass)).to.be.instanceof(TypeOf);
    });
  });

  describe('chai', () => {
    it('equivalentClassChaiExported', () => {
      expect(equivalentClassChai).to.be.equal(equivalentClassChaiExported);
    });
  });
});
