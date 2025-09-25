import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { NumberConverter } from '../../../src/converters/tsruntime/type-converters/number.converter';
import { InstanceOf } from '../../../src/patterns/instance-of';

describe(`NumberConverter`, function () {
  let typeConverter: NumberConverter;

  before(() => {
    typeConverter = new NumberConverter();
  });

  describe('evaluation', () => {
    it('returns true for number type', () => {
      expect(typeConverter.isConvertible(reflect<number>())).to.be.true;
    });

    it('returns false for other primitive types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<boolean>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<symbol>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects number type to Number constructor', () => {
      expect(typeConverter.reflect(reflect<number>())).to.be.equal(Number);
    });
  });

  describe('conversion', () => {
    it('converts number type to instance of InstanceOf with Number type', () => {
      const result = typeConverter.convert(reflect<number>());
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(Number));
    });
  });
});
