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
import { reflect, Types as tsruntimeTypes } from 'tsruntime';
import { mock } from 'vitest-mock-extended';
import { ReferenceConverter } from '../../../src/converters/tsruntime/type-converters/reference.converter';
import { types } from '../../../src/types';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { TypeKind } from '../../../src/enums/type-kind.enum';
import { Type } from '../../../src/decorators/type.decorator';

describe(`ReferenceConverter`, () => {
  let converter: any;
  let arrayConverter: any;
  let classConverter: any;
  let typeConverter: ReferenceConverter;

  beforeEach(() => {
    converter = mock<types.Converter>();
    arrayConverter = mock<types.TypeConverter>();
    classConverter = mock<types.TypeConverter>();
    typeConverter = new ReferenceConverter();
  });

  @Type()
  class MyClass {
    field: string;
  }

  describe('evaluation', () => {
    it('returns true for Reference type (TypeKind.Reference = 18)', () => {
      const referenceType = { kind: 18 };
      expect(typeConverter.isConvertible(referenceType)).toBe(true);
    });

    it('returns true for Array with generic type declaration', () => {
      const examples: [string, any][] = [
        ['Function', reflect<Function>()],
        ['MyClass', reflect<MyClass>()],
        ['Array<any>', reflect<Array<any>>()],
        ['number[]', reflect<number[]>()],
        [`a'[]`, reflect<'a'[]>()],
        ['69[]', reflect<69[]>()],
        ['Array<string>', reflect<Array<string>>()],
        ['RegExp', reflect<RegExp>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns false for non-reference types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).toBe(false);
      expect(typeConverter.isConvertible(reflect<number>())).toBe(false);
      expect(typeConverter.isConvertible({ kind: 15 } as any)).toBe(false); // Object
      expect(typeConverter.isConvertible({ kind: 16 } as any)).toBe(false); // Tuple
      expect(typeConverter.isConvertible({ kind: 17 } as any)).toBe(false); // Union
    });
  });

  describe('conversion', () => {
    describe('type', () => {
      it('converts references type as instance of InstanceOf pattern', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          type: MyClass,
          arguments: [],
        };

        // Ensure array converter check returns false
        converter.getConverter
          .calledWith(TypeKind.Array)
          .mockReturnValue(arrayConverter);
        arrayConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(false);

        // Ensure class converter check returns true
        converter.getConverter
          .calledWith(TypeKind.Class)
          .mockReturnValue(classConverter);
        classConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(true);
        classConverter.convert
          .calledWith(reflectedType, converter)
          .mockReturnValue(new InstanceOf(MyClass));

        const result = typeConverter.convert(reflectedType, converter);
        expect(result).toBeInstanceOf(InstanceOf);
        expect(result).toEqual(new InstanceOf(MyClass));

        // Verify converter interactions
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Class);
        expect(classConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(classConverter.convert).toHaveBeenCalledWith(
          reflectedType,
          converter
        );
      });

      it('converts references type as instance of InstanceOf pattern with property initializer', () => {
        const initializer = new MyClass();
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          initializer: (): any => initializer,
          type: MyClass,
          arguments: [],
        };

        // Ensure array converter check returns false
        converter.getConverter
          .calledWith(TypeKind.Array)
          .mockReturnValue(arrayConverter);
        arrayConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(false);

        // Ensure class converter check returns true
        converter.getConverter
          .calledWith(TypeKind.Class)
          .mockReturnValue(classConverter);
        classConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(true);
        const convertedInstance = new InstanceOf(MyClass);
        convertedInstance.setInitializer(initializer);
        classConverter.convert
          .calledWith(reflectedType, converter)
          .mockReturnValue(convertedInstance);

        const result = typeConverter.convert(reflectedType, converter);
        expect(result).toBeInstanceOf(InstanceOf);
        expect(result.hasInitializer()).toBe(true);
        expect(result.getInitializer()).toBe(initializer);

        // Verify converter interactions
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Class);
        expect(classConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(classConverter.convert).toHaveBeenCalledWith(
          reflectedType,
          converter
        );
      });

      it('returns direct InstanceOf when no specific converter matches', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          type: MyClass,
          arguments: [],
        };

        // Ensure both converters return false
        converter.getConverter
          .calledWith(TypeKind.Array)
          .mockReturnValue(arrayConverter);
        arrayConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(false);
        converter.getConverter
          .calledWith(TypeKind.Class)
          .mockReturnValue(classConverter);
        classConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(false);

        const result = typeConverter.convert(reflectedType, converter);
        expect(result).toBeInstanceOf(InstanceOf);
        expect(result).toEqual(new InstanceOf(MyClass));

        // Verify converter interactions but no convert calls
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Class);
        expect(classConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(arrayConverter.convert).not.toHaveBeenCalled();
        expect(classConverter.convert).not.toHaveBeenCalled();
      });
    });

    describe('array', () => {
      it('converts referenced array with array converter', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          arguments: [{ kind: 2 }],
          type: Array,
        };
        const convertedArray = ['converted-array'];

        // Ensure array converter check returns true
        converter.getConverter
          .calledWith(TypeKind.Array)
          .mockReturnValue(arrayConverter);
        arrayConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(true);
        arrayConverter.convert
          .calledWith(reflectedType, converter)
          .mockReturnValue(convertedArray);

        const arrayType = typeConverter.convert(reflectedType, converter);
        expect(arrayType).toBe(convertedArray);

        // Verify converter interactions
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(arrayConverter.convert).toHaveBeenCalledWith(
          reflectedType,
          converter
        );
        // Class converter should not be called since array converter handled it
        expect(converter.getConverter).not.toHaveBeenCalledWith(TypeKind.Class);
      });
    });
  });

  describe('reflection', () => {
    describe('type', () => {
      it('returns references type', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          type: MyClass,
          arguments: [],
        };

        // Ensure array converter check returns false
        converter.getConverter
          .calledWith(TypeKind.Array)
          .mockReturnValue(arrayConverter);
        arrayConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(false);

        // Ensure class converter check returns true
        converter.getConverter
          .calledWith(TypeKind.Class)
          .mockReturnValue(classConverter);
        classConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(true);
        classConverter.reflect
          .calledWith(reflectedType, converter)
          .mockReturnValue(MyClass);

        const result = typeConverter.reflect(reflectedType, converter);
        expect(result).toBe(MyClass);

        // Verify converter interactions
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Class);
        expect(classConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(classConverter.reflect).toHaveBeenCalledWith(
          reflectedType,
          converter
        );
      });

      it('returns direct type reference when no specific converter matches', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          type: MyClass,
          arguments: [],
        };

        // Ensure both converters return false
        converter.getConverter
          .calledWith(TypeKind.Array)
          .mockReturnValue(arrayConverter);
        arrayConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(false);
        converter.getConverter
          .calledWith(TypeKind.Class)
          .mockReturnValue(classConverter);
        classConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(false);

        const result = typeConverter.reflect(reflectedType, converter);
        expect(result).toBe(MyClass);

        // Verify converter interactions but no reflect calls
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Class);
        expect(classConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(arrayConverter.reflect).not.toHaveBeenCalled();
        expect(classConverter.reflect).not.toHaveBeenCalled();
      });
    });

    describe('array', () => {
      it('reflects referenced array with array converter', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          arguments: [{ kind: 2 }],
          type: Array,
        };
        const reflectedArray = [String];

        // Ensure array converter check returns true
        converter.getConverter
          .calledWith(TypeKind.Array)
          .mockReturnValue(arrayConverter);
        arrayConverter.isConvertible
          .calledWith(reflectedType)
          .mockReturnValue(true);
        arrayConverter.reflect
          .calledWith(reflectedType, converter)
          .mockReturnValue(reflectedArray);

        const arrayType = typeConverter.reflect(reflectedType, converter);
        expect(arrayType).toBe(reflectedArray);

        // Verify converter interactions
        expect(converter.getConverter).toHaveBeenCalledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).toHaveBeenCalledWith(
          reflectedType
        );
        expect(arrayConverter.reflect).toHaveBeenCalledWith(
          reflectedType,
          converter
        );
        // Class converter should not be called since array converter handled it
        expect(converter.getConverter).not.toHaveBeenCalledWith(TypeKind.Class);
      });
    });
  });
});
