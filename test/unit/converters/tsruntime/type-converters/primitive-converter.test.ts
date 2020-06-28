import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { PrimitiveConverter } from '../../../../../src/converters/tsruntime/type-converters/primitive-converter';
import { InstanceOf } from '../../../../../src/patterns/instance-of';

describe(`PrimitiveConverter`, function () {
  let typeConverter: PrimitiveConverter;

  before(() => {
    typeConverter = new PrimitiveConverter();
  });

  describe('evaluation', () => {
    it('returns true for string type', () => {
      expect(typeConverter.isConvertible(reflect<string>())).to.be.true;
    });

    it('returns true for number type', () => {
      expect(typeConverter.isConvertible(reflect<number>())).to.be.true;
    });

    it('returns true for boolean type', () => {
      expect(typeConverter.isConvertible(reflect<boolean>())).to.be.true;
    });

    it('returns true for symbol type', () => {
      expect(typeConverter.isConvertible(reflect<symbol>())).to.be.true;
    });
  });

  describe('reflection', () => {
    it('reflects string type to String constructor', () => {
      expect(typeConverter.reflect(reflect<string>())).to.be.equal(String);
    });

    it('reflects number type to Number constructor', () => {
      expect(typeConverter.reflect(reflect<number>())).to.be.equal(Number);
    });

    it('reflects boolean type to Boolean constructor', () => {
      expect(typeConverter.reflect(reflect<boolean>())).to.be.equal(Boolean);
    });

    it('reflects symbol type to Symbol constructor', () => {
      expect(typeConverter.reflect(reflect<symbol>())).to.be.equal(Symbol);
    });

    it('reflects string as a type with initializer(triggered on class reflection)', () => {
      const reflectedType = {
        kind: 2,
        initializer: (): string => {
          return 'my-string';
        },
      };
      const result = typeConverter.reflect(reflectedType);
      expect(result).to.be.equal(String);
    });

    it('reflects number as a type with initializer(triggered on class reflection)', () => {
      const reflectedType = {
        kind: 3,
        initializer: (): number => {
          return 69;
        },
      };
      const result = typeConverter.reflect(reflectedType);
      expect(result).to.be.equal(Number);
    });
  });

  describe('conversion', () => {
    it('converts string type to instance of InstanceOf with String type', () => {
      const result = typeConverter.convert(reflect<string>());
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(String));
    });

    it('converts number type to instance of InstanceOf with Number type', () => {
      const result = typeConverter.convert(reflect<number>());
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(Number));
    });

    it('converts boolean type to instance of InstanceOf with Boolean type', () => {
      const result = typeConverter.convert(reflect<boolean>());
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(Boolean));
    });

    it('converts symbol type to instance of InstanceOf with Symbol type', () => {
      const result = typeConverter.convert(reflect<symbol>());
      expect(result).to.be.instanceof(InstanceOf);
      // eslint-disable-next-line no-new-symbol
      expect(result).to.be.eql(new InstanceOf(Symbol));
    });

    it('converts string as type with initializer(triggered on class reflection)', () => {
      const reflectedType = {
        kind: 2,
        initializer: (): string => {
          return 'my-string';
        },
      };
      const result = typeConverter.convert(reflectedType);
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(String));
      expect(result.hasInitializer()).to.be.true;
      expect(result.getInitializer()).to.be.equal('my-string');
    });

    it('converts number as type with initializer(triggered on class reflection)', () => {
      const reflectedType = {
        kind: 3,
        initializer: (): number => {
          return 69;
        },
      };
      const result = typeConverter.convert(reflectedType);
      expect(result).to.be.instanceof(InstanceOf);
      expect(result).to.be.eql(new InstanceOf(Number));
      expect(result.hasInitializer()).to.be.true;
      expect(result.getInitializer()).to.be.equal(69);
    });
  });
});
