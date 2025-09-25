import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { NullConverter } from '../../../src/converters/tsruntime/type-converters/null.converter';

describe(`NullConverter`, () => {
  let typeConverter: NullConverter;

  before(() => {
    typeConverter = new NullConverter();
  });

  describe('evaluation', () => {
    it('returns true for null', () => {
      expect(typeConverter.isConvertible(reflect<null>())).to.be.true;
    });

    it('returns false for undefined', () => {
      expect(typeConverter.isConvertible(reflect<undefined>())).to.be.false;
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects null', () => {
      expect(typeConverter.reflect(reflect<null>())).to.be.eql(null);
    });
  });

  describe('conversion', () => {
    it('converts null', () => {
      expect(typeConverter.convert(reflect<null>())).to.be.eql(null);
    });
  });
});
