import 'reflect-metadata';
import { expect } from 'chai';
import { internal } from '../../../src/annotations/internal';
import {
  INTERNAL_PROPS_KEY,
  INTERNAL_METHODS_KEY,
} from '../../../src/constants/metadata-keys';
import { types } from '../../../src/types';

describe(`internal`, () => {
  class Parent {
    parent: string;

    @internal internalParentKey: number;

    @internal internalOtherParentKey: number;

    myMethod(): void {
      return undefined;
    }

    @internal
    internalParentMethod(): void {
      return undefined;
    }

    @internal
    internalOtherParentMethod(): void {
      return undefined;
    }
  }

  class Child extends Parent {
    child: number;

    @internal internalChildKey: number;

    @internal
    internalChildMethod(): void {
      return undefined;
    }
  }

  describe('annotating properties', () => {
    it('adds all properties annotated as internal to metadata on parent', () => {
      const internalKeys: types.InternalCollection = Reflect.getOwnMetadata(
        INTERNAL_PROPS_KEY,
        Parent
      );
      expect(internalKeys).to.be.eql({
        internalParentKey: true,
        internalOtherParentKey: true,
      });
    });

    it('ensures that properties annotated as internal on child does not leak on parent', () => {
      const internalKeys: types.InternalCollection = Reflect.getOwnMetadata(
        INTERNAL_PROPS_KEY,
        Child
      );
      expect(internalKeys).to.be.eql({
        internalChildKey: true,
      });
    });
  });

  describe('annotating methods', () => {
    it('adds all methods annotated as internal to metadata on parent', () => {
      const internalMethods: types.InternalCollection = Reflect.getOwnMetadata(
        INTERNAL_METHODS_KEY,
        Parent
      );
      expect(internalMethods).to.be.eql({
        internalParentMethod: true,
        internalOtherParentMethod: true,
      });
    });

    it('ensures that methods annotated as internal on child does not leak on parent', () => {
      const internalKeys: types.InternalCollection = Reflect.getOwnMetadata(
        INTERNAL_METHODS_KEY,
        Child
      );
      expect(internalKeys).to.be.eql({
        internalChildMethod: true,
      });
    });
  });
});
