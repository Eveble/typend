import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';
import { mock } from 'vitest-mock-extended';
import { Types as tsruntimeTypes } from 'tsruntime';
import { Type } from '../../../src/decorators/type.decorator';
import 'reflect-metadata';
import { isType } from '../../../src/helpers';

describe(`Type`, () => {
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
        expect(metadata).toEqual({
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
        expect(metadata).toEqual({
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
    it('sets beforeHook hook on decorator', () => {
      const name = 'MyType';
      function beforeHook(
        target: any,
        reflectedType: tsruntimeTypes.ReflectedType,
        typeName: string
      ): void {
        target.target = target;
        target.typeName = typeName;
      }
      Type.beforeHook = beforeHook;

      @Type(name)
      class MyType {}

      expect((MyType as any).typeName).toBe(name);
    });

    it('sets afterHook hook on decorator', () => {
      const name = 'MyType';
      function afterHook(
        target: any,
        reflectedType: tsruntimeTypes.ReflectedType,
        typeName: string
      ): void {
        target.target = target;
        target.typeName = typeName;
      }
      Type.afterHook = afterHook;

      @Type(name)
      class MyType {}

      expect((MyType as any).typeName).toBe(name);
    });
  });

  describe('isType helper', () => {
    it('returns true on class decorated with @Type decorator', () => {
      expect(isType(Parent)).toBe(true);
      expect(isType(Child)).toBe(true);
    });

    it('returns false on class that are not decorated with @Type decorator', () => {
      expect(isType(NonDefinableClass)).toBe(false);
    });
  });
});
