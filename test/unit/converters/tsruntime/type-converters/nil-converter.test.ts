import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { NilConverter } from '../../../../../src/converters/tsruntime/type-converters/nil-converter';

describe(`NilConverter`, function() {
  let typeConverter: NilConverter;

  before(() => {
    typeConverter = new NilConverter();
  });

  describe('evaluation', () => {
    it('returns true for null', () => {
      expect(typeConverter.isConvertible(reflect<null>())).to.be.true;
    });
    it('returns true for undefined', () => {
      expect(typeConverter.isConvertible(reflect<undefined>())).to.be.true;
    });
  });

  describe('reflection', () => {
    it('reflects null', () => {
      expect(typeConverter.reflect(reflect<null>())).to.be.eql(null);
    });

    it('reflects undefined', () => {
      expect(typeConverter.reflect(reflect<undefined>())).to.be.eql(undefined);
    });
  });

  describe('conversion', () => {
    it('converts null', () => {
      expect(typeConverter.convert(reflect<null>())).to.be.eql(null);
    });

    it('converts undefined', () => {
      expect(typeConverter.convert(reflect<undefined>())).to.be.eql(undefined);
    });
  });
});
