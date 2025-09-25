import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
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
    converter = stubInterface<types.Converter>();
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
        ).to.be.true;
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
        ).to.be.true;
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
        ).to.be.true;
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
        ).to.be.true;
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
        ).to.be.true;
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
        ).to.be.true;
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
        ).to.be.false;
      }
    });
  });

  describe('reflection', () => {
    it('reflects tuple as an array', () => {
      converter.reflect.withArgs({ kind: 2 }).returns(String);
      converter.reflect.withArgs({ kind: 3 }).returns(Number);
      converter.reflect.withArgs({ kind: 4 }).returns(Boolean);
      expect(
        typeConverter.reflect(reflect<[string, number, boolean]>(), converter)
      ).to.be.eql([String, Number, Boolean]);
    });

    it('reflects tuple with reference types as type constructors', () => {
      const tupleType: any = {
        kind: TypeKind.Tuple,
        elementTypes: [
          { kind: TypeKind.Reference, type: MyClass },
          { kind: TypeKind.Reference, type: MyOtherClass },
        ],
      };

      expect(typeConverter.reflect(tupleType, converter)).to.be.eql([
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

      converter.reflect.withArgs({ kind: TypeKind.String }).returns(String);
      converter.reflect.withArgs({ kind: TypeKind.Number }).returns(Number);

      expect(typeConverter.reflect(tupleType, converter)).to.be.eql([
        String,
        MyClass,
        Number,
      ]);
    });
  });

  describe('conversion', () => {
    it('converts tuple as instance of Tuple pattern', () => {
      converter.convert.withArgs({ kind: 2 }).returns(String);
      converter.convert.withArgs({ kind: 3 }).returns(Number);
      converter.convert.withArgs({ kind: 4 }).returns(Boolean);
      const result = typeConverter.convert(
        reflect<[string, number, boolean]>(),
        converter
      );
      expect(result).to.be.instanceof(Tuple);
      expect(result).to.be.eql([String, Number, Boolean]);
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
      expect(result).to.be.instanceof(Tuple);
      expect(result).to.be.eql([
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

      converter.convert.withArgs({ kind: TypeKind.String }).returns(String);
      converter.convert.withArgs({ kind: TypeKind.Number }).returns(Number);

      const result = typeConverter.convert(tupleType, converter);
      expect(result).to.be.instanceof(Tuple);
      expect(result).to.be.eql([String, new InstanceOf(MyClass), Number]);
    });
  });
});
