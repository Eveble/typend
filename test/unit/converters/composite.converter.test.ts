import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { CompositeTypeConverter } from '../../../src/converters/tsruntime/type-converters/composite.converter';
import { types } from '../../../src';

describe(`CompositeTypeConverter`, function () {
  let typeConverter: CompositeTypeConverter;
  let mockConverter1: any;
  let mockConverter2: any;
  let mockTsRuntimeConverter: any;

  beforeEach(() => {
    mockConverter1 = stubInterface<types.TypeConverter>();
    mockConverter2 = stubInterface<types.TypeConverter>();
    mockTsRuntimeConverter = stubInterface<types.Converter>();
    typeConverter = new CompositeTypeConverter();
  });

  describe('evaluation', () => {
    it('returns true for composite type (kind 15)', () => {
      const reflectedType = { kind: 15 }; // TypeKind.Object
      expect(typeConverter.isConvertible(reflectedType)).to.be.true;
    });

    it('returns false for non-composite types', () => {
      const examples = [
        { kind: 1 }, // Any
        { kind: 2 }, // String
        { kind: 18 }, // Reference
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).to.be.false;
      }
    });
  });

  describe('converter management', () => {
    it('adds converter to the list', () => {
      typeConverter.add(mockConverter1);
      expect(typeConverter.size()).to.equal(1);
      expect(typeConverter.getConverters()).to.include(mockConverter1);
    });

    it('adds converter at specific index', () => {
      typeConverter.add(mockConverter1);
      typeConverter.add(mockConverter2, 0);
      const converters = typeConverter.getConverters();
      expect(converters[0]).to.equal(mockConverter2);
      expect(converters[1]).to.equal(mockConverter1);
    });

    it('removes converter from the list', () => {
      typeConverter.add(mockConverter1);
      typeConverter.add(mockConverter2);
      const removed = typeConverter.remove(mockConverter1);
      expect(removed).to.be.true;
      expect(typeConverter.size()).to.equal(1);
      expect(typeConverter.getConverters()).to.not.include(mockConverter1);
    });

    it('returns false when removing non-existent converter', () => {
      const removed = typeConverter.remove(mockConverter1);
      expect(removed).to.be.false;
    });

    it('removes converter at specific index', () => {
      typeConverter.add(mockConverter1);
      typeConverter.add(mockConverter2);
      const removed = typeConverter.removeAt(0);
      expect(removed).to.equal(mockConverter1);
      expect(typeConverter.size()).to.equal(1);
    });

    it('sorts converters by priority', () => {
      mockConverter1.priority = 10;
      mockConverter2.priority = 5;
      typeConverter.add(mockConverter1);
      typeConverter.add(mockConverter2);
      const converters = typeConverter.getConverters();
      expect(converters[0]).to.equal(mockConverter2);
      expect(converters[1]).to.equal(mockConverter1);
    });
  });

  describe('conversion and reflection', () => {
    it('finds applicable converter for conversion', () => {
      const reflectedType = { kind: 15 };
      const expectedResult = { converted: true };

      mockConverter1.isConvertible
        .withArgs(reflectedType, mockTsRuntimeConverter)
        .returns(true);
      mockConverter1.convert
        .withArgs(reflectedType, mockTsRuntimeConverter)
        .returns(expectedResult);

      typeConverter.add(mockConverter1);
      const result = typeConverter.convert(
        reflectedType,
        mockTsRuntimeConverter
      );
      expect(result).to.equal(expectedResult);
    });

    it('finds applicable converter for reflection', () => {
      const reflectedType = { kind: 15 };
      const expectedResult = { reflected: true };

      mockConverter1.isConvertible
        .withArgs(reflectedType, mockTsRuntimeConverter)
        .returns(true);
      mockConverter1.reflect
        .withArgs(reflectedType, mockTsRuntimeConverter)
        .returns(expectedResult);

      typeConverter.add(mockConverter1);
      const result = typeConverter.reflect(
        reflectedType,
        mockTsRuntimeConverter
      );
      expect(result).to.equal(expectedResult);
    });

    it('uses last converter when no applicable converter found', () => {
      const reflectedType = { kind: 15 };
      const expectedResult = { fallback: true };

      mockConverter1.isConvertible
        .withArgs(reflectedType, mockTsRuntimeConverter)
        .returns(false);
      mockConverter2.isConvertible
        .withArgs(reflectedType, mockTsRuntimeConverter)
        .returns(false);
      mockConverter2.convert
        .withArgs(reflectedType, mockTsRuntimeConverter)
        .returns(expectedResult);

      typeConverter.add(mockConverter1);
      typeConverter.add(mockConverter2);
      const result = typeConverter.convert(
        reflectedType,
        mockTsRuntimeConverter
      );
      expect(result).to.equal(expectedResult);
    });

    it('throws error when no converters available', () => {
      const reflectedType = { kind: 15 };
      expect(() =>
        typeConverter.convert(reflectedType, mockTsRuntimeConverter)
      ).to.throw('No applicable converter found for type');
    });
  });
});
