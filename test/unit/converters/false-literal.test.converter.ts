import { expect } from 'chai';
import { FalseLiteralConverter } from '../../../src/converters/tsruntime/type-converters/false-literal.converter';
import { Equals } from '../../../src';

describe(`FalseLiteralConverter`, () => {
  let typeConverter: FalseLiteralConverter;

  beforeEach(() => {
    typeConverter = new FalseLiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for false literal type', () => {
      const falseLiteralType = { kind: 7 }; // TypeKind.FalseLiteral
      expect(typeConverter.isConvertible(falseLiteralType)).to.be.true;
    });

    it('returns false for non-false-literal types', () => {
      const examples = [
        { kind: 1 }, // Any
        { kind: 4 }, // Boolean
        { kind: 8 }, // TrueLiteral
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).to.be.false;
      }
    });
  });

  describe('reflection', () => {
    it('reflects false literal type as false', () => {
      const falseLiteralType = { kind: 7 };
      expect(typeConverter.reflect(falseLiteralType)).to.be.false;
    });
  });

  describe('conversion', () => {
    it('converts false literal type to Equals pattern with false', () => {
      const falseLiteralType = { kind: 7 };
      const result = typeConverter.convert(falseLiteralType);
      expect(result).to.be.instanceof(Equals);
      expect(result).to.be.eql(new Equals(false));
    });
  });
});
