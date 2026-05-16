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
import { stubInterface } from '../../vitest-helper';
import { TypeKind } from 'tsruntime/dist/runtime/publicTypes';
import { UnionConverter } from '../../../src/converters/tsruntime/type-converters/union.converter';
import { types } from '../../../src/types';
import { OneOf } from '../../../src/patterns/one-of';
import { Optional } from '../../../src/patterns/optional';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { List } from '../../../src/patterns/list';
import { Type } from '../../../src/decorators/type.decorator';

describe(`UnionConverter`, () => {
  let converter: any;
  let typeConverter: UnionConverter;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    typeConverter = new UnionConverter();
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

  enum StringEnum {
    a = 'a',
    b = 'b',
  }

  enum NumberEnum {
    a = 1,
    b,
  }

  enum MixedEnum {
    a = 'a',
    b = 2,
  }

  enum DefaultEnum {
    a,
    b,
    c,
  }

  describe('evaluation', () => {
    it('returns true for primitive types choices', () => {
      const examples: [string, any][] = [
        ['null | undefined', reflect<null | undefined>()],
        ['string | number | boolean', reflect<string | number | boolean>()],
        [
          'undefined | string | symbol | true',
          reflect<undefined | string | symbol | true>(),
        ],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns true for primitive literal values choices', () => {
      const examples: [string, any][] = [
        [`'my-string' | undefined`, reflect<'my-string' | undefined>()],
        [`69 | undefined`, reflect<69 | undefined>()],
        [
          `'my-string' | 'my-other-string'`,
          reflect<'my-string' | 'my-other-string'>(),
        ],
        [`1 | 2 | 3 | 4`, reflect<1 | 2 | 3 | 4>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns true for arrays choices', () => {
      expect(
        typeConverter.isConvertible(reflect<string[] | number[]>()),
        `Expected string[] | number[] to be convertible`
      ).toBe(true);
    });

    it('returns true for objects as a types choices', () => {
      expect(
        typeConverter.isConvertible(reflect<MyType | MyOtherType>()),
        `Expected MyType | MyOtherType to be convertible`
      ).toBe(true);
    });

    it('returns true for objects as a interfaces choices', () => {
      expect(
        typeConverter.isConvertible(reflect<MyInterface | MyOtherInterface>()),
        `Expected MyInterface | MyOtherInterface to be convertible`
      ).toBe(true);
    });

    it('returns true for classes choices', () => {
      expect(
        typeConverter.isConvertible(reflect<MyClass | MyOtherClass>()),
        `Expected MyClass | MyOtherClass to be convertible`
      ).toBe(true);
    });

    it('returns true for enum choices', () => {
      const examples: [string, any][] = [
        [`StringEnum`, reflect<StringEnum>()],
        [`NumberEnum`, reflect<NumberEnum>()],
        [`MixedEnum`, reflect<MixedEnum>()],
        [`DefaultEnum`, reflect<DefaultEnum>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).toBe(true);
      }
    });

    it('returns false for non-union types', () => {
      const examples: [string, any][] = [
        ['string', { kind: TypeKind.String }],
        ['number', { kind: TypeKind.Number }],
        ['object', { kind: TypeKind.Object }],
        ['tuple', { kind: TypeKind.Tuple }],
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
    describe('one of', () => {
      it('reflects one of type(two or more types) as an array', () => {
        converter.reflect.withArgs({ kind: 2 }).returns(String);
        converter.reflect.withArgs({ kind: 3 }).returns(Number);
        converter.reflect.withArgs({ kind: 4 }).returns(Boolean);
        expect(
          typeConverter.reflect(reflect<string | number | boolean>(), converter)
        ).toEqual([Boolean, Number, String]);
      });

      it('reflects one of reference types as type constructors', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          types: [
            { kind: TypeKind.Reference, type: MyClass },
            { kind: TypeKind.Reference, type: MyOtherClass },
          ],
        };

        expect(typeConverter.reflect(unionType, converter)).toEqual([
          MyClass,
          MyOtherClass,
        ]);
      });

      it('reflects mixed union with primitives and references', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          types: [
            { kind: TypeKind.String },
            { kind: TypeKind.Reference, type: MyClass },
            { kind: TypeKind.Number },
          ],
        };

        converter.reflect.withArgs({ kind: TypeKind.String }).returns(String);
        converter.reflect.withArgs({ kind: TypeKind.Number }).returns(Number);

        expect(typeConverter.reflect(unionType, converter)).toEqual([
          MyClass,
          Number,
          String,
        ]);
      });
    });

    describe('optional', () => {
      it('reflects optional type(type|undefined) as array', () => {
        converter.reflect.withArgs({ kind: 8 }).returns(true);
        converter.reflect.withArgs({ kind: 12 }).returns(undefined);
        expect(
          typeConverter.reflect(reflect<true | undefined>(), converter)
        ).toEqual([true, undefined]);
      });

      it('reflects optional reference type(class|undefined) as array', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          types: [
            { kind: TypeKind.Reference, type: MyClass },
            { kind: TypeKind.Undefined },
          ],
        };

        converter.reflect
          .withArgs({ kind: TypeKind.Undefined })
          .returns(undefined);

        expect(typeConverter.reflect(unionType, converter)).toEqual([
          MyClass,
          undefined,
        ]);
      });
    });
  });

  describe('conversion', () => {
    describe('one of', () => {
      it('converts one of type(two or more types) as instance of OneOf pattern', () => {
        converter.convert.withArgs({ kind: 2 }).returns(String);
        converter.convert.withArgs({ kind: 3 }).returns(Number);
        converter.convert.withArgs({ kind: 4 }).returns(Boolean);
        const result = typeConverter.convert(
          reflect<string | number | boolean>(),
          converter
        );
        expect(result).toBeInstanceOf(OneOf);
        expect(result).toEqual([String, Number, Boolean]);
      });

      it('converts one of type(two or more types) as instance of OneOf pattern with property initializer', () => {
        const reflectedType = {
          kind: 17,
          initializer: (): any => 'my-value',
          types: [{ kind: 2 }, { kind: 3 }, { kind: 4 }],
        };

        converter.convert.withArgs({ kind: 2 }).returns(String);
        converter.convert.withArgs({ kind: 3 }).returns(Number);
        converter.convert.withArgs({ kind: 4 }).returns(Boolean);
        const result = typeConverter.convert(reflectedType, converter);
        expect(result).toBeInstanceOf(OneOf);
        expect(result).toEqual([String, Number, Boolean]);
        expect(result.hasInitializer()).toBe(true);
        expect(result.getInitializer()).to.be.equal('my-value');
      });

      it('converts one of reference types as instance of OneOf pattern', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          types: [
            { kind: TypeKind.Reference, type: MyClass },
            { kind: TypeKind.Reference, type: MyOtherClass },
          ],
        };

        const result = typeConverter.convert(unionType, converter);
        expect(result).toBeInstanceOf(OneOf);
        expect(result).toEqual([
          new InstanceOf(MyClass),
          new InstanceOf(MyOtherClass),
        ]);
      });

      it('converts union with Array reference as List pattern', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          types: [
            {
              kind: TypeKind.Reference,
              type: Array,
              arguments: [{ kind: TypeKind.String }],
            },
            { kind: TypeKind.Number },
          ],
        };

        converter.convert.withArgs({ kind: TypeKind.String }).returns(String);
        converter.convert.withArgs({ kind: TypeKind.Number }).returns(Number);

        const result = typeConverter.convert(unionType, converter);
        expect(result).toBeInstanceOf(OneOf);
        expect(result[0]).toBeInstanceOf(List);
        expect(result[0]).toEqual([String]);
        expect(result[1]).toBe(Number);
      });

      it('converts mixed union with primitives and references', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          types: [
            { kind: TypeKind.String },
            { kind: TypeKind.Reference, type: MyClass },
            { kind: TypeKind.Number },
          ],
        };

        converter.convert.withArgs({ kind: TypeKind.String }).returns(String);
        converter.convert.withArgs({ kind: TypeKind.Number }).returns(Number);

        const result = typeConverter.convert(unionType, converter);
        expect(result).toBeInstanceOf(OneOf);
        expect(result).toEqual([String, new InstanceOf(MyClass), Number]);
      });
    });

    describe('optional', () => {
      it('converts optional type(type|undefined) as instance of Optional pattern', () => {
        converter.convert.withArgs({ kind: 8 }).returns(true);
        converter.convert.withArgs({ kind: 12 }).returns(undefined);
        const result = typeConverter.convert(
          reflect<true | undefined>(),
          converter
        );
        expect(result).toBeInstanceOf(Optional);
        expect(result).toEqual([true]);
      });

      it('converts optional type(type|undefined) as instance of Optional pattern with property initializer', () => {
        const reflectedType = {
          kind: 17,
          initializer: (): any => true,
          types: [{ kind: 8 }, { kind: 12 }],
        };
        converter.convert.withArgs({ kind: 8 }).returns(true);
        converter.convert.withArgs({ kind: 12 }).returns(undefined);
        const result = typeConverter.convert(reflectedType, converter);
        expect(result).toBeInstanceOf(Optional);
        expect(result).toEqual([true]);
        expect(result.hasInitializer()).toBe(true);
        expect(result.getInitializer()).to.be.equal(true);
      });

      it('converts optional reference type(class|undefined) as instance of Optional pattern', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          types: [
            { kind: TypeKind.Reference, type: MyClass },
            { kind: TypeKind.Undefined },
          ],
        };

        converter.convert
          .withArgs({ kind: TypeKind.Undefined })
          .returns(undefined);

        const result = typeConverter.convert(unionType, converter);
        expect(result).toBeInstanceOf(Optional);
        expect(result).toEqual([new InstanceOf(MyClass)]);
      });

      it('converts optional Array reference type as Optional with List pattern', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          types: [
            {
              kind: TypeKind.Reference,
              type: Array,
              arguments: [{ kind: TypeKind.String }],
            },
            { kind: TypeKind.Undefined },
          ],
        };

        converter.convert.withArgs({ kind: TypeKind.String }).returns(String);
        converter.convert
          .withArgs({ kind: TypeKind.Undefined })
          .returns(undefined);

        const result = typeConverter.convert(unionType, converter);
        expect(result).toBeInstanceOf(Optional);
        expect(result[0]).toBeInstanceOf(List);
        expect(result[0]).toEqual([String]);
      });

      it('converts union with initializer containing reference types', () => {
        const unionType: any = {
          kind: TypeKind.Union,
          initializer: (): any => new MyClass(),
          types: [
            { kind: TypeKind.Reference, type: MyClass },
            { kind: TypeKind.Undefined },
          ],
        };

        converter.convert
          .withArgs({ kind: TypeKind.Undefined })
          .returns(undefined);

        const result = typeConverter.convert(unionType, converter);
        expect(result).toBeInstanceOf(Optional);
        expect(result).toEqual([new InstanceOf(MyClass)]);
        expect(result.hasInitializer()).toBe(true);
        expect(result.getInitializer()).toBeInstanceOf(MyClass);
      });
    });
  });
});
