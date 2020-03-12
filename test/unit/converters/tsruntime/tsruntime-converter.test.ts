import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stubInterface } from 'ts-sinon';
import sinon from 'sinon';
import { types } from '../../../../src/types';
import { TSRuntimeConverter } from '../../../../src/converters/tsruntime/tsruntime-converter';
import { KINDS } from '../../../../src/constants/literal-keys';
import { Unknown } from '../../../../src/patterns/unknown';
import { TypeConverterExists } from '../../../../src/errors';

chai.use(sinonChai);

describe(`TSRuntimeConverter`, function() {
  let typeConverter: any;

  beforeEach(() => {
    typeConverter = stubInterface<types.TypeConverter>();
  });

  describe('construction', () => {
    it('takes type converters as a map instance and assigns it', () => {
      const typeConverters = new Map();
      const converter = new TSRuntimeConverter(typeConverters);
      expect(converter.typeConverters).to.be.equal(typeConverters);
    });

    it('initializes with empty type converters as a map', () => {
      const converter = new TSRuntimeConverter();
      expect(converter.typeConverters).to.be.instanceof(Map);
      expect(converter.typeConverters).to.be.empty;
    });
  });

  describe('type converters', () => {
    describe('registration', () => {
      it('registers type converter by its kind', () => {
        const converter = new TSRuntimeConverter();
        const kind = 'my-type';
        converter.registerConverter(kind, typeConverter);
        expect(converter.hasConverter(kind)).to.be.true;
        expect(converter.typeConverters).to.have.length(1);
      });

      it('throws TypeConverterExists when converter would be overridden', () => {
        const otherTypeConverter = stubInterface<types.TypeConverter>();

        const converter = new TSRuntimeConverter();
        const kind = 'my-type';
        converter.registerConverter(kind, typeConverter);
        expect(() =>
          converter.registerConverter(kind, otherTypeConverter)
        ).to.throw(
          TypeConverterExists,
          `Converter for type '${kind}' is already registered`
        );
      });

      it('returns type converter by the kind', () => {
        const converter = new TSRuntimeConverter();
        const kind = 'my-type';
        converter.registerConverter(kind, typeConverter);
        expect(converter.getConverter(kind)).to.be.equal(typeConverter);
      });

      it(`returns undefined if type converter for kind can't be found`, () => {
        const converter = new TSRuntimeConverter();
        const kind = 'my-type';
        expect(converter.getConverter(kind)).to.be.equal(undefined);
      });

      it('allows for explicit override of existing type converter', () => {
        const otherTypeConverter = stubInterface<types.TypeConverter>();

        const converter = new TSRuntimeConverter();
        const kind = 'my-type';
        converter.registerConverter(kind, typeConverter);
        expect(converter.getConverter(kind)).to.be.equal(typeConverter);
        expect(() =>
          converter.overrideConverter(kind, otherTypeConverter)
        ).to.not.throw(TypeConverterExists);
        expect(converter.getConverter(kind)).to.be.equal(otherTypeConverter);
      });
    });

    describe('evaluation', () => {
      it('returns true if type converter is registered by kind', () => {
        const converter = new TSRuntimeConverter();
        const kind = 'my-type';
        converter.registerConverter(kind, typeConverter);
        expect(converter.hasConverter(kind)).to.be.true;
      });
      it('returns false if type converter is not registered by kind', () => {
        const converter = new TSRuntimeConverter();
        const kind = 'my-type';
        expect(converter.hasConverter(kind)).to.be.false;
      });
    });

    it('removes type converter by type', () => {
      const converter = new TSRuntimeConverter();
      const kind = 'my-type';
      converter.registerConverter(kind, typeConverter);
      expect(converter.hasConverter(kind)).to.be.true;
      converter.removeConverter(kind);
      expect(converter.hasConverter(kind)).to.be.false;
    });
  });

  describe('conversion', () => {
    it('converts reflected type with convertible type converter', () => {
      const converter = new TSRuntimeConverter();
      converter.registerConverter('my-type', typeConverter);

      const reflectedType = { kind: 1234 };
      const convertedType = sinon.stub();
      typeConverter.isConvertible.withArgs(reflectedType).returns(true);
      typeConverter.convert
        .withArgs(reflectedType, converter)
        .returns(convertedType);

      expect(converter.convert(reflectedType)).to.be.equal(convertedType);
      expect(typeConverter.isConvertible).to.be.calledOnce;
      expect(typeConverter.isConvertible).to.be.calledWithExactly(
        reflectedType,
        converter
      );
      expect(typeConverter.convert).to.be.calledOnce;
      expect(typeConverter.convert).to.be.calledWithExactly(
        reflectedType,
        converter
      );
    });

    it(`converts with unknown type converter if type converter can't be found`, () => {
      const converter = new TSRuntimeConverter();
      converter.registerConverter('my-type', typeConverter);
      const unknownConverter = stubInterface<types.TypeConverter>();
      converter.registerConverter(KINDS.UNKNOWN, unknownConverter);

      const reflectedType = { kind: 1010 };
      const convertedType = new Unknown();
      typeConverter.isConvertible.withArgs(reflectedType).returns(false);
      unknownConverter.isConvertible.withArgs(reflectedType).returns(true);
      unknownConverter.convert
        .withArgs(reflectedType, converter)
        .returns(convertedType);

      expect(converter.convert(reflectedType)).to.be.equal(convertedType);
      expect(typeConverter.isConvertible).to.be.calledOnce;
      expect(typeConverter.isConvertible).to.be.calledWithExactly(
        reflectedType,
        converter
      );
      expect(typeConverter.convert).to.not.be.called;
      expect(unknownConverter.convert).to.be.calledOnce;
      expect(unknownConverter.convert).to.be.calledWithExactly(
        reflectedType,
        converter
      );
    });
  });
  describe('reflection', () => {
    it('reflects reflected type with convertible type converter', () => {
      const converter = new TSRuntimeConverter();
      converter.registerConverter('my-type', typeConverter);

      const reflectedType = { kind: 1234 };
      const convertedType = sinon.stub();
      typeConverter.isConvertible.withArgs(reflectedType).returns(true);
      typeConverter.reflect
        .withArgs(reflectedType, converter)
        .returns(convertedType);

      expect(converter.reflect(reflectedType)).to.be.equal(convertedType);
      expect(typeConverter.isConvertible).to.be.calledOnce;
      expect(typeConverter.isConvertible).to.be.calledWithExactly(
        reflectedType,
        converter
      );
      expect(typeConverter.reflect).to.be.calledOnce;
      expect(typeConverter.reflect).to.be.calledWithExactly(
        reflectedType,
        converter
      );
    });

    it(`reflects with unknown type converter if type converter can't be found`, () => {
      const converter = new TSRuntimeConverter();
      converter.registerConverter('my-type', typeConverter);
      const unknownConverter = stubInterface<types.TypeConverter>();
      converter.registerConverter(KINDS.UNKNOWN, unknownConverter);

      const reflectedType = { kind: 1010 };
      const convertedType = new Unknown();
      typeConverter.isConvertible.withArgs(reflectedType).returns(false);
      unknownConverter.isConvertible.withArgs(reflectedType).returns(true);
      unknownConverter.reflect
        .withArgs(reflectedType, converter)
        .returns(convertedType);

      expect(converter.reflect(reflectedType)).to.be.equal(convertedType);
      expect(typeConverter.isConvertible).to.be.calledOnce;
      expect(typeConverter.isConvertible).to.be.calledWithExactly(
        reflectedType,
        converter
      );
      expect(typeConverter.reflect).to.not.be.called;
      expect(unknownConverter.reflect).to.be.calledOnce;
      expect(unknownConverter.reflect).to.be.calledWithExactly(
        reflectedType,
        converter
      );
    });
  });
});
