import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { UndefinedConverter } from '../../../src/converters/tsruntime/type-converters/undefined.converter';

describe(`UndefinedConverter`, () => {
  let typeConverter: UndefinedConverter;

  before(() => {
    typeConverter = new UndefinedConverter();
  });

  describe('evaluation', () => {
    it('returns true for undefined', () => {
      expect(typeConverter.isConvertible(reflect<undefined>())).to.be.true;
    });

    it('returns false for null', () => {
      expect(typeConverter.isConvertible(reflect<null>())).to.be.false;
    });

    it('returns false for other types', () => {
      expect(typeConverter.isConvertible(reflect<string>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects undefined', () => {
      expect(typeConverter.reflect(reflect<undefined>())).to.be.eql(undefined);
    });
  });

  describe('conversion', () => {
    it('converts undefined', () => {
      expect(typeConverter.convert(reflect<undefined>())).to.be.eql(undefined);
    });
  });
});
