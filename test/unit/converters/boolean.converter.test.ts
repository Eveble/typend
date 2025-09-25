import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { BooleanConverter } from '../../../src/converters/tsruntime/type-converters/boolean.converter';
import { InstanceOf } from '../../../src/patterns/instance-of';

describe(`BooleanConverter`, () => {
  let typeConverter: BooleanConverter;

  beforeEach(() => {
    typeConverter = new BooleanConverter();
  });

  describe('evaluation', () => {
    it('returns true for boolean type', () => {
      expect(typeConverter.isConvertible(reflect<boolean>())).to.be.true;
    });

    it('returns false for non-boolean types', () => {
      const examples = [
        reflect<string>(),
        reflect<number>(),
        reflect<any>(),
        reflect<true>(),
        reflect<false>(),
      ];
      for (const type of examples) {
        expect(typeConverter.isConvertible(type)).to.be.false;
      }
    });
  });

  describe('reflection', () => {
    it('reflects boolean type as Boolean constructor', () => {
      expect(typeConverter.reflect(reflect<boolean>())).to.be.eql(Boolean);
    });
  });

  describe('conversion', () => {
    it('converts boolean type to InstanceOf pattern with Boolean', () => {
      const result = typeConverter.convert(reflect<boolean>());
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(Boolean));
    });
  });
});
