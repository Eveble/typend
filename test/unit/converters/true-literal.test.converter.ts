import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { TrueLiteralConverter } from '../../../src/converters/tsruntime/type-converters/true-literal.converter';
import { Equals } from '../../../src/patterns/equals';

describe(`TrueLiteralConverter`, () => {
  let typeConverter: TrueLiteralConverter;

  before(() => {
    typeConverter = new TrueLiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for true literal type', () => {
      expect(typeConverter.isConvertible(reflect<true>())).to.be.true;
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<false>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<boolean>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<string>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects true literal to true value', () => {
      const reflectedType = { kind: 8 };
      expect(typeConverter.reflect(reflectedType)).to.be.true;
    });
  });

  describe('conversion', () => {
    it('converts true literal to instance of Equals pattern', () => {
      const reflectedType = { kind: 8 };
      const result = typeConverter.convert(reflectedType);
      expect(result).to.be.instanceof(Equals);
      expect(result).to.be.eql(new Equals(true));
    });
  });
});
