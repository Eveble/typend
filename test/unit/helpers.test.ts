import { expect } from 'chai';
import { classes } from 'polytype';
import { Types as tsrTypes } from 'tsruntime';
import {
  getResolvablePath,
  isResolvablePath,
  getMatchingParentProto,
  isPatternClass,
  isPattern,
  isUtility,
  isDefinable,
  isValidable,
  isInstanceOfExpectation,
  isSpecial,
} from '../../src/helpers';
import { types } from '../../src/types';
import { define } from '../../src/decorators/define';
import { validable } from '../../src/annotations/validable';

import { Class } from '../../src/patterns/class';
import { InstanceOf } from '../../src/patterns/instance-of';
import { Interface } from '../../src/patterns/interface';
import { VALIDATION_TYPE_KEY } from '../../src/constants/literal-keys';

describe(`helpers`, function() {
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

      expect(getResolvablePath('foo.baz.properties', props)).to.be.equal(
        'foo.baz'
      );
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

      expect(getResolvablePath('foo.baz.qux.quux', props)).to.be.equal(
        'foo.baz'
      );
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

      expect(isResolvablePath('foo.baz.c', props)).to.be.true;
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

      expect(isResolvablePath('foo.bar.a.c', props)).to.be.false;
    });
  });

  describe('getMatchingParentProto', () => {
    class FirstMixin {}
    class SecondMixin {}
    class ThirdMixin {}

    it('returns prototype by matching matcher', () => {
      class MyLibrary extends classes(FirstMixin, SecondMixin) {}

      const matcher = (evaluatedProto: types.Prototype): boolean => {
        return evaluatedProto.constructor.name === 'FirstMixin';
      };
      expect(getMatchingParentProto(MyLibrary.prototype, matcher)).to.be.equal(
        FirstMixin.prototype
      );
    });

    it(`does not return prototype if prototype can't be found on prototype chain`, () => {
      class MyLibrary extends classes(SecondMixin, ThirdMixin) {}

      const matcher = (evaluatedProto: types.Prototype): boolean => {
        return evaluatedProto.constructor.name === 'FirstMixin';
      };
      expect(getMatchingParentProto(MyLibrary.prototype, matcher)).to.be
        .undefined;
    });
  });

  describe('isPatternClass', () => {
    it('returns true for argument(class constructor) implementing Pattern interface', () => {
      class MyPattern {
        getKind(): string {
          return 'my-type';
        }
      }
      expect(isPatternClass(MyPattern)).to.be.true;
    });

    it('returns false for arguments not implementing Pattern interface', () => {
      class MyPattern {}

      expect(isPatternClass(MyPattern)).to.be.false;
    });
  });

  describe('isPattern', () => {
    it('returns true for value implementing Pattern interface', () => {
      class MyPattern {
        getKind(): string {
          return 'my-type';
        }
      }
      expect(isPattern(new MyPattern())).to.be.true;
    });
    it('returns false for value not implementing Pattern interface', () => {
      class MyPattern {}

      expect(isPattern(undefined)).to.be.false;
      expect(isPattern(null)).to.be.false;
      expect(isPattern(new MyPattern())).to.be.false;
    });
  });

  describe('isInstanceOfExpectation', () => {
    it('returns true for instance of Class pattern', () => {
      class MyClass {
        key: string;
      }
      const classType = new Class(MyClass, { key: String });
      expect(isInstanceOfExpectation(classType)).to.be.true;
    });

    it('returns true for instance of InstanceOf pattern', () => {
      class MyClass {
        key: string;
      }
      expect(isInstanceOfExpectation(new InstanceOf(MyClass))).to.be.true;
    });

    it('returns true for instance of Interface pattern', () => {
      const intf = new Interface({
        key: String,
      });
      expect(isInstanceOfExpectation(intf)).to.be.true;
    });

    it('returns true constructor functions', () => {
      class MyClass {
        key: string;
      }
      expect(isInstanceOfExpectation(String)).to.be.true;
      expect(isInstanceOfExpectation(Number)).to.be.true;
      expect(isInstanceOfExpectation(Boolean)).to.be.true;
      expect(isInstanceOfExpectation(MyClass)).to.be.true;
    });

    it('returns false for value not implementing Pattern interface', () => {
      expect(isInstanceOfExpectation(undefined)).to.be.false;
      expect(isInstanceOfExpectation(null)).to.be.false;
      expect(isInstanceOfExpectation('my-string')).to.be.false;
      expect(isInstanceOfExpectation(1337)).to.be.false;
    });
  });

  describe('isUtility', () => {
    it('returns true for argument implementing Utility interface', () => {
      class MyUtility {
        generate(): string {
          return 'my-type';
        }
      }
      expect(isUtility(new MyUtility())).to.be.true;
    });

    it('returns false for arguments not implementing Pattern interface', () => {
      class MyUtility {}

      expect(isUtility(undefined)).to.be.false;
      expect(isUtility(null)).to.be.false;
      expect(isUtility(new MyUtility())).to.be.false;
    });
  });

  describe('isDefinable', () => {
    it('returns true for class constructors implementing @define decorator', () => {
      @define()
      class DefinableClass {}

      expect(isDefinable(DefinableClass)).to.be.true;
    });

    it('returns false for class constructors not implementing @define decorator', () => {
      class DefaultClass {}

      expect(isDefinable(undefined)).to.be.false;
      expect(isDefinable(DefaultClass)).to.be.false;
    });
  });

  describe('isValidable', () => {
    it('returns true for classes that are implicitly validable', () => {
      @validable()
      class MyClass {}

      expect(isValidable(MyClass)).to.be.true;
    });

    it('returns true for classes that are explicitly validable', () => {
      @validable(true)
      class MyClass {}

      expect(isValidable(MyClass)).to.be.true;
    });

    it('returns false for classes that are not explicitly validable', () => {
      @validable(false)
      class MyClass {}

      expect(isValidable(MyClass)).to.be.false;
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
      expect(isSpecial(reflectedType)).to.be.true;
    });

    it('returns false if reflected type is not a special type', () => {
      const reflectedType: tsrTypes.ObjectType = {
        kind: 15,
        properties: {},
      };
      expect(isSpecial(reflectedType)).to.be.false;
    });
  });
});
