import { expect } from 'chai';
// Annotations
import { internal } from '../../src/annotations/internal';
import { validable } from '../../src/annotations/validable';
// Decorators
import { define } from '../../src/decorators/define';
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
import { Maybe } from '../../src/patterns/maybe';
import { Never } from '../../src/patterns/never';
import { OneOf } from '../../src/patterns/one-of';
import { Optional } from '../../src/patterns/optional';
import { Tuple } from '../../src/patterns/tuple';
import { Unknown } from '../../src/patterns/unknown';
import { Unrecognized } from '../../src/patterns/unrecognized';
import { Void } from '../../src/patterns/void';
import { Where } from '../../src/patterns/where';
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
import { ArrayConverter } from '../../src/converters/tsruntime/type-converters/array-converter';
import { ClassConverter } from '../../src/converters/tsruntime/type-converters/class-converter';
import { FunctionConverter } from '../../src/converters/tsruntime/type-converters/function-converter';
import { NativeConverter } from '../../src/converters/tsruntime/type-converters/native-converter';
import { NilConverter } from '../../src/converters/tsruntime/type-converters/nil-converter';
import { ObjectConverter } from '../../src/converters/tsruntime/type-converters/object-converter';
import { PrimitiveConverter } from '../../src/converters/tsruntime/type-converters/primitive-converter';
import { ReferenceConverter } from '../../src/converters/tsruntime/type-converters/reference-converter';
import { TupleConverter } from '../../src/converters/tsruntime/type-converters/tuple-converter';
import { UnionConverter } from '../../src/converters/tsruntime/type-converters/union-converter';
import { UnknownConverter } from '../../src/converters/tsruntime/type-converters/unknown-converter';
import { UnrecognizedConverter } from '../../src/converters/tsruntime/type-converters/unrecognized-converter';
import { LiteralConverter } from '../../src/converters/tsruntime/type-converters/literal-converter';
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
  isDefinable,
  isValidable,
  getMatchingParentProto,
  isSpecial,
} from '../../src/helpers';

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
  Maybe as MaybeExported,
  Never as NeverExported,
  OneOf as OneOfExported,
  Optional as OptionalExported,
  Tuple as TupleExported,
  Unknown as UnknownExported,
  Unrecognized as UnrecognizedExported,
  Void as VoidExported,
  Where as WhereExported,
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
  ArrayConverter as ArrayConverterExported,
  ClassConverter as ClassConverterExported,
  FunctionConverter as FunctionConverterExported,
  NativeConverter as NativeConverterExported,
  NilConverter as NilConverterExported,
  ObjectConverter as ObjectConverterExported,
  PrimitiveConverter as PrimitiveConverterExported,
  ReferenceConverter as ReferenceConverterExported,
  TupleConverter as TupleConverterExported,
  UnionConverter as UnionConverterExported,
  UnknownConverter as UnknownConverterExported,
  UnrecognizedConverter as UnrecognizedConverterExported,
  LiteralConverter as LiteralConverterExported,
  TSRuntimeConverter as TSRuntimeConverterExported,
  PropsOfConverter as PropsOfConverterExported,
  TypeOfConverter as TypeOfConverterExported,
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
  isDefinable as isDefinableExported,
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
  validable as validableExported,
  // Decorators
  define as defineExported,
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
} from '../../src/index';

describe('exports', () => {
  describe('annotations', () => {
    it('internal', () => {
      expect(internal).to.be.equal(internalExported);
    });
    it('validable', () => {
      expect(validable).to.be.equal(validableExported);
    });
  });

  describe('decorators', () => {
    it('define', () => {
      expect(define).to.be.equal(defineExported);
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
    it('ArrayConverter', () => {
      expect(ArrayConverter).to.be.equal(ArrayConverterExported);
    });
    it('ClassConverter', () => {
      expect(ClassConverter).to.be.equal(ClassConverterExported);
    });
    it('FunctionConverter', () => {
      expect(FunctionConverter).to.be.equal(FunctionConverterExported);
    });
    it('NativeConverter', () => {
      expect(NativeConverter).to.be.equal(NativeConverterExported);
    });
    it('NilConverter', () => {
      expect(NilConverter).to.be.equal(NilConverterExported);
    });
    it('ObjectConverter', () => {
      expect(ObjectConverter).to.be.equal(ObjectConverterExported);
    });
    it('PrimitiveConverter', () => {
      expect(PrimitiveConverter).to.be.equal(PrimitiveConverterExported);
    });
    it('ReferenceConverter', () => {
      expect(ReferenceConverter).to.be.equal(ReferenceConverterExported);
    });
    it('TupleConverter', () => {
      expect(TupleConverter).to.be.equal(TupleConverterExported);
    });
    it('UnionConverter', () => {
      expect(UnionConverter).to.be.equal(UnionConverterExported);
    });
    it('UnknownConverter', () => {
      expect(UnknownConverter).to.be.equal(UnknownConverterExported);
    });
    it('UnrecognizedConverter', () => {
      expect(UnrecognizedConverter).to.be.equal(UnrecognizedConverterExported);
    });
    it('LiteralConverter', () => {
      expect(LiteralConverter).to.be.equal(LiteralConverterExported);
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
      it('isDefinable', () => {
        expect(isDefinable).to.be.equal(isDefinableExported);
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
      expect(oneOf(String, Number)).to.be.instanceof(OneOf);
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
      expect(
        where((): boolean => {
          return true;
        })
      ).to.be.instanceof(Where);
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

    it('propsOf', () => {
      class MyClass {}
      expect(propsOf(MyClass)).to.be.instanceof(PropsOf);
    });
    it('typeOf', () => {
      class MyClass {}
      expect(typeOf(MyClass)).to.be.instanceof(TypeOf);
    });
  });
});
