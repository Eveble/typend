import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { NumberLiteralConverter } from '../../../src/converters/tsruntime/type-converters/number-literal.converter';
import { Equals } from '../../../src/patterns/equals';

describe(`NumberLiteralConverter`, () => {
  let typeConverter: NumberLiteralConverter;

  before(() => {
    typeConverter = new NumberLiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for number literal types', () => {
      const examples: [string, any][] = [
        [`69`, reflect<69>()],
        [`0`, reflect<0>()],
        [`-1`, reflect<-1>()],
        [`3.14`, reflect<3.14>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<number>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<string>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<'69'>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects number literal to its value', () => {
      const reflectedType = { kind: 6, value: 69 };
      expect(typeConverter.reflect(reflectedType)).to.be.equal(69);
    });

    it('reflects zero literal', () => {
      const reflectedType = { kind: 6, value: 0 };
      expect(typeConverter.reflect(reflectedType)).to.be.equal(0);
    });

    it('reflects negative number literal', () => {
      const reflectedType = { kind: 6, value: -1 };
      expect(typeConverter.reflect(reflectedType)).to.be.equal(-1);
    });
  });

  describe('conversion', () => {
    it('converts number literal to instance of Equals pattern', () => {
      const reflectedType = { kind: 6, value: 69 };
      const result = typeConverter.convert(reflectedType);
      expect(result).to.be.instanceof(Equals);
      expect(result).to.be.eql(new Equals(69));
    });
  });
});
