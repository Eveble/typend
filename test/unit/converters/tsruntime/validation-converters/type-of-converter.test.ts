import { expect } from 'chai';
import { reflect } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
import { $TypeOf } from '../../../../../src/utility-types';
import { define } from '../../../../../src/decorators/define';
import { TypeOfConverter } from '../../../../../src/converters/tsruntime/validation-converters/type-of-converter';
import { types } from '../../../../../src/types';
import { KINDS } from '../../../../../src/constants/literal-keys';
import { InstanceOf } from '../../../../../src/patterns/instance-of';
import { Class } from '../../../../../src/patterns/class';

describe(`TypeOfConverter`, function () {
  @define()
  class MyClass {
    key: string;
  }

  let converter: any;
  let classConverter: any;
  let typeConverter: TypeOfConverter;
  const validPayload = { kind: 18, modifiers: 0, type: MyClass, arguments: [] };

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    classConverter = stubInterface<types.TypeConverter>();
    typeConverter = new TypeOfConverter();
    converter.typeConverters = new Map();

    converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
  });

  describe('evaluation', () => {
    it(`returns true for reflected utility type 'TypeOf'`, () => {
      classConverter.isConvertible.withArgs(validPayload).returns(true);
      expect(
        typeConverter.isConvertible(reflect<$TypeOf<MyClass>>(), converter)
      ).to.be.true;
    });

    it(`returns false for reflected utility type 'TypeOf' with passed invalid generic as non-class`, () => {
      classConverter.isConvertible
        .withArgs({ kind: 8, modifiers: 0 })
        .returns(false);
      classConverter.isConvertible
        .withArgs({ kind: 7, modifiers: 0 })
        .returns(false);
      classConverter.isConvertible
        .withArgs({ kind: 15, modifiers: 0, properties: {} })
        .returns(false);

      expect(
        typeConverter.isConvertible(reflect<$TypeOf<true>>(), converter),
        `Expected <$TypeOf<true>> to not be convertible`
      ).to.be.false;
      expect(
        typeConverter.isConvertible(reflect<$TypeOf<false>>(), converter),
        `Expected <$TypeOf<false>> to not be convertible`
      ).to.be.false;
      expect(
        typeConverter.isConvertible(reflect<$TypeOf<{}>>(), converter),
        `Expected <$TypeOf<{}>> to not be convertible`
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
    it('returns converted class as Class pattern isntance', () => {
      const properties = { key: new InstanceOf(String) };
      const classPattern = new Class(MyClass, properties);
      classConverter.convert
        .withArgs(validPayload, converter)
        .returns(classPattern);

      expect(
        typeConverter.convert(reflect<$TypeOf<MyClass>>(), converter)
      ).to.be.eql(classPattern);
    });
  });

  describe('reflection', () => {
    it('returns reflected class properties', () => {
      const properties = { key: String };
      classConverter.reflect
        .withArgs(validPayload, converter)
        .returns(properties);

      expect(
        typeConverter.reflect(reflect<$TypeOf<MyClass>>(), converter)
      ).to.be.eql(properties);
    });
  });
});
