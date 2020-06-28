import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { UnrecognizedConverter } from '../../../../../src/converters/tsruntime/type-converters/unrecognized-converter';
import { Unrecognized } from '../../../../../src/patterns/unrecognized';

describe(`UnrecognizedConverter`, function () {
  let typeConverter: UnrecognizedConverter;

  before(() => {
    typeConverter = new UnrecognizedConverter();
  });

  describe('evaluation', () => {
    it(`returns true for passed 'object' declaration`, () => {
      expect(typeConverter.isConvertible(reflect<object>())).to.be.true;
    });
  });

  describe('reflection', () => {
    it('reflects unrecognized type to instance of Unrecognized', () => {
      expect(typeConverter.convert(reflect<object>())).to.be.instanceof(
        Unrecognized
      );
    });
  });

  describe('conversion', () => {
    it('converts unrecognized reflected type to instance of Unrecognized', () => {
      expect(typeConverter.convert(reflect<object>())).to.be.instanceof(
        Unrecognized
      );
    });
  });
});
