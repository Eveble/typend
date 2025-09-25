import { expect } from 'chai';
import { Types as tsruntimeTypes } from 'tsruntime';
import { Type } from '../../../src/decorators/type.decorator';
import 'reflect-metadata';
import { isType } from '../../../src/helpers';

describe(`Type`, function () {
  @Type()
  class Parent {
    key: string;
  }

  @Type()
  class Child extends Parent {
    otherKey: number;
  }

  class NonDefinableClass {}

  it('ensures that ReflectedType metadata is defined on parent class', () => {
    const metadataKeys = Reflect.getOwnMetadataKeys(Parent);
    for (const metadataKey of metadataKeys) {
      if (metadataKey.toString() === Symbol('tsruntime:type').toString()) {
        const metadata = Reflect.getMetadata(metadataKey, Parent);
        expect(metadata).to.be.eql({
          kind: 19,
          name: 'Parent',
          properties: {
            key: {
              kind: 2,
              modifiers: 0,
            },
          },
          constructors: [{ modifiers: 0, parameters: [] }],
        });
      }
    }
  });

  it('ensures that ReflectedType metadata is defined on child class', () => {
    const metadataKeys = Reflect.getOwnMetadataKeys(Child);
    for (const metadataKey of metadataKeys) {
      if (metadataKey.toString() === Symbol('tsruntime:type').toString()) {
        const metadata = Reflect.getMetadata(metadataKey, Child);
        expect(metadata).to.be.eql({
          kind: 19,
          name: 'Child',
          properties: {
            otherKey: {
              kind: 3,
              modifiers: 0,
            },
          },
          constructors: [{ modifiers: 0, parameters: [] }],
          extends: { kind: 18, type: Parent, arguments: [] },
        });
      }
    }
  });

  describe('hooks', () => {
    it('sets beforeDefine hook on decorator', () => {
      const name = 'MyType';
      function beforeDefine(
        target: any,
        reflectedType: tsruntimeTypes.ReflectedType,
        typeName: string
      ): void {
        target.target = target;
        target.typeName = typeName;
      }
      Type.beforeDefine = beforeDefine;

      @Type(name)
      class MyType {}

      expect((MyType as any).typeName).to.be.equal(name);
    });

    it('sets afterDefine hook on decorator', () => {
      const name = 'MyType';
      function afterDefine(
        target: any,
        reflectedType: tsruntimeTypes.ReflectedType,
        typeName: string
      ): void {
        target.target = target;
        target.typeName = typeName;
      }
      Type.afterDefine = afterDefine;

      @Type(name)
      class MyType {}


      expect((MyType as any).typeName).to.be.equal(name);
    });
  });

  describe('isType helper', () => {
    it('returns true on class decorated with @Type decorator', () => {
      expect(isType(Parent)).to.be.true;
      expect(isType(Child)).to.be.true;
    });

    it('returns false on class that are not decorated with @Type decorator', () => {
      expect(isType(NonDefinableClass)).to.be.false;
    });
  });
});
