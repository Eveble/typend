import { expect } from 'chai';
import { ESSymbolConverter } from '../../../src/converters/tsruntime/type-converters/essymbol.converter';
import { InstanceOf } from '../../../src/patterns/instance-of';

describe(`ESSymbolConverter`, function () {
  let typeConverter: ESSymbolConverter;

  beforeEach(() => {
    typeConverter = new ESSymbolConverter();
  });

  describe('evaluation', () => {
    it('returns true for symbol type', () => {
      const symbolType = { kind: 10 }; // TypeKind.ESSymbol
      expect(typeConverter.isConvertible(symbolType)).to.be.true;
    });

    it('returns false for non-symbol types', () => {
      const examples = [
        { kind: 1 }, // Any
        { kind: 2 }, // String
        { kind: 4 }, // Boolean
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).to.be.false;
      }
    });
  });

  describe('reflection', () => {
    it('reflects symbol type as Symbol constructor', () => {
      const symbolType = { kind: 10 };
      expect(typeConverter.reflect(symbolType)).to.equal(Symbol);
    });
  });

  describe('conversion', () => {
    it('converts symbol type to InstanceOf pattern with Symbol', () => {
      const symbolType = { kind: 10 };
      const result = typeConverter.convert(symbolType);
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(Symbol));
    });
  });
});
