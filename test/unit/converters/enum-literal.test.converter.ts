import { expect } from 'chai';
import { EnumLiteralConverter } from '../../../src/converters/tsruntime/type-converters/enum-literal.converter';
import { Equals } from '../../../src/patterns/equals';


describe(`EnumLiteralConverter`, function () {
  let typeConverter: EnumLiteralConverter;

  beforeEach(() => {
    typeConverter = new EnumLiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for enum literal type', () => {
      const enumLiteralType = { kind: 9, value: 'ENUM_VALUE' }; // TypeKind.EnumLiteral
      expect(typeConverter.isConvertible(enumLiteralType)).to.be.true;
    });

    it('returns false for non-enum-literal types', () => {
      const examples = [
        { kind: 1 }, // Any
        { kind: 2 }, // String
        { kind: 5, value: 'literal' }, // StringLiteral
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).to.be.false;
      }
    });
  });

  describe('reflection', () => {
    it('reflects enum literal type as its value', () => {
      const enumLiteralType = { kind: 9, value: 'TEST_ENUM' };
      expect(typeConverter.reflect(enumLiteralType)).to.equal('TEST_ENUM');
    });
  });

  describe('conversion', () => {
    it('converts enum literal type to Equals pattern', () => {
      const enumLiteralType = { kind: 9, value: 'TEST_ENUM' };
      const result = typeConverter.convert(enumLiteralType);
      expect(result).to.be.instanceof(Equals);
      expect(result).to.be.eql(new Equals('TEST_ENUM'));
    });
  });
});
