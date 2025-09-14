import { expect } from 'chai';
import { Types as tsruntimeTypes } from 'tsruntime';
import { define } from '../../../src/decorators/define';
import 'reflect-metadata';
import { isDefined } from '../../../src/helpers';

describe(`define`, function () {
  @define()
  class Parent {
    key: string;
  }

  @define()
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
      define.beforeDefine = beforeDefine;

      @define(name)
      class MyType {}
      expect((MyType as any).target).to.be.be.equal(MyType);
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
      define.afterDefine = afterDefine;

      @define(name)
      class MyType {}
      expect((MyType as any).target).to.be.be.equal(MyType);
      expect((MyType as any).typeName).to.be.equal(name);
    });
  });

  describe('isDefined helper', () => {
    it('returns true on class decorated with define decorator', () => {
      expect(isDefined(Parent)).to.be.true;
      expect(isDefined(Child)).to.be.true;
    });

    it('returns false on class that are not decorated with define decorator', () => {
      expect(isDefined(NonDefinableClass)).to.be.false;
    });
  });
});
