import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { UnknownConverter } from '../../../../../src/converters/tsruntime/type-converters/unknown-converter';
import { Unknown } from '../../../../../src/patterns/unknown';

describe(`UnknownConverter`, function () {
  let typeConverter: UnknownConverter;

  before(() => {
    typeConverter = new UnknownConverter();
  });

  describe('evaluation', () => {
    it(`returns true for passed 'unknown' declaration`, () => {
      expect(typeConverter.isConvertible(reflect<unknown>())).to.be.true;
    });
  });

  describe('reflection', () => {
    it('reflects unknown type to instance of Unknown', () => {
      expect(typeConverter.convert(reflect<unknown>())).to.be.instanceof(
        Unknown
      );
    });
  });

  describe('conversion', () => {
    it('converts unknown reflected type to instance of Unknown', () => {
      expect(typeConverter.convert(reflect<unknown>())).to.be.instanceof(
        Unknown
      );
    });
  });
});
