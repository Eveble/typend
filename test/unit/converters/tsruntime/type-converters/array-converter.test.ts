import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
import { ArrayConverter } from '../../../../../src/converters/tsruntime/type-converters/array-converter';
import { define } from '../../../../../src/decorators/define';
import { List } from '../../../../../src/patterns/list';
import { types } from '../../../../../src/types';
import { KINDS } from '../../../../../src/constants/literal-keys';
import { InstanceOf } from '../../../../../src/patterns/instance-of';

describe(`ArrayConverter`, function() {
  let converter: any;
  let typeConverter: ArrayConverter;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    typeConverter = new ArrayConverter();
  });

  @define()
  class MyClass {
    key: string;
  }

  describe('evaluation', () => {
    it('returns true for Array with generic type declaration', () => {
      const examples: [string, any][] = [
        ['Array<any>', reflect<Array<any>>()],
        ['Array<string>', reflect<Array<string>>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });

    it('returns true for literal array with native type', () => {
      const examples: [string, any][] = [
        ['any[]', reflect<any[]>()],
        ['boolean[]', reflect<boolean[]>()],
        ['null[]', reflect<null[]>()],
        ['undefined[]', reflect<undefined[]>()],
        ['string[]', reflect<string[]>()],
        ['number[]', reflect<number[]>()],
        ['Function[]', reflect<Function[]>()],
        ['Record<any, any>[]', reflect<Record<any, any>[]>()],
        ['Map<any, any>[]', reflect<Map<any, any>[]>()],
        ['symbol[]', reflect<symbol[]>()],
        ['Date[]', reflect<Date[]>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });

    it('returns true for literal array with class', () => {
      expect(
        typeConverter.isConvertible(reflect<MyClass[]>()),
        `Expected MyClass[] to be convertible`
      ).to.be.true;
    });

    it('returns true for literal array with literal values', () => {
      const examples: [string, any][] = [
        [`true[]`, reflect<true[]>()],
        [`false[]`, reflect<false[]>()],
        [`'my-string'[]`, reflect<'my-string'[]>()],
        [`69[]`, reflect<69[]>()],
        [`{}[]`, reflect<{}[]>()],
        [`{key: 'my-string';}[]`, reflect<{ key: 'my-string' }[]>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });

    it('returns true for nested literal array', () => {
      expect(
        typeConverter.isConvertible(reflect<string[][]>()),
        `Expected string[][] to be convertible`
      ).to.be.true;
    });
  });

  describe('reflection', () => {
    it('reflects literal array as an array', () => {
      converter.reflect.withArgs({ kind: 2 }).returns(String);
      expect(typeConverter.reflect(reflect<string[]>(), converter)).to.be.eql([
        String,
      ]);
    });

    it('reflects literal array with class', () => {
      const classConverter = stubInterface<types.TypeConverter>();
      converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
      classConverter.isConvertible
        .withArgs({ kind: 18, type: MyClass, arguments: [] })
        .returns(true);

      const arrayType = typeConverter.reflect(reflect<MyClass[]>(), converter);
      expect(arrayType).to.be.instanceof(Array);
      expect(arrayType).to.be.eql([MyClass]);
    });
  });

  describe('conversion', () => {
    it('converts literal array as instance of List pattern', () => {
      converter.convert.withArgs({ kind: 2 }).returns(String);
      const arrayType = typeConverter.convert(reflect<string[]>(), converter);
      expect(arrayType).to.be.instanceof(List);
      expect(arrayType).to.be.eql([String]);
    });

    it('converts literal array assigned as property with initializer', () => {
      const reflectedType = {
        kind: 18,
        initializer: (): any => ['my-value'],
        arguments: [{ kind: 2 }],
      };
      converter.convert.withArgs({ kind: 2 }).returns(String);

      const arrayType = typeConverter.convert(reflectedType, converter);
      expect(arrayType).to.be.instanceof(List);
      expect(arrayType).to.be.eql([String]);
      expect(arrayType.hasInitializer()).to.be.true;
      expect(arrayType.getInitializer()).to.be.eql(['my-value']);
    });

    it('converts literal array with class', () => {
      const classConverter = stubInterface<types.TypeConverter>();
      converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
      classConverter.isConvertible
        .withArgs({ kind: 18, type: MyClass, arguments: [] })
        .returns(true);

      const arrayType = typeConverter.convert(reflect<MyClass[]>(), converter);
      expect(arrayType).to.be.instanceof(List);
      expect(arrayType).to.be.eql([new InstanceOf(MyClass)]);
    });
  });
});
