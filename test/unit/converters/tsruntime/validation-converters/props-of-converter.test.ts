import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
import { $PropsOf } from '../../../../../src/utility-types';
import { define } from '../../../../../src/decorators/define';
import { PropsOfConverter } from '../../../../../src/converters/tsruntime/validation-converters/props-of-converter';
import { types } from '../../../../../src/types';
import { KINDS } from '../../../../../src/constants/literal-keys';
import { InstanceOf } from '../../../../../src/patterns/instance-of';
import { Class } from '../../../../../src/patterns/class';

describe(`PropsOfConverter`, function () {
  @define()
  class MyClass {
    key: string;
  }

  let converter: any;
  let classConverter: any;
  let typeConverter: PropsOfConverter;
  const validPayload = { kind: 18, type: MyClass, arguments: [] };

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    classConverter = stubInterface<types.TypeConverter>();
    typeConverter = new PropsOfConverter();
    converter.typeConverters = new Map();

    converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
  });

  describe('evaluation', () => {
    it(`returns true for reflected utility type '$PropsOf'`, () => {
      classConverter.isConvertible.withArgs(validPayload).returns(true);
      expect(
        typeConverter.isConvertible(reflect<$PropsOf<MyClass>>(), converter)
      ).to.be.true;
    });

    it(`returns false for reflected utility type 'PropsOf' with passed invalid generic as non-class`, () => {
      classConverter.isConvertible.withArgs({ kind: 8 }).returns(false);
      classConverter.isConvertible.withArgs({ kind: 7 }).returns(false);
      classConverter.isConvertible
        .withArgs({ kind: 15, properties: {} })
        .returns(false);

      expect(
        typeConverter.isConvertible(reflect<$PropsOf<true>>(), converter),
        `Expected <$PropsOf<true>> to not be convertible`
      ).to.be.false;
      expect(
        typeConverter.isConvertible(reflect<$PropsOf<false>>(), converter),
        `Expected <$PropsOf<false>> to not be convertible`
      ).to.be.false;
      expect(
        typeConverter.isConvertible(reflect<$PropsOf<{}>>(), converter),
        `Expected <$PropsOf<{}>> to not be convertible`
      ).to.be.false;
    });

    it(`returns false for reflected class type`, () => {
      expect(typeConverter.isConvertible(reflect<MyClass>(), converter)).to.be
        .false;
    });

    it(`returns false for reflected object type`, () => {
      expect(typeConverter.isConvertible(reflect<{}>(), converter)).to.be.false;
    });
  });

  describe('conversion', () => {
    it('returns converted class properties', () => {
      const properties = { key: new InstanceOf(String) };
      classConverter.convert
        .withArgs(validPayload, converter)
        .returns(new Class(MyClass, properties));

      expect(
        typeConverter.convert(reflect<$PropsOf<MyClass>>(), converter)
      ).to.be.eql(properties);
    });
  });

  describe('reflection', () => {
    it('returns reflected class properties', () => {
      const properties = { key: String };
      classConverter.reflect
        .withArgs(validPayload, converter)
        .returns(properties);

      expect(
        typeConverter.reflect(reflect<$PropsOf<MyClass>>(), converter)
      ).to.be.eql(properties);
    });
  });
});
