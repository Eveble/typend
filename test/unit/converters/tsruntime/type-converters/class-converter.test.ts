import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { reflect, Types as tsrTypes, getClassType } from 'tsruntime';
import { stubInterface } from 'ts-sinon';
import { KINDS } from '../../../../../src/constants/literal-keys';
import { ClassConverter } from '../../../../../src/converters/tsruntime/type-converters/class-converter';
import { types } from '../../../../../src/types';
import { define } from '../../../../../src/decorators/define';
import {
  REFLECTION_KEY,
  PROPERTIES_KEY,
} from '../../../../../src/constants/metadata-keys';
import { Class } from '../../../../../src/patterns/class';
import { Collection } from '../../../../../src/patterns/collection';
import { InstanceOf } from '../../../../../src/patterns/instance-of';

chai.use(sinonChai);

describe(`ClassConverter`, function () {
  let converter: any;
  let objConverter: any;
  let typeConverter: ClassConverter;

  beforeEach(() => {
    converter = stubInterface<types.Converter>();
    objConverter = stubInterface<types.TypeConverter>();
    const transformers = new Map();
    typeConverter = new ClassConverter(transformers);
  });

  @define()
  class MyClass {
    key: string;
  }

  describe('evaluation', () => {
    it('returns true for class reference', () => {
      expect(
        typeConverter.isConvertible(reflect<MyClass>()),
        `Expected MyClass reference to be convertible`
      ).to.be.true;
    });

    it(`returns true for class type resolved with tsruntime's 'getClassType'`, () => {
      expect(
        typeConverter.isConvertible(getClassType(MyClass)),
        `Expected MyClass type to be convertible`
      ).to.be.true;
    });

    it(`returns true for class type`, () => {
      expect(
        typeConverter.isConvertible(MyClass),
        `Expected MyClass type to be convertible`
      ).to.be.true;
    });
  });

  describe('reflection', () => {
    beforeEach(() => {
      converter.getConverter.withArgs(KINDS.OBJECT).returns(objConverter);
    });

    it('returns reflected class properties from passed type', () => {
      @define()
      class MyExample {
        key: string;
      }

      objConverter.reflect
        .withArgs({
          kind: 19,
          name: 'MyExample',
          properties: { key: { kind: 2 } },
        })
        .returns({
          key: String,
        });

      const classType = typeConverter.reflect(MyExample, converter);
      expect(classType).to.be.instanceof(Object);
      expect(classType).to.be.eql({ key: String });
    });

    it('returns reflected class properties from passed reflection', () => {
      @define()
      class MyExample {
        key: number;
      }

      objConverter.reflect
        .withArgs({
          kind: 19,
          name: 'MyExample',
          properties: { key: { kind: 3 } },
        })
        .returns({
          key: Number,
        });

      const classType = typeConverter.reflect(
        reflect<MyExample>() as tsrTypes.ReferenceType,
        converter
      );
      expect(classType).to.be.instanceof(Object);
      expect(classType).to.be.eql({ key: Number });
    });

    it(`returns reflected class properties from whole type's inheritance tree`, () => {
      @define()
      class Parent {
        firstParent: string;

        secondParent: number;
      }

      @define()
      class Child extends Parent {
        firstChild: boolean;

        secondChild: 'my-value';
      }

      objConverter.reflect
        .withArgs({
          kind: 19,
          name: 'Parent',
          properties: {
            firstParent: { kind: 2 },
            secondParent: { kind: 3 },
          },
        })
        .returns({
          firstParent: String,
          secondParent: Number,
        });

      objConverter.reflect
        .withArgs({
          kind: 19,
          name: 'Child',
          properties: {
            firstChild: { kind: 4 },
            secondChild: { kind: 5, value: 'my-value' },
          },
          extends: { kind: 18, type: Parent, arguments: [] },
        })
        .returns({
          firstChild: Boolean,
          secondChild: 'my-value',
        });

      const classType = typeConverter.reflect(
        reflect<Child>() as tsrTypes.ReferenceType,
        converter
      );
      expect(classType).to.be.instanceof(Object);
      expect(classType).to.be.eql({
        firstParent: String,
        secondParent: Number,
        firstChild: Boolean,
        secondChild: 'my-value',
      });
    });

    it('returns transformed transformable properties from reflection', () => {
      const transformer = stubInterface<types.TypeTransformer>();
      typeConverter.transformers.set('myTransformer', transformer);

      @define()
      class MyExample {
        key: string;
      }

      const properties = {
        key: String,
      };
      const classType = new Class(MyExample, properties);
      const transformedProperties = {
        ...properties,
        ...{ version: Number },
      };
      const transformedClassType = new Class(MyExample, transformedProperties);

      objConverter.reflect
        .withArgs({
          kind: 19,
          name: 'MyExample',
          properties: { key: { kind: 2 } },
        })
        .returns(properties);

      transformer.canTransform.withArgs(classType).returns(true);
      transformer.transform.withArgs(classType).returns(transformedClassType);

      const reflectedAndTransformedClassProps = typeConverter.reflect(
        MyExample,
        converter
      );
      expect(reflectedAndTransformedClassProps).to.be.instanceof(Object);
      expect(reflectedAndTransformedClassProps).to.be.eql(
        transformedProperties
      );
    });

    describe('caching', () => {
      it('caches reflected class properties', () => {
        @define()
        class MyExample {
          key: string;
        }

        objConverter.reflect
          .withArgs({
            kind: 19,
            name: 'MyExample',
            properties: { key: { kind: 2 } },
          })
          .returns({
            key: String,
          });

        const properties = { key: String };
        const firstResult = typeConverter.reflect(MyExample, converter);
        expect(firstResult).to.be.instanceof(Object);
        expect(firstResult).to.be.eql(properties);
        expect(Reflect.getOwnMetadata(REFLECTION_KEY, MyExample)).to.be.eql(
          properties
        );
      });

      it('returns cached reflected class properties', () => {
        @define()
        class MyExample {
          key: string;
        }

        objConverter.reflect
          .withArgs({
            kind: 19,
            name: 'MyExample',
            properties: { key: { kind: 2 } },
          })
          .returns({
            key: String,
          });

        const firstResult = typeConverter.reflect(MyExample, converter);
        expect(firstResult).to.be.instanceof(Object);
        expect(firstResult).to.be.eql({ key: String });
        const secondResult = typeConverter.reflect(MyExample, converter);
        expect(secondResult).to.be.instanceof(Object);
        expect(secondResult).to.be.eql({ key: String });
        expect(objConverter.reflect).to.be.calledOnce;
      });
    });
  });

  describe('conversion', () => {
    beforeEach(() => {
      converter.getConverter.withArgs(KINDS.OBJECT).returns(objConverter);
    });

    it('returns converted class properties from passed type', () => {
      @define()
      class MyExample {
        key: string;
      }

      objConverter.convert
        .withArgs({
          kind: 19,
          name: 'MyExample',
          properties: { key: { kind: 2 } },
        })
        .returns(
          new Collection({
            key: new InstanceOf(String),
          })
        );

      const classType = typeConverter.convert(MyExample, converter);
      expect(classType).to.be.instanceof(Class);
      expect(classType).to.be.eql(
        new Class(MyExample, { key: new InstanceOf(String) })
      );
    });

    it('returns converted class properties from passed reflection', () => {
      @define()
      class MyExample {
        key: number;
      }

      objConverter.convert
        .withArgs({
          kind: 19,
          name: 'MyExample',
          properties: { key: { kind: 3 } },
        })
        .returns(
          new Collection({
            key: new InstanceOf(Number),
          })
        );

      const classType = typeConverter.convert(
        reflect<MyExample>() as tsrTypes.ReferenceType,
        converter
      );
      expect(classType).to.be.instanceof(Class);
      expect(classType).to.be.eql(
        new Class(MyExample, { key: new InstanceOf(Number) })
      );
    });

    it('returns converted class properties from whole inheritance tree', () => {
      @define()
      class Parent {
        firstParent: string;

        secondParent: number;
      }

      @define()
      class Child extends Parent {
        firstChild: boolean;

        secondChild: 'my-value';
      }

      objConverter.convert
        .withArgs({
          kind: 19,
          name: 'Parent',
          properties: {
            firstParent: { kind: 2 },
            secondParent: { kind: 3 },
          },
        })
        .returns(
          new Collection({
            firstParent: new InstanceOf(String),
            secondParent: new InstanceOf(Number),
          })
        );

      objConverter.convert
        .withArgs({
          kind: 19,
          name: 'Child',
          properties: {
            firstChild: { kind: 4 },
            secondChild: { kind: 5, value: 'my-value' },
          },
          extends: { kind: 18, type: Parent, arguments: [] },
        })
        .returns(
          new Collection({
            firstChild: new InstanceOf(Boolean),
            secondChild: 'my-value',
          })
        );

      const classType = typeConverter.convert(
        reflect<Child>() as tsrTypes.ReferenceType,
        converter
      );

      expect(classType).to.be.instanceof(Class);
      expect(classType).to.be.eql(
        new Class(Child, {
          firstParent: new InstanceOf(String),
          secondParent: new InstanceOf(Number),
          firstChild: new InstanceOf(Boolean),
          secondChild: 'my-value',
        })
      );
    });

    it('returns transformed transformable properties from conversion', () => {
      const transformer = stubInterface<types.TypeTransformer>();
      typeConverter.transformers.set('myTransformer', transformer);

      @define()
      class MyExample {
        key: string;
      }

      const collProperties = new Collection({
        key: new InstanceOf(String),
      });
      const classType = new Class(MyExample, collProperties);
      const transformedProperties = {
        key: new InstanceOf(String),
        version: new InstanceOf(Number),
      };
      const transformedClassType = new Class(MyExample, transformedProperties);

      objConverter.convert
        .withArgs({
          kind: 19,
          name: 'MyExample',
          properties: { key: { kind: 2 } },
        })
        .returns(collProperties);

      transformer.canTransform.withArgs(classType).returns(true);
      transformer.transform.withArgs(classType).returns(transformedClassType);

      const convertedAndTransformedClassType = typeConverter.convert(
        MyExample,
        converter
      );
      expect(convertedAndTransformedClassType).to.be.instanceof(Class);
      expect(convertedAndTransformedClassType).to.be.eql(transformedClassType);
    });

    describe('caching', () => {
      it('caches converted class properties', () => {
        @define()
        class MyExample {
          key: string;
        }

        objConverter.convert
          .withArgs({
            kind: 19,
            name: 'MyExample',
            properties: { key: { kind: 2 } },
          })
          .returns(
            new Collection({
              key: new InstanceOf(String),
            })
          );

        const properties = { key: new InstanceOf(String) };
        const firstResult = typeConverter.convert(MyExample, converter);
        expect(firstResult).to.be.instanceof(Class);
        expect(firstResult).to.be.eql(new Class(MyExample, properties));
        expect(Reflect.getOwnMetadata(PROPERTIES_KEY, MyExample)).to.be.eql(
          properties
        );
      });

      it('returns cached converted class properties', () => {
        @define()
        class MyExample {
          key: string;
        }

        objConverter.convert
          .withArgs({
            kind: 19,
            name: 'MyExample',
            properties: { key: { kind: 2 } },
          })
          .returns(
            new Collection({
              key: new InstanceOf(String),
            })
          );

        const firstResult = typeConverter.convert(MyExample, converter);
        expect(firstResult).to.be.instanceof(Class);
        expect(firstResult).to.be.eql(
          new Class(MyExample, { key: new InstanceOf(String) })
        );
        const secondResult = typeConverter.convert(MyExample, converter);
        expect(secondResult).to.be.instanceof(Class);
        expect(secondResult).to.be.eql(
          new Class(MyExample, { key: new InstanceOf(String) })
        );
        expect(objConverter.convert).to.be.calledOnce;
      });
    });
  });
});
