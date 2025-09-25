import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { VoidConverter } from '../../../src/converters/tsruntime/type-converters/void.converter';
import { Void } from '../../../src/patterns/void';

describe(`VoidConverter`, function () {
  let typeConverter: VoidConverter;

  before(() => {
    typeConverter = new VoidConverter();
  });

  describe('evaluation', () => {
    it('returns true for void type', () => {
      expect(typeConverter.isConvertible(reflect<void>())).to.be.true;
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<undefined>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<null>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<string>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<any>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects void type to Void instance', () => {
      const result = typeConverter.reflect(reflect<void>());
      expect(result).to.be.instanceOf(Void);
    });
  });

  describe('conversion', () => {
    it('converts void type to Void pattern', () => {
      const result = typeConverter.convert(reflect<void>());
      expect(result).to.be.instanceOf(Void);
    });
  });
});
