import { expect } from 'chai';
import { reflect, Types as tsruntimeTypes } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import { ReferenceConverter } from '../../../../../src/converters/tsruntime/type-converters/reference-converter';
import { define } from '../../../../../src/decorators/define';
import { types } from '../../../../../src/types';
import { InstanceOf } from '../../../../../src/patterns/instance-of';
import { KINDS } from '../../../../../src/constants/literal-keys';

describe(`ReferenceConverter`, function () {
  let converter: any;
  let typeConverter: ReferenceConverter;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    typeConverter = new ReferenceConverter();
  });

  @define()
  class MyClass {
    field: string;
  }

  describe('evaluation', () => {
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
        ).to.be.true;
      }
    });
  });

  describe('conversion', () => {
    context('type', () => {
      it('converts references type as instance of InstanceOf pattern', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          type: MyClass,
          arguments: [],
        };

        const result = typeConverter.convert(reflectedType, converter);
        expect(result).to.be.instanceof(InstanceOf);
        expect(result).to.be.eql([MyClass]);
      });

      it('converts references type as instance of InstanceOf pattern with property initializer', () => {
        const initializer = new MyClass();
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          initializer: (): any => initializer,
          type: MyClass,
          arguments: [],
        };

        const result = typeConverter.convert(reflectedType, converter);
        expect(result).to.be.instanceof(InstanceOf);
        expect(result).to.be.eql([MyClass]);
        expect(result.hasInitializer()).to.be.true;
        expect(result.getInitializer()).to.be.equal(initializer);
      });
    });

    context('array', () => {
      it('converts referenced array with array converter', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          initializer: (): any => ['my-value'],
          arguments: [{ kind: 2 }],
          type: Array,
        };
        const arrayConverter = stubInterface<types.TypeConverter>();
        const stub = sinon.stub();
        converter.getConverter.withArgs(KINDS.ARRAY).returns(arrayConverter);
        arrayConverter.convert.withArgs(reflectedType).returns(stub);

        const arrayType = typeConverter.convert(reflectedType, converter);
        expect(arrayType).to.be.equal(stub);
      });
    });
  });

  describe('reflection', () => {
    context('type', () => {
      it('returns references type', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          type: MyClass,
          arguments: [],
        };

        const result = typeConverter.reflect(reflectedType, converter);
        expect(result).to.be.equal(MyClass);
      });
    });

    context('array', () => {
      it('reflects referenced array with array converter', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          initializer: (): any => ['my-value'],
          arguments: [{ kind: 2 }],
          type: Array,
        };
        const arrayConverter = stubInterface<types.TypeConverter>();
        const stub = sinon.stub();
        converter.getConverter.withArgs(KINDS.ARRAY).returns(arrayConverter);
        arrayConverter.reflect.withArgs(reflectedType).returns(stub);

        const arrayType = typeConverter.reflect(reflectedType, converter);
        expect(arrayType).to.be.equal(stub);
      });
    });
  });
});
