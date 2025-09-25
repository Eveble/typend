import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { StringConverter } from '../../../src/converters/tsruntime/type-converters/string.converter';
import { InstanceOf } from '../../../src/patterns/instance-of';

describe(`StringConverter`, function () {
  let typeConverter: StringConverter;

  before(() => {
    typeConverter = new StringConverter();
  });

  describe('evaluation', () => {
    it('returns true for string type', () => {
      expect(typeConverter.isConvertible(reflect<string>())).to.be.true;
    });

    it('returns false for other primitive types', () => {
      expect(typeConverter.isConvertible(reflect<number>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<boolean>())).to.be.false;
      expect(typeConverter.isConvertible(reflect<symbol>())).to.be.false;
    });
  });

  describe('reflection', () => {
    it('reflects string type to String constructor', () => {
      expect(typeConverter.reflect(reflect<string>())).to.be.equal(String);
    });

  });

  describe('conversion', () => {
    it('converts string type to instance of InstanceOf with String type', () => {
      const result = typeConverter.convert(reflect<string>());
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(String));
    });

  });
});
