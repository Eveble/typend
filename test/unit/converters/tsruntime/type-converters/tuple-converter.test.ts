import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
import { TupleConverter } from '../../../../../src/converters/tsruntime/type-converters/tuple-converter';
import { define } from '../../../../../src/decorators/define';
import { types } from '../../../../../src/types';
import { Tuple } from '../../../../../src/patterns/tuple';
import { KINDS } from '../../../../../src/constants/literal-keys';
import { InstanceOf } from '../../../../../src/patterns/instance-of';

describe(`TupleConverter`, function() {
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

  @define()
  class MyClass {
    first: string;
  }

  @define()
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

    it('reflects tuple with classes as an array', () => {
      const classConverter = stubInterface<types.TypeConverter>();
      converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
      classConverter.isConvertible
        .withArgs({ kind: 18, type: MyClass, arguments: [] })
        .returns(true);
      classConverter.isConvertible
        .withArgs({ kind: 18, type: MyOtherClass, arguments: [] })
        .returns(true);

      expect(
        typeConverter.reflect(reflect<[MyClass, MyOtherClass]>(), converter)
      ).to.be.eql([MyClass, MyOtherClass]);
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

    it('converts tuple assigned as property with initializer', () => {
      const reflectedType = {
        kind: 16,
        initializer: (): any => ['my-value', 1337, true],
        elementTypes: [{ kind: 2 }, { kind: 3 }, { kind: 4 }],
      };

      converter.convert.withArgs({ kind: 2 }).returns(String);
      converter.convert.withArgs({ kind: 3 }).returns(Number);
      converter.convert.withArgs({ kind: 4 }).returns(Boolean);
      const result = typeConverter.convert(reflectedType, converter);
      expect(result).to.be.instanceof(Tuple);
      expect(result).to.be.eql([String, Number, Boolean]);
      expect(result.hasInitializer()).to.be.true;
      expect(result.getInitializer()).to.be.eql(['my-value', 1337, true]);
    });

    it('converts tuple with classes as an array', () => {
      const classConverter = stubInterface<types.TypeConverter>();
      converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
      classConverter.isConvertible
        .withArgs({ kind: 18, type: MyClass, arguments: [] })
        .returns(true);
      classConverter.isConvertible
        .withArgs({ kind: 18, type: MyOtherClass, arguments: [] })
        .returns(true);

      expect(
        typeConverter.convert(reflect<[MyClass, MyOtherClass]>(), converter)
      ).to.be.eql([new InstanceOf(MyClass), new InstanceOf(MyOtherClass)]);
    });
  });
});
