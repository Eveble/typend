import { use } from 'chai';

/**
 * Configuration options for equivalentClass matcher
 */
export interface EquivalentClassOptions {
  /** Whether to check constructor names match */
  checkName?: boolean;
  /** Whether to check prototype chains match */
  checkPrototypeChain?: boolean;
  /** Whether to test instantiation behavior */
  checkInstantiation?: boolean;
  /** Whether to check static properties */
  checkStaticProperties?: boolean;
  /** Whether to check instance methods */
  checkInstanceMethods?: boolean;
  /** Custom instantiation args for testing */
  instantiationArgs?: any[];
}

/**
 * Default options for equivalentClass matcher
 */
const defaultOptions: EquivalentClassOptions = {
  checkName: true,
  checkPrototypeChain: true,
  checkInstantiation: true,
  checkStaticProperties: false,
  checkInstanceMethods: false,
  instantiationArgs: [],
};

/**
 * Chai plugin that adds an `equivalentClass` assertion for comparing classes
 * that may have been wrapped by decorators or other transformations.
 *
 * @example
 * ```typescript
 * import { equivalentClassChai } from './chai-equivalent-class';
 * import { use } from 'chai';
 *
 * use(equivalentClassChai);
 *
 * // In your tests:
 * expect(WrappedClass).to.be.equivalentClass(OriginalClass);
 * expect(WrappedClass).to.be.equivalentClass(OriginalClass, { checkName: false });
 * ```
 */
export function equivalentClassChai(chai: any, utils: any): void {
  utils.addMethod(
    chai.Assertion.prototype,
    'equivalentClass',
    function (expected: any, options: EquivalentClassOptions = {}) {
      const actual = this._obj;
      const opts = { ...defaultOptions, ...options };

      // Validate inputs
      if (typeof actual !== 'function') {
        throw new Error('Expected actual value to be a constructor function');
      }
      if (typeof expected !== 'function') {
        throw new Error('Expected expected value to be a constructor function');
      }

      const failures: string[] = [];

      // Check 1: Name comparison
      if (opts.checkName) {
        const nameMatches = actual.name === expected.name;
        if (!nameMatches) {
          failures.push(
            `names don't match: actual="${actual.name}", expected="${expected.name}"`
          );
        }
      }

      // Check 2: Prototype chain comparison
      if (opts.checkPrototypeChain) {
        const actualParentProto = Object.getPrototypeOf(actual.prototype);
        const expectedParentProto = Object.getPrototypeOf(expected.prototype);
        const prototypeMatches = actualParentProto === expectedParentProto;

        if (!prototypeMatches) {
          failures.push("prototype chains don't match");
        }
      }

      // Check 3: Static properties comparison
      if (opts.checkStaticProperties) {
        const actualStaticKeys = Reflect.ownKeys(actual).filter(
          (key) => key !== 'prototype' && key !== 'name' && key !== 'length'
        );
        const expectedStaticKeys = Reflect.ownKeys(expected).filter(
          (key) => key !== 'prototype' && key !== 'name' && key !== 'length'
        );

        const staticPropsMatch =
          actualStaticKeys.length === expectedStaticKeys.length &&
          actualStaticKeys.every((key) => expectedStaticKeys.includes(key));

        if (!staticPropsMatch) {
          failures.push("static properties don't match");
        }
      }

      // Check 4: Instance methods comparison
      if (opts.checkInstanceMethods) {
        const actualMethods = Reflect.ownKeys(actual.prototype).filter(
          (key) => key !== 'constructor'
        );
        const expectedMethods = Reflect.ownKeys(expected.prototype).filter(
          (key) => key !== 'constructor'
        );

        const methodsMatch =
          actualMethods.length === expectedMethods.length &&
          actualMethods.every((method) => expectedMethods.includes(method));

        if (!methodsMatch) {
          failures.push("instance methods don't match");
        }
      }

      // Check 5: Instantiation behavior
      if (opts.checkInstantiation) {
        try {
          // eslint-disable-next-line new-cap
          const actualInstance = new actual(...(opts.instantiationArgs || []));
          // eslint-disable-next-line new-cap
          const expectedInstance = new expected(
            ...(opts.instantiationArgs || [])
          );

          // Check if instances have the same prototype chain
          const actualInstanceProto = Object.getPrototypeOf(actualInstance);
          const expectedInstanceProto = Object.getPrototypeOf(expectedInstance);

          // More flexible prototype chain comparison
          // Check if they share a common ancestor in their prototype chains
          let instanceBehaviorMatches = false;

          // Direct prototype match
          if (actualInstanceProto === expectedInstanceProto) {
            instanceBehaviorMatches = true;
          } else {
            // Check if they have the same parent prototype (allowing for wrapper differences)
            const actualParent = Object.getPrototypeOf(actualInstanceProto);
            const expectedParent = Object.getPrototypeOf(expectedInstanceProto);

            if (actualParent === expectedParent) {
              instanceBehaviorMatches = true;
            } else {
              // Check if they share any common prototype in their chains
              const actualChain: any[] = [];
              let current = actualInstance;
              while (current && current.constructor !== Object) {
                actualChain.push(current.constructor);
                current = Object.getPrototypeOf(current);
              }

              const expectedChain: any[] = [];
              current = expectedInstance;
              while (current && current.constructor !== Object) {
                expectedChain.push(current.constructor);
                current = Object.getPrototypeOf(current);
              }

              // Check if they share at least one common constructor in their chain
              instanceBehaviorMatches = actualChain.some((ctor) =>
                expectedChain.includes(ctor)
              );
            }
          }

          if (!instanceBehaviorMatches) {
            failures.push(
              "instance behavior doesn't match (different prototype chains)"
            );
          }

          // Additional check: ensure both instances have similar basic properties
          try {
            // Basic sanity check - both should be objects
            if (typeof actualInstance !== typeof expectedInstance) {
              failures.push(
                `instance types differ: actual=${typeof actualInstance}, expected=${typeof expectedInstance}`
              );
            }
          } catch (e) {
            // Ignore errors in this additional check
          }
        } catch (actualError) {
          try {
            // eslint-disable-next-line new-cap
            new expected(...(opts.instantiationArgs || []));
            // Expected works but actual doesn't
            failures.push(
              `actual constructor throws error: ${actualError.message}`
            );
          } catch (expectedError) {
            // Both throw errors - check if they're the same type
            if (actualError.constructor !== expectedError.constructor) {
              failures.push(
                `constructors throw different error types: actual=${actualError.constructor.name}, expected=${expectedError.constructor.name}`
              );
            }
            // If both throw the same type of error, consider it a match
          }
        }
      }

      // Assert the result
      const isEquivalent = failures.length === 0;
      const failureMessage =
        failures.length > 0
          ? `Classes are not equivalent:\n  - ${failures.join('\n  - ')}`
          : '';

      this.assert(
        isEquivalent,
        `expected #{this} to be equivalent to #{exp}${
          failureMessage ? `\n${failureMessage}` : ''
        }`,
        `expected #{this} to not be equivalent to #{exp}`,
        expected,
        actual
      );
    }
  );
}

/**
 * Utility function to easily set up the plugin
 */
export function setupEquivalentClassMatcher(): void {
  use(equivalentClassChai);
}

/**
 * Type augmentation for Chai to include the new assertion
 */
declare global {
  namespace Chai {
    interface Assertion {
      /**
       * Asserts that the target class is equivalent to the expected class,
       * accounting for potential wrapping by decorators or other transformations.
       *
       * @param expected The expected class to compare against
       * @param options Configuration options for the comparison
       */
      equivalentClass(
        expected: any,
        options?: EquivalentClassOptions
      ): Assertion;
    }
  }
}

// Export the plugin as default for convenience
export default equivalentClassChai;
