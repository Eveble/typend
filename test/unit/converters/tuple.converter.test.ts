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
import { reflect } from 'tsruntime';
import { mock } from 'vitest-mock-extended';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { TupleConverter } from '../../../src/converters/tsruntime/type-converters/tuple.converter';
import { types } from '../../../src/types';
import { Tuple } from '../../../src/patterns/tuple';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { Type } from '../../../src/decorators/type.decorator';

describe(`TupleConverter`, () => {
  let converter: any;
  let typeConverter: TupleConverter;

  beforeEach(() => {
    converter = mock<types.Converter>();
    typeConverter = new TupleConverter();
  });

  type MyType = {
    first: string;
  };

  type MyOtherType = {
    second: number;
  };

  interface MyInterface {
    first: string;
  }

  interface MyOtherInterface {
    second: number;
  }

  @Type()
  class MyClass {
    first: string;
  }

  @Type()
  class MyOtherClass {
    second: number;
  }

  describe('evaluation', () => {
    it('returns true for primitive types list', () => {
      const examples: [string, any][] = [
        ['[null]', reflect<[null]>()],
        ['[undefined]', reflect<[undefined]>()],
        ['[string]', reflect<[string]>()],
        ['[number]', reflect<[number]>()],
        ['[boolean]', reflect<[boolean]>()],
        ['[symbol]', reflect<[symbol]>()],
        [
          '[null, undefined, string, number, boolean, symbol,]',
          reflect<[null, undefined, string, number, boolean, symbol]>(),
        ],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns true for primitive literal types list', () => {
      const examples: [string, any][] = [
        [`['my-string']`, reflect<['my-string']>()],
        ['[69]', reflect<[69]>()],
        ['[true]', reflect<[true]>()],
        ['[false]', reflect<[false]>()],
        [
          `['my-string', 69, true, false]`,
          reflect<['my-string', 69, true, false]>(),
        ],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns true for native types list', () => {
      const examples: [string, any][] = [
        ['[any]', reflect<[any]>()],
        ['[void]', reflect<[void]>()],
        ['[never]', reflect<[never]>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns true for types list', () => {
      const examples: [string, any][] = [
        ['[MyType, MyOtherType]', reflect<[MyType, MyOtherType]>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns true for interfaces types list', () => {
      const examples: [string, any][] = [
        [
          '[MyInterface, MyOtherInterface]',
          reflect<[MyInterface, MyOtherInterface]>(),
        ],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns true for classes types list', () => {
      const examples: [string, any][] = [
        ['[MyClass, MyOtherClass]', reflect<[MyClass, MyOtherClass]>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns false for non-tuple types', () => {
      const examples: [string, any][] = [
        ['string', { kind: TypeKind.String }],
        ['number', { kind: TypeKind.Number }],
        ['object', { kind: TypeKind.Object }],
        ['union', { kind: TypeKind.Union }],
        ['reference', { kind: TypeKind.Reference }],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to not be convertible`
        ).toBe(false);
      }
    });
  });

  describe('reflection', () => {
    it('reflects tuple as an array', () => {
      converter.reflect
        .calledWith(expect.objectContaining({ kind: 2 }))
        .mockReturnValue(String);
      converter.reflect
        .calledWith(expect.objectContaining({ kind: 3 }))
        .mockReturnValue(Number);
      converter.reflect
        .calledWith(expect.objectContaining({ kind: 4 }))
        .mockReturnValue(Boolean);
      expect(
        typeConverter.reflect(reflect<[string, number, boolean]>(), converter)
      ).toEqual([String, Number, Boolean]);
    });

    it('reflects tuple with reference types as type constructors', () => {
      const tupleType: any = {
        kind: TypeKind.Tuple,
        elementTypes: [
          { kind: TypeKind.Reference, type: MyClass },
          { kind: TypeKind.Reference, type: MyOtherClass },
        ],
      };

      expect(typeConverter.reflect(tupleType, converter)).toEqual([
        MyClass,
        MyOtherClass,
      ]);
    });

    it('reflects mixed tuple with primitives and references', () => {
      const tupleType: any = {
        kind: TypeKind.Tuple,
        elementTypes: [
          { kind: TypeKind.String },
          { kind: TypeKind.Reference, type: MyClass },
          { kind: TypeKind.Number },
        ],
      };

      converter.reflect
        .calledWith(expect.objectContaining({ kind: TypeKind.String }))
        .mockReturnValue(String);
      converter.reflect
        .calledWith(expect.objectContaining({ kind: TypeKind.Number }))
        .mockReturnValue(Number);

      expect(typeConverter.reflect(tupleType, converter)).toEqual([
        String,
        MyClass,
        Number,
      ]);
    });

    it('converts tuple with initializer containing reference types', () => {
      const tupleType: any = {
        kind: TypeKind.Tuple,
        initializer: (): any => [new MyClass(), 42],
        elementTypes: [
          { kind: TypeKind.Reference, type: MyClass },
          { kind: TypeKind.Number },
        ],
      };

      converter.convert
        .calledWith(expect.objectContaining({ kind: TypeKind.Number }))
        .mockReturnValue(Number);

      const result = typeConverter.convert(tupleType, converter);
      expect(result).toBeInstanceOf(Tuple);
      expect(result).toEqual([new InstanceOf(MyClass), Number]);
      expect(result.hasInitializer()).toBe(true);
      expect(result.getInitializer()).toBeInstanceOf(Array);
      expect(result.getInitializer()[0]).toBeInstanceOf(MyClass);
      expect(result.getInitializer()[1]).toBe(42);
    });
  });

  describe('conversion', () => {
    it('converts tuple as instance of Tuple pattern', () => {
      converter.convert
        .calledWith(expect.objectContaining({ kind: 2 }))
        .mockReturnValue(String);
      converter.convert
        .calledWith(expect.objectContaining({ kind: 3 }))
        .mockReturnValue(Number);
      converter.convert
        .calledWith(expect.objectContaining({ kind: 4 }))
        .mockReturnValue(Boolean);
      const result = typeConverter.convert(
        reflect<[string, number, boolean]>(),
        converter
      );
      expect(result).toBeInstanceOf(Tuple);
      expect(result).toEqual([String, Number, Boolean]);
    });

    it('converts tuple assigned as property with initializer', () => {
      const reflectedType = {
        kind: 16,
        initializer: (): any => ['my-value', 1337, true],
        elementTypes: [{ kind: 2 }, { kind: 3 }, { kind: 4 }],
      };

      converter.convert
        .calledWith(expect.objectContaining({ kind: 2 }))
        .mockReturnValue(String);
      converter.convert
        .calledWith(expect.objectContaining({ kind: 3 }))
        .mockReturnValue(Number);
      converter.convert
        .calledWith(expect.objectContaining({ kind: 4 }))
        .mockReturnValue(Boolean);
      const result = typeConverter.convert(reflectedType, converter);
      expect(result).toBeInstanceOf(Tuple);
      expect(result).toEqual([String, Number, Boolean]);
      expect(result.hasInitializer()).toBe(true);
      expect(result.getInitializer()).toEqual(['my-value', 1337, true]);
    });

    it('converts tuple with reference types as InstanceOf patterns', () => {
      const tupleType: any = {
        kind: TypeKind.Tuple,
        elementTypes: [
          { kind: TypeKind.Reference, type: MyClass },
          { kind: TypeKind.Reference, type: MyOtherClass },
        ],
      };

      const result = typeConverter.convert(tupleType, converter);
      expect(result).toBeInstanceOf(Tuple);
      expect(result).toEqual([
        new InstanceOf(MyClass),
        new InstanceOf(MyOtherClass),
      ]);
    });

    it('converts mixed tuple with primitives and references', () => {
      const tupleType: any = {
        kind: TypeKind.Tuple,
        elementTypes: [
          { kind: TypeKind.String },
          { kind: TypeKind.Reference, type: MyClass },
          { kind: TypeKind.Number },
        ],
      };

      converter.convert
        .calledWith(expect.objectContaining({ kind: TypeKind.String }))
        .mockReturnValue(String);
      converter.convert
        .calledWith(expect.objectContaining({ kind: TypeKind.Number }))
        .mockReturnValue(Number);

      const result = typeConverter.convert(tupleType, converter);
      expect(result).toBeInstanceOf(Tuple);
      expect(result).toEqual([String, new InstanceOf(MyClass), Number]);
    });
  });
});
