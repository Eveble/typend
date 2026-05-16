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
import { classes } from 'polytype';
import { Types as tsrTypes } from 'tsruntime';
import {
  getResolvablePath,
  isResolvablePath,
  getMatchingParentProto,
  isPatternClass,
  isPattern,
  isUtility,
  isType,
  isValidable,
  isInstanceOfExpectation,
  isSpecial,
} from '../../src/helpers';
import { types } from '../../src/types';
import { Validable } from '../../src/annotations/validable';
import { Class } from '../../src/patterns/class';
import { InstanceOf } from '../../src/patterns/instance-of';
import { Interface } from '../../src/patterns/interface';
import { VALIDATION_TYPE_KEY } from '../../src/constants/literal-keys';
import { Type } from '../../src/decorators/type.decorator';

describe(`helpers`, () => {
  describe('getResolvablePath', () => {
    it('returns path to nearest pattern node by removing nested Type pattern properties structure from path segments', () => {
      const props: Record<string, any> = {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {
            // Simulate Pattern structure
            properties: {
              c: 'value',
            },
          },
        },
      };

      expect(getResolvablePath('foo.baz.properties', props)).toBe('foo.baz');
    });

    it('returns path to object node with nearest resolvable properties by omitting unreachable path segments', () => {
      const props: Record<string, any> = {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {},
        },
      };

      expect(getResolvablePath('foo.baz.qux.quux', props)).toBe('foo.baz');
    });
  });

  describe('isResolvablePath', () => {
    it('returns true for resolvable path', () => {
      const props: Record<string, any> = {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {
            c: 'value',
          },
        },
      };

      expect(isResolvablePath('foo.baz.c', props)).toBe(true);
    });
    it('returns false for non-resolvable path', () => {
      const props: Record<string, any> = {
        foo: {
          bar: {
            a: String,
            b: Number,
          },
          baz: {
            c: 'value',
          },
        },
      };

      expect(isResolvablePath('foo.bar.a.c', props)).toBe(false);
    });
  });

  describe('getMatchingParentProto', () => {
    class FirstMixin {}
    class SecondMixin {}
    class ThirdMixin {}

    it('returns prototype by matching matcher', () => {
      class MyLibrary extends classes(FirstMixin, SecondMixin) {}

      const matcher = (evaluatedProto: types.Prototype): boolean =>
        evaluatedProto.constructor.name === 'FirstMixin';
      expect(getMatchingParentProto(MyLibrary.prototype, matcher)).toBe(
        FirstMixin.prototype
      );
    });

    it(`does not return prototype if prototype can't be found on prototype chain`, () => {
      class MyLibrary extends classes(SecondMixin, ThirdMixin) {}

      const matcher = (evaluatedProto: types.Prototype): boolean =>
        evaluatedProto.constructor.name === 'FirstMixin';
      expect(
        getMatchingParentProto(MyLibrary.prototype, matcher)
      ).toBeUndefined();
    });
  });

  describe('isPatternClass', () => {
    it('returns true for argument(class constructor) implementing Pattern interface', () => {
      class MyPattern {
        getKind(): string {
          return 'my-type';
        }
      }
      expect(isPatternClass(MyPattern)).toBe(true);
    });

    it('returns false for arguments not implementing Pattern interface', () => {
      class MyPattern {}

      expect(isPatternClass(MyPattern)).toBe(false);
    });
  });

  describe('isPattern', () => {
    it('returns true for value implementing Pattern interface', () => {
      class MyPattern {
        getKind(): string {
          return 'my-type';
        }
      }
      expect(isPattern(new MyPattern())).toBe(true);
    });
    it('returns false for value not implementing Pattern interface', () => {
      class MyPattern {}

      expect(isPattern(undefined)).toBe(false);
      expect(isPattern(null)).toBe(false);
      expect(isPattern(new MyPattern())).toBe(false);
    });
  });

  describe('isInstanceOfExpectation', () => {
    it('returns true for instance of Class pattern', () => {
      class MyClass {
        key: string;
      }
      const classType = new Class(MyClass, { key: String });
      expect(isInstanceOfExpectation(classType)).toBe(true);
    });

    it('returns true for instance of InstanceOf pattern', () => {
      class MyClass {
        key: string;
      }
      expect(isInstanceOfExpectation(new InstanceOf(MyClass))).toBe(true);
    });

    it('returns true for instance of Interface pattern', () => {
      const intf = new Interface({
        key: String,
      });
      expect(isInstanceOfExpectation(intf)).toBe(true);
    });

    it('returns true constructor functions', () => {
      class MyClass {
        key: string;
      }
      expect(isInstanceOfExpectation(String)).toBe(true);
      expect(isInstanceOfExpectation(Number)).toBe(true);
      expect(isInstanceOfExpectation(Boolean)).toBe(true);
      expect(isInstanceOfExpectation(MyClass)).toBe(true);
    });

    it('returns false for value not implementing Pattern interface', () => {
      expect(isInstanceOfExpectation(undefined)).toBe(false);
      expect(isInstanceOfExpectation(null)).toBe(false);
      expect(isInstanceOfExpectation('my-string')).toBe(false);
      expect(isInstanceOfExpectation(1337)).toBe(false);
    });
  });

  describe('isUtility', () => {
    it('returns true for argument implementing Utility interface', () => {
      class MyUtility {
        generate(): string {
          return 'my-type';
        }
      }
      expect(isUtility(new MyUtility())).toBe(true);
    });

    it('returns false for arguments not implementing Pattern interface', () => {
      class MyUtility {}

      expect(isUtility(undefined)).toBe(false);
      expect(isUtility(null)).toBe(false);
      expect(isUtility(new MyUtility())).toBe(false);
    });
  });

  describe('isType', () => {
    it('returns true for class constructors implementing @Type decorator', () => {
      @Type()
      class DefinableClass {}

      expect(isType(DefinableClass)).toBe(true);
    });

    it('returns false for class constructors not implementing @Type decorator', () => {
      class DefaultClass {}

      expect(isType(undefined)).toBe(false);
      expect(isType(DefaultClass)).toBe(false);
    });
  });

  describe('isValidable', () => {
    it('returns true for classes that are implicitly validable', () => {
      @Validable()
      class MyClass {}

      expect(isValidable(MyClass)).toBe(true);
    });

    it('returns true for classes that are explicitly validable', () => {
      @Validable(true)
      class MyClass {}

      expect(isValidable(MyClass)).toBe(true);
    });

    it('returns false for classes that are not explicitly validable', () => {
      @Validable(false)
      class MyClass {}

      expect(isValidable(MyClass)).toBe(false);
    });
  });

  describe('isSpecial', () => {
    it('returns true if reflected type is special type', () => {
      const reflectedType: tsrTypes.ObjectType = {
        kind: 15,
        properties: {
          [`${VALIDATION_TYPE_KEY}`]: {
            value: 'my-type',
          } as tsrTypes.StringLiteralType,
        },
      };
      expect(isSpecial(reflectedType)).toBe(true);
    });

    it('returns false if reflected type is not a special type', () => {
      const reflectedType: tsrTypes.ObjectType = {
        kind: 15,
        properties: {},
      };
      expect(isSpecial(reflectedType)).toBe(false);
    });
  });
});
