/* eslint-disable no-redeclare */
import chai, { expect } from 'chai';
import sinon from 'sinon';
import { equivalentClassChai } from '../../../src/chai/equivalent-class.chai-plugin';
import { Type } from '../../../src/decorators/type.decorator';

chai.use(equivalentClassChai);
chai.use(equivalentClassChai);

describe('Chai equivalentClass matcher', () => {
  describe('default', () => {
    it('should not match different types', () => {
      @Type('FirstType')
      class FirstType {
        name: string;

        constructor(name: string = 'default') {
          this.name = name;
        }
      }

      @Type('SecondType')
      class SecondType {
        name: string;

        constructor(name: string = 'default') {
          this.name = name;
        }
      }
      expect(FirstType).to.not.be.equivalentClass(SecondType);
    });
    it('should match decorator-wrapped classes', () => {
      class OriginalType {
        name: string;

        constructor(name: string = 'default') {
          this.name = name;
        }
      }

      @Type('WrappedType')
      class WrappedType extends OriginalType {}

      expect(WrappedType).to.be.equivalentClass(WrappedType);
      expect(WrappedType).to.not.be.equivalentClass(OriginalType);
    });

    it('should fail when classes are not equivalent', () => {
      class ClassA {
        propA: string;
      }

      class ClassB {
        propB: number;
      }

      expect(() => {
        expect(ClassA).to.be.equivalentClass(ClassB);
      }).to.throw('Classes are not equivalent');
    });
  });

  describe('custom options', () => {
    // Base classes for testing different scenarios
    class GrandParent {
      grandParentMethod() {
        return 'grandparent';
      }
    }

    class Parent extends GrandParent {
      static staticProp = 'parent-static';

      static staticMethod() {
        return 'parent-static-method';
      }

      parentProp: string;

      parentMethod() {
        return 'parent';
      }

      constructor(parentProp: string = 'default-parent') {
        super();
        this.parentProp = parentProp;
      }
    }

    class OriginalChild extends Parent {
      static childStatic = 'child-static';

      static childStaticMethod() {
        return 'child-static-method';
      }

      childProp: number;

      childMethod() {
        return 'child';
      }

      overriddenMethod() {
        return 'original-override';
      }

      constructor(parentProp: string = 'child-parent', childProp: number = 42) {
        super(parentProp);
        this.childProp = childProp;
      }
    }

    // Create wrapped versions with various differences
    @Type('WrappedChild')
    class WrappedChild extends Parent {
      static childStatic = 'child-static';

      static childStaticMethod() {
        return 'child-static-method';
      }

      childProp: number;

      childMethod() {
        return 'child';
      }

      overriddenMethod() {
        return 'wrapped-override'; // Different implementation
      }

      constructor(parentProp: string = 'child-parent', childProp: number = 42) {
        super(parentProp);
        this.childProp = childProp;
      }
    }

    class DifferentNameChild extends Parent {
      static childStatic = 'child-static';

      static childStaticMethod() {
        return 'child-static-method';
      }

      childProp: number;

      childMethod() {
        return 'child';
      }

      overriddenMethod() {
        return 'original-override';
      }

      constructor(parentProp: string = 'child-parent', childProp: number = 42) {
        super(parentProp);
        this.childProp = childProp;
      }
    }

    class DifferentStaticsChild extends Parent {
      static childStatic = 'different-static'; // Different static value

      static differentStaticMethod() {
        // Different static method name
        return 'different-static-method';
      }

      childProp: number;

      childMethod() {
        return 'child';
      }

      overriddenMethod() {
        return 'original-override';
      }

      constructor(parentProp: string = 'child-parent', childProp: number = 42) {
        super(parentProp);
        this.childProp = childProp;
      }
    }

    class DifferentMethodsChild extends Parent {
      static childStatic = 'child-static';

      static childStaticMethod() {
        return 'child-static-method';
      }

      childProp: number;

      differentMethod() {
        // Different method name
        return 'different';
      }

      overriddenMethod() {
        return 'original-override';
      }

      constructor(parentProp: string = 'child-parent', childProp: number = 42) {
        super(parentProp);
        this.childProp = childProp;
      }
    }

    class DifferentPrototypeChild {
      // No inheritance - different prototype chain
      static childStatic = 'child-static';

      childProp: number;

      childMethod() {
        return 'child';
      }

      constructor(childProp: number = 42) {
        this.childProp = childProp;
      }
    }

    class ConstructorFailChild extends Parent {
      constructor(parentProp: string = 'child-parent') {
        if (parentProp === 'fail') {
          throw new Error('Constructor designed to fail');
        }
        super(parentProp);
      }
    }

    describe('checkName option', () => {
      it('should pass when checkName is true and names match', () => {
        expect(OriginalChild).to.be.equivalentClass(OriginalChild, {
          checkName: true,
        });
      });

      it('should fail when checkName is true and names differ', () => {
        expect(() => {
          expect(DifferentNameChild).to.be.equivalentClass(OriginalChild, {
            checkName: true,
          });
        }).to.throw("names don't match");
      });

      it('should pass when checkName is false and names differ', () => {
        expect(DifferentNameChild).to.be.equivalentClass(OriginalChild, {
          checkName: false,
          checkPrototypeChain: true,
          checkInstantiation: true,
          checkStaticProperties: false,
          checkInstanceMethods: false,
        });
      });

      it('should pass when checkName is false and names match', () => {
        expect(OriginalChild).to.be.equivalentClass(OriginalChild, {
          checkName: false,
        });
      });
    });

    describe('checkPrototypeChain option', () => {
      it('should pass when checkPrototypeChain is true and chains match', () => {
        expect(OriginalChild).to.be.equivalentClass(WrappedChild, {
          checkPrototypeChain: true,
          checkName: false,
          checkInstantiation: false,
        });
      });

      it('should fail when checkPrototypeChain is true and chains differ', () => {
        expect(() => {
          expect(DifferentPrototypeChild).to.be.equivalentClass(OriginalChild, {
            checkPrototypeChain: true,
          });
        }).to.throw("prototype chains don't match");
      });

      it('should pass when checkPrototypeChain is false and chains differ', () => {
        expect(DifferentPrototypeChild).to.be.equivalentClass(OriginalChild, {
          checkPrototypeChain: false,
          checkName: false,
          checkInstantiation: false,
          checkStaticProperties: false,
          checkInstanceMethods: false,
        });
      });

      it('should pass when checkPrototypeChain is false and chains match', () => {
        expect(OriginalChild).to.be.equivalentClass(WrappedChild, {
          checkPrototypeChain: false,
          checkName: false,
        });
      });
    });

    describe('checkInstantiation option', () => {
      it('should pass when checkInstantiation is true and behavior matches', () => {
        expect(OriginalChild).to.be.equivalentClass(WrappedChild, {
          checkInstantiation: true,
          checkName: false,
          checkInstanceMethods: false, // Ignore method differences
        });
      });

      it('should fail when checkInstantiation is true and constructors behave differently', () => {
        expect(() => {
          expect(ConstructorFailChild).to.be.equivalentClass(OriginalChild, {
            checkInstantiation: true,
            instantiationArgs: ['fail'],
          });
        }).to.throw('actual constructor throws error');
      });

      it('should pass when checkInstantiation is false despite constructor differences', () => {
        expect(ConstructorFailChild).to.be.equivalentClass(OriginalChild, {
          checkInstantiation: false,
          checkName: false,
          checkPrototypeChain: true,
        });
      });

      it('should work with custom instantiation args', () => {
        expect(OriginalChild).to.be.equivalentClass(WrappedChild, {
          checkInstantiation: true,
          instantiationArgs: ['custom-parent', 100],
          checkName: false,
          checkInstanceMethods: false,
        });
      });
    });

    describe('checkStaticProperties option', () => {
      it('should pass when checkStaticProperties is true and static props match', () => {
        expect(OriginalChild).to.be.equivalentClass(WrappedChild, {
          checkStaticProperties: true,
          checkName: false,
          checkInstantiation: false,
          checkInstanceMethods: false,
        });
      });

      it('should fail when checkStaticProperties is true and static props differ', () => {
        expect(() => {
          expect(DifferentStaticsChild).to.be.equivalentClass(OriginalChild, {
            checkStaticProperties: true,
          });
        }).to.throw("static properties don't match");
      });

      it('should pass when checkStaticProperties is false despite static differences', () => {
        expect(DifferentStaticsChild).to.be.equivalentClass(OriginalChild, {
          checkStaticProperties: false,
          checkName: false,
          checkInstantiation: true,
          checkInstanceMethods: false,
        });
      });
    });

    describe('checkInstanceMethods option', () => {
      it('should pass when checkInstanceMethods is true and methods match', () => {
        expect(OriginalChild).to.be.equivalentClass(WrappedChild, {
          checkInstanceMethods: true,
          checkName: false,
          checkInstantiation: false,
        });
      });

      it('should fail when checkInstanceMethods is true and methods differ', () => {
        expect(() => {
          expect(DifferentMethodsChild).to.be.equivalentClass(OriginalChild, {
            checkInstanceMethods: true,
          });
        }).to.throw("instance methods don't match");
      });

      it('should pass when checkInstanceMethods is false despite method differences', () => {
        expect(DifferentMethodsChild).to.be.equivalentClass(OriginalChild, {
          checkInstanceMethods: false,
          checkName: false,
          checkInstantiation: true,
          checkStaticProperties: false,
        });
      });
    });

    describe('instantiationArgs option', () => {
      it('should use provided instantiation args for testing', () => {
        expect(OriginalChild).to.be.equivalentClass(WrappedChild, {
          checkInstantiation: true,
          instantiationArgs: ['test-parent', 999],
          checkName: false,
          checkInstanceMethods: false,
        });
      });

      it('should handle empty instantiation args', () => {
        expect(Parent).to.be.equivalentClass(Parent, {
          checkInstantiation: true,
          instantiationArgs: [],
        });
      });

      it('should fail gracefully when instantiation args cause errors', () => {
        expect(() => {
          expect(ConstructorFailChild).to.be.equivalentClass(Parent, {
            checkInstantiation: true,
            instantiationArgs: ['fail'],
          });
        }).to.throw('actual constructor throws error');
      });
    });

    describe('combined options scenarios', () => {
      it('should pass with all checks enabled for identical classes', () => {
        expect(OriginalChild).to.be.equivalentClass(OriginalChild, {
          checkName: true,
          checkPrototypeChain: true,
          checkInstantiation: true,
          checkStaticProperties: true,
          checkInstanceMethods: true,
          instantiationArgs: ['test', 42],
        });
      });

      it('should pass with selective checks for decorator-wrapped classes', () => {
        expect(WrappedChild).to.be.equivalentClass(OriginalChild, {
          checkName: false, // Names might differ due to decorator
          checkPrototypeChain: true, // Inheritance should be preserved
          checkInstantiation: true, // Constructor behavior should work
          checkStaticProperties: true, // Static props should be preserved
          checkInstanceMethods: false, // Methods might have different implementations
          instantiationArgs: ['test-parent', 123],
        });
      });

      it('should fail when multiple checks fail simultaneously', () => {
        expect(() => {
          expect(DifferentPrototypeChild).to.be.equivalentClass(OriginalChild, {
            checkName: true,
            checkPrototypeChain: true,
            checkInstantiation: true,
            checkStaticProperties: true,
            checkInstanceMethods: true,
          });
        }).to.throw(
          /Classes are not equivalent.*names don't match.*prototype chains don't match/s
        );
      });

      it('should provide detailed failure information', () => {
        let error: Error | undefined;
        try {
          expect(DifferentNameChild).to.be.equivalentClass(OriginalChild, {
            checkName: true,
            checkStaticProperties: true,
          });
        } catch (e) {
          error = e as Error;
        }

        expect(error).to.exist;
        expect(error!.message).to.include('Classes are not equivalent');
        expect(error!.message).to.include("names don't match");
      });

      it('should handle edge case with minimal checks', () => {
        // Only check that they're both functions, nothing else
        expect(DifferentPrototypeChild).to.be.equivalentClass(OriginalChild, {
          checkName: false,
          checkPrototypeChain: false,
          checkInstantiation: false,
          checkStaticProperties: false,
          checkInstanceMethods: false,
        });
      });
    });

    describe('real-world decorator scenarios', () => {
      it('should handle @Type decorator transformations', () => {
        @Type('RealWorldExample')
        class DecoratedClass extends Parent {
          decoratedProp: string;

          decoratedMethod() {
            return 'decorated';
          }

          constructor(
            parentProp: string = 'decorated-parent',
            decoratedProp: string = 'decorated'
          ) {
            super(parentProp);
            this.decoratedProp = decoratedProp;
          }
        }

        class UnDecoratedClass extends Parent {
          decoratedProp: string;

          decoratedMethod() {
            return 'decorated';
          }

          constructor(
            parentProp: string = 'decorated-parent',
            decoratedProp: string = 'decorated'
          ) {
            super(parentProp);
            this.decoratedProp = decoratedProp;
          }
        }

        // This is the typical scenario for your library tests
        expect(DecoratedClass).to.be.equivalentClass(UnDecoratedClass, {
          checkName: false, // Decorator might change name
          checkPrototypeChain: true, // Inheritance preserved
          checkInstantiation: true, // Should work the same
          checkStaticProperties: false, // Decorator might add static props
          checkInstanceMethods: true, // Methods should match
          instantiationArgs: ['test-parent', 'test-decorated'],
        });
      });

      it('should handle library registration verification', () => {
        const mockLibrary = { registerType: sinon.stub() };

        // Simulate your actual use case
        @Type('LibraryTest')
        class LibraryTestClass extends Parent {}

        // Simulate library registration
        mockLibrary.registerType('LibraryTest', LibraryTestClass);

        const [name, registeredClass] = mockLibrary.registerType.firstCall.args;

        expect(name).to.equal('LibraryTest');
        expect(registeredClass).to.be.equivalentClass(LibraryTestClass, {
          checkName: false, // The registered class might have a different internal name
          checkPrototypeChain: true,
          checkInstantiation: true,
          checkStaticProperties: false,
          checkInstanceMethods: true,
        });
      });

      it('should handle inheritance chains with multiple decorators', () => {
        @Type('DecoratedParent')
        class DecoratedParent extends GrandParent {
          decoratedParentMethod() {
            return 'decorated-parent';
          }
        }

        @Type('DecoratedChild')
        class DecoratedChild extends DecoratedParent {
          decoratedChildMethod() {
            return 'decorated-child';
          }
        }

        // Create a plain version with the same inheritance structure
        class PlainParent extends GrandParent {
          decoratedParentMethod() {
            return 'decorated-parent';
          }
        }

        class PlainChild extends PlainParent {
          decoratedChildMethod() {
            return 'decorated-child';
          }
        }

        expect(DecoratedChild).to.be.equivalentClass(PlainChild, {
          checkName: false,
          checkPrototypeChain: false, // Skip direct prototype comparison
          checkInstantiation: false, // Skip instance comparison since chains differ
          checkStaticProperties: false,
          checkInstanceMethods: true,
        });
      });

      it('should handle decorator vs non-decorator with same base class', () => {
        @Type('DecoratedVersion')
        class DecoratedVersion extends Parent {
          versionMethod() {
            return 'version';
          }
        }

        class PlainVersion extends Parent {
          versionMethod() {
            return 'version';
          }
        }

        expect(DecoratedVersion).to.be.equivalentClass(PlainVersion, {
          checkName: false, // Names will differ
          checkPrototypeChain: true, // Both extend Parent
          checkInstantiation: true, // Should behave the same
          checkStaticProperties: false, // Decorator might add metadata
          checkInstanceMethods: true, // Same methods
        });
      });

      it('should handle deep inheritance with decorators at different levels', () => {
        // Mix of decorated and non-decorated classes in inheritance chain
        @Type('MixedBase')
        class MixedBase extends GrandParent {}

        class MixedMiddle extends MixedBase {} // No decorator

        @Type('MixedChild')
        class MixedChild extends MixedMiddle {}

        // Equivalent plain chain
        class PlainBase extends GrandParent {}
        class PlainMiddle extends PlainBase {}
        class PlainChild extends PlainMiddle {}

        expect(MixedChild).to.be.equivalentClass(PlainChild, {
          checkName: false,
          checkPrototypeChain: false, // Complex decorated chain vs plain chain
          checkInstantiation: false, // Instance chains will differ
          checkStaticProperties: false,
          checkInstanceMethods: true,
        });
      });
    });
  });
});
