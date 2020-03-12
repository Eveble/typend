import { Types as tsrTypes, reflect } from 'tsruntime';
import { expect } from 'chai';
import { stubInterface } from 'ts-sinon';
import { ObjectConverter } from '../../../../../src/converters/tsruntime/type-converters/object-converter';
import { types } from '../../../../../src/types';
import { define } from '../../../../../src/decorators/define';
import { Collection } from '../../../../../src/patterns/collection';
import { InstanceOf } from '../../../../../src/patterns/instance-of';
import { KINDS } from '../../../../../src/constants/literal-keys';
import { Interface } from '../../../../../src/patterns/interface';

describe(`ObjectConverter`, function() {
  let converter: any;
  let classConverter: any;
  let typeConverter: ObjectConverter;

  before(() => {
    converter = stubInterface<types.Converter>();
    classConverter = stubInterface<types.TypeConverter>();
    typeConverter = new ObjectConverter();
    converter.typeConverters = new Map();
  });

  @define()
  class MyClass {
    key: string;
  }

  interface MyInterface {
    key: string;
    myMethod(): string;
  }

  const symbolAsAKey = Symbol('some key');

  describe('evaluation', () => {
    it('returns true for Record type', () => {
      const examples: [string, any][] = [
        ['Record<string, any>', reflect<Record<string, any>>()],
        ['Record<number, any>', reflect<Record<number, any>>()],
        ['Record<keyof any, any>', reflect<Record<keyof any, any>>()],
      ];
      for (const [desc, type] of examples) {
        expect(
          typeConverter.isConvertible(type),
          `Expected ${desc} to be convertible`
        ).to.be.true;
      }
    });

    it('returns true for empty object literal', () => {
      expect(
        typeConverter.isConvertible(reflect<{}>()),
        `Expected {} to be convertible`
      ).to.be.true;
    });

    it('returns true for object literal with key and values', () => {
      expect(
        typeConverter.isConvertible(reflect<{ key: 'value' }>()),
        `Expected {key: 'value'} to be convertible`
      ).to.be.true;
    });

    it('returns true for object literal with symbol key', () => {
      expect(
        typeConverter.isConvertible(
          reflect<{
            [symbolAsAKey]: string;
          }>()
        ),
        `Expected {[symbolAsAKey]: string} to be convertible`
      ).to.be.true;
    });

    it('returns true for object literal with another nested object', () => {
      expect(
        typeConverter.isConvertible(
          reflect<{
            first: {
              second: string;
            };
          }>()
        ),
        `Expected {first: {second: string}} to be convertible`
      ).to.be.true;
    });

    it('returns true for interface with properties', () => {
      expect(
        typeConverter.isConvertible(reflect<MyInterface>()),
        `Expected MyInterface to be convertible`
      ).to.be.true;
    });
  });

  describe('reflection', () => {
    it('returns reflected empty object literal', () => {
      const objType = typeConverter.reflect(
        reflect<{}>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Object);
      expect(objType).to.be.eql({});
    });

    it('returns reflected object literal with key and value', () => {
      converter.reflect.withArgs({ kind: 2 }).returns(String);
      const objType = typeConverter.reflect(
        reflect<{ key: string }>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Object);
      expect(objType).to.be.eql({ key: String });
    });

    it('returns reflected interface with properties', () => {
      converter.reflect.withArgs({ kind: 2 }).returns(String);
      converter.reflect.withArgs({ kind: 21 }).returns(Function);
      const objType = typeConverter.reflect(
        reflect<MyInterface>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Object);
      expect(objType).to.be.eql({ key: String, myMethod: Function });
    });

    it('ensures tha property key as symbol is preserved on properties', () => {
      converter.reflect.withArgs({ kind: 2 }).returns(String);
      const objType = typeConverter.reflect(
        reflect<{ [symbolAsAKey]: string }>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Object);
      expect(objType).to.be.eql({ [symbolAsAKey]: String });
    });

    it(`ensures tha use of 'Reflect.ownKeys' does not impact on properties with key names matching build-in native ones`, () => {
      converter.reflect.withArgs({ kind: 3 }).returns(Number);
      const objType = typeConverter.reflect(
        reflect<{ length: number }>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Object);
      expect(objType).to.be.eql({ length: Number });
    });

    it('returns converted object literal with property value as a type', () => {
      converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
      classConverter.isConvertible
        .withArgs({ kind: 18, type: MyClass, arguments: [] })
        .returns(true);

      const objType = typeConverter.reflect(
        reflect<{ key: MyClass }>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Object);
      expect(objType).to.be.eql({ key: MyClass });
    });
  });

  describe('conversion', () => {
    it.skip('ensures that Record types definition is enforced upon key and value', () => {
      throw new Error('not implemented');
    });

    it('returns converted empty object literal as Collection instance', () => {
      const objType = typeConverter.convert(
        reflect<{}>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Collection);
      expect(objType).to.be.eql(new Collection({}));
    });

    it('returns converted object literal with key and value as Collection instance', () => {
      converter.convert.withArgs({ kind: 2 }).returns(new InstanceOf(String));
      const objType = typeConverter.convert(
        reflect<{ key: string }>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Collection);
      expect(objType).to.be.eql(
        new Collection({ key: new InstanceOf(String) })
      );
    });

    it('returns converted object literal with key and value as Collection instance with property initializer', () => {
      const reflectedType = {
        kind: 15,
        initializer: (): any => {
          return { key: 'my-string' };
        },
        properties: { key: { kind: 2 } },
      };

      converter.convert.withArgs({ kind: 2 }).returns(new InstanceOf(String));
      const objType = typeConverter.convert(reflectedType, converter);
      expect(objType).to.be.instanceof(Collection);
      expect(objType).to.be.eql(
        new Collection({ key: new InstanceOf(String) })
      );
      expect(objType.hasInitializer()).to.be.true;
      expect(objType.getInitializer()).to.be.eql({
        key: 'my-string',
      });
    });

    it('returns converted interface with properties as Interface instance', () => {
      converter.convert.withArgs({ kind: 2 }).returns(new InstanceOf(String));
      converter.convert
        .withArgs({ kind: 21 })
        .returns(new InstanceOf(Function));
      const intfType: Interface = typeConverter.convert(
        reflect<MyInterface>() as tsrTypes.ObjectType,
        converter
      ) as Interface;
      expect(intfType).to.be.instanceof(Interface);
      expect(intfType.getName()).to.be.equal('MyInterface');
      expect(intfType).to.be.eql(
        new Interface({
          key: new InstanceOf(String),
          myMethod: new InstanceOf(Function),
        })
      );
    });

    it('ensures tha property key as symbol is preserved on properties', () => {
      converter.convert.withArgs({ kind: 2 }).returns(new InstanceOf(String));
      const objType = typeConverter.convert(
        reflect<{ [symbolAsAKey]: string }>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Collection);
      expect(objType).to.be.eql(
        new Collection({ [symbolAsAKey]: new InstanceOf(String) })
      );
    });

    it(`ensures tha use of 'Reflect.ownKeys' does not impact on properties with key names matching build-in native ones`, () => {
      converter.convert.withArgs({ kind: 3 }).returns(new InstanceOf(Number));
      const objType = typeConverter.convert(
        reflect<{ length: number }>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Collection);
      expect(objType).to.be.eql(
        new Collection({ length: new InstanceOf(Number) })
      );
    });

    it('returns converted object literal with property value as a type', () => {
      converter.getConverter.withArgs(KINDS.CLASS).returns(classConverter);
      classConverter.isConvertible
        .withArgs({ kind: 18, type: MyClass, arguments: [] })
        .returns(true);

      const objType = typeConverter.convert(
        reflect<{ key: MyClass }>() as tsrTypes.ObjectType,
        converter
      );
      expect(objType).to.be.instanceof(Collection);
      expect(objType).to.be.eql(
        new Collection({ key: new InstanceOf(MyClass) })
      );
    });
  });
});
