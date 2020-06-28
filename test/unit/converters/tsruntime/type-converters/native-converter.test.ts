import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { NativeConverter } from '../../../../../src/converters/tsruntime/type-converters/native-converter';
import { Any } from '../../../../../src/patterns/any';
import { Never } from '../../../../../src/patterns/never';
import { Void } from '../../../../../src/patterns/void';

describe(`NativeConverter`, function () {
  let typeConverter: NativeConverter;

  before(() => {
    typeConverter = new NativeConverter();
  });

  describe('evaluation', () => {
    it('returns true for any', () => {
      expect(typeConverter.isConvertible(reflect<any>())).to.be.true;
    });
    it('returns true for never', () => {
      expect(typeConverter.isConvertible(reflect<never>())).to.be.true;
    });
    it('returns true for void', () => {
      expect(typeConverter.isConvertible(reflect<void>())).to.be.true;
    });
  });

  describe('reflection', () => {
    it('returns instance of Any for any type', () => {
      expect(typeConverter.reflect(reflect<any>())).to.be.instanceof(Any);
    });

    it('returns instance of Never for never type', () => {
      expect(typeConverter.reflect(reflect<never>())).to.be.instanceof(Never);
    });

    it('returns instance of Void for void type', () => {
      expect(typeConverter.reflect(reflect<void>())).to.be.instanceof(Void);
    });
  });

  describe('conversion', () => {
    context('native type', () => {
      it('returns instance of Any for any type', () => {
        expect(typeConverter.convert(reflect<any>())).to.be.instanceof(Any);
      });

      it('returns instance of Never for never type', () => {
        expect(typeConverter.convert(reflect<never>())).to.be.instanceof(Never);
      });

      it('returns instance of Void for void type', () => {
        expect(typeConverter.convert(reflect<void>())).to.be.instanceof(Void);
      });
    });
  });
});
