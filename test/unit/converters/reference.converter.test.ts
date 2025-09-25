import chai, { expect } from 'chai';
import { reflect, Types as tsruntimeTypes } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
import { ReferenceConverter } from '../../../src/converters/tsruntime/type-converters/reference.converter';
import { types } from '../../../src/types';
import { InstanceOf } from '../../../src/patterns/instance-of';
import { TypeKind } from '../../../src/enums/type-kind.enum';
import sinonChai from 'sinon-chai';
import { Type } from '../../../src/decorators/type.decorator';

chai.use(sinonChai);

describe(`ReferenceConverter`, function () {
  let converter: any;
  let arrayConverter: any;
  let classConverter: any;
  let typeConverter: ReferenceConverter;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    arrayConverter = stubInterface<types.TypeConverter>();
    classConverter = stubInterface<types.TypeConverter>();
    typeConverter = new ReferenceConverter();
  });

  @Type()
  class MyClass {
    field: string;
  }

  describe('evaluation', () => {
    it('returns true for Reference type (TypeKind.Reference = 18)', () => {
      const referenceType = { kind: 18 };
      expect(typeConverter.isConvertible(referenceType)).to.be.true;
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
        ).to.be.true;
      }
    });

    it('returns false for non-reference types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<number>())).to.be.false;
      expect(typeConverter.isConvertible({ kind: 15 } as any)).to.be.false; // Object
      expect(typeConverter.isConvertible({ kind: 16 } as any)).to.be.false; // Tuple
      expect(typeConverter.isConvertible({ kind: 17 } as any)).to.be.false; // Union
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

        // Ensure array converter check returns false
        converter.getConverter.withArgs(TypeKind.Array).returns(arrayConverter);
        arrayConverter.isConvertible.withArgs(reflectedType).returns(false);

        // Ensure class converter check returns true
        converter.getConverter.withArgs(TypeKind.Class).returns(classConverter);
        classConverter.isConvertible.withArgs(reflectedType).returns(true);
        classConverter.convert
          .withArgs(reflectedType, converter)
          .returns(new InstanceOf(MyClass));

        const result = typeConverter.convert(reflectedType, converter);
        expect(result).to.be.instanceof(InstanceOf);
        expect(result).to.be.eql(new InstanceOf(MyClass));

        // Verify converter interactions
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Class);
        expect(classConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(classConverter.convert).to.have.been.calledWith(
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
        converter.getConverter.withArgs(TypeKind.Array).returns(arrayConverter);
        arrayConverter.isConvertible.withArgs(reflectedType).returns(false);
        converter.getConverter.withArgs(TypeKind.Class).returns(classConverter);
        classConverter.isConvertible.withArgs(reflectedType).returns(false);

        const result = typeConverter.convert(reflectedType, converter);
        expect(result).to.be.instanceof(InstanceOf);
        expect(result).to.be.eql(new InstanceOf(MyClass));

        // Verify converter interactions but no convert calls
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Class);
        expect(classConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(arrayConverter.convert).to.not.have.been.called;
        expect(classConverter.convert).to.not.have.been.called;
      });
    });

    context('array', () => {
      it('converts referenced array with array converter', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          arguments: [{ kind: 2 }],
          type: Array,
        };
        const convertedArray = ['converted-array'];

        // Ensure array converter check returns true
        converter.getConverter.withArgs(TypeKind.Array).returns(arrayConverter);
        arrayConverter.isConvertible.withArgs(reflectedType).returns(true);
        arrayConverter.convert
          .withArgs(reflectedType, converter)
          .returns(convertedArray);

        const arrayType = typeConverter.convert(reflectedType, converter);
        expect(arrayType).to.be.equal(convertedArray);

        // Verify converter interactions
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(arrayConverter.convert).to.have.been.calledWith(
          reflectedType,
          converter
        );
        // Class converter should not be called since array converter handled it
        expect(converter.getConverter).to.not.have.been.calledWith(
          TypeKind.Class
        );
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

        // Ensure array converter check returns false
        converter.getConverter.withArgs(TypeKind.Array).returns(arrayConverter);
        arrayConverter.isConvertible.withArgs(reflectedType).returns(false);

        // Ensure class converter check returns true
        converter.getConverter.withArgs(TypeKind.Class).returns(classConverter);
        classConverter.isConvertible.withArgs(reflectedType).returns(true);
        classConverter.reflect
          .withArgs(reflectedType, converter)
          .returns(MyClass);

        const result = typeConverter.reflect(reflectedType, converter);
        expect(result).to.be.equal(MyClass);

        // Verify converter interactions
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Class);
        expect(classConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(classConverter.reflect).to.have.been.calledWith(
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
        converter.getConverter.withArgs(TypeKind.Array).returns(arrayConverter);
        arrayConverter.isConvertible.withArgs(reflectedType).returns(false);
        converter.getConverter.withArgs(TypeKind.Class).returns(classConverter);
        classConverter.isConvertible.withArgs(reflectedType).returns(false);

        const result = typeConverter.reflect(reflectedType, converter);
        expect(result).to.be.equal(MyClass);

        // Verify converter interactions but no reflect calls
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Class);
        expect(classConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(arrayConverter.reflect).to.not.have.been.called;
        expect(classConverter.reflect).to.not.have.been.called;
      });
    });

    context('array', () => {
      it('reflects referenced array with array converter', () => {
        const reflectedType: tsruntimeTypes.ReferenceType = {
          kind: 18,
          arguments: [{ kind: 2 }],
          type: Array,
        };
        const reflectedArray = [String];

        // Ensure array converter check returns true
        converter.getConverter.withArgs(TypeKind.Array).returns(arrayConverter);
        arrayConverter.isConvertible.withArgs(reflectedType).returns(true);
        arrayConverter.reflect
          .withArgs(reflectedType, converter)
          .returns(reflectedArray);

        const arrayType = typeConverter.reflect(reflectedType, converter);
        expect(arrayType).to.be.equal(reflectedArray);

        // Verify converter interactions
        expect(converter.getConverter).to.have.been.calledWith(TypeKind.Array);
        expect(arrayConverter.isConvertible).to.have.been.calledWith(
          reflectedType
        );
        expect(arrayConverter.reflect).to.have.been.calledWith(
          reflectedType,
          converter
        );
        // Class converter should not be called since array converter handled it
        expect(converter.getConverter).to.not.have.been.calledWith(
          TypeKind.Class
        );
      });
    });
  });
});
