import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { LiteralConverter } from '../../../../../src/converters/tsruntime/type-converters/literal-converter';
import { Equals } from '../../../../../src/patterns/equals';

describe(`LiteralConverter`, function () {
  let typeConverter: LiteralConverter;

  before(() => {
    typeConverter = new LiteralConverter();
  });

  describe('evaluation', () => {
    it('returns true for string literal', () => {
      expect(typeConverter.isConvertible(reflect<'my-string'>())).to.be.true;
    });

    it('returns true for number literal', () => {
      expect(typeConverter.isConvertible(reflect<69>())).to.be.true;
    });

    it('returns true for boolean literal true', () => {
      expect(typeConverter.isConvertible(reflect<true>())).to.be.true;
    });

    it('returns true for boolean literal false', () => {
      expect(typeConverter.isConvertible(reflect<false>())).to.be.true;
    });
  });

  describe('reflection', () => {
    it('reflects string literal', () => {
      expect(typeConverter.reflect(reflect<'my-string'>())).to.be.equal(
        'my-string'
      );
    });

    it('reflects number literal', () => {
      expect(typeConverter.reflect(reflect<69>())).to.be.equal(69);
    });

    it('reflects boolean true', () => {
      expect(typeConverter.reflect(reflect<true>())).to.be.equal(true);
    });

    it('reflects boolean false', () => {
      expect(typeConverter.reflect(reflect<false>())).to.be.equal(false);
    });
  });

  describe('conversion', () => {
    it('converts string literal to instance of Equals with string value', () => {
      const literalType = typeConverter.convert(reflect<'my-string'>());
      expect(literalType).to.be.instanceof(Equals);
      expect(literalType).to.be.eql(new Equals('my-string'));
    });

    it('converts number literal to instance of Equals with numeric value', () => {
      const literalType = typeConverter.convert(reflect<69>());
      expect(literalType).to.be.instanceof(Equals);
      expect(literalType).to.be.eql(new Equals(69));
    });

    it('converts boolean literal true to instance of Equals with true value', () => {
      const literalType = typeConverter.convert(reflect<true>());
      expect(literalType).to.be.instanceof(Equals);
      expect(literalType).to.be.eql(new Equals(true));
    });

    it('converts boolean literal false to instance of Equals with false value', () => {
      const literalType = typeConverter.convert(reflect<false>());
      expect(literalType).to.be.instanceof(Equals);
      expect(literalType).to.be.eql(new Equals(false));
    });
  });
});
