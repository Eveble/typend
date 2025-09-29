import {
  createReflective,
  Types as tsruntimeTypes,
  defineReflectMetadata,
  MarkReflective,
} from 'tsruntime';
import { REFLECTED_TYPE_KEY } from '../constants/keys';
import { types } from '../types';
import { TYPE_KEY } from '../constants/metadata-keys';

export function Type(...args: any[]): MarkReflective<types.ClassDecorator> {
  function reflectiveFn(reflectedType: tsruntimeTypes.ReflectedType): any {
    return <T extends { new (...cargs: any[]): any }>(target: T): T => {
      Type.beforeHook(target, reflectedType, ...args);

      // Store the reflected type BEFORE any wrapping
      Reflect.defineMetadata(REFLECTED_TYPE_KEY, reflectedType, target);
      Reflect.defineMetadata(TYPE_KEY, true, target);
      defineReflectMetadata(target, reflectedType);

      Type.afterHook(target, reflectedType, ...args);

      /**
       * [⚠️][⚠️][⚠️]
       * Wrap constructor to apply properties AFTER initializers
       * [⚠️][⚠️][⚠️]
       * **Property initializers** on current implementation of TypeScript v3.7 are counterintuitive
       * when inheritance is involved. If we define a PARENT class like:
       *
       * class Parent {
       *   constructor(props: Partial<Parent> = {}) {
       *    Object.assign(this, props);
       *   }
       * }
       * and then a CHILD:
       *
       * ```ts
       * @define('Child')
       * class Child extends Parent {
       *  foo = 'child-value';
       *  // [⚠️] there is no constructor here
       * }
       * expect(
       * new Child({foo: 'set-value'}).foo
       * ).to.be.equal('set-value'); // false, its 'child-value' [⚠️]
       * ```
       *
       * Normally in such cases developer expects, that - since underlying parent of
       * `Child` i.e. `Parent` class assings properties via `Object.assign` - they will
       * override the default values of property initializer(so the `child-value` will be
       * overridden by `set-value`).
       *
       * **However since `Child` does not override constructor - that will not happen.**
       *
       * This will instantiate `Child` with the `child-value`, and not the
       * expected one - `set-value`.
       * Conclusion from this is that property initializers are set **AFTER** the
       * construction - not before(where inheritance is in play).
       *
       * To **fix this issue** - define custom constructor for derived class:
       *```ts
       * @define('Child')
       * class Child extends Struct {
       *  foo = 'child-value';
       *
       *  constructor(props: Partial<Child>) {
       *    super();
       *    Object.assign(this, this.processProps(props));
       *  }
       * }
       *
       * expect(
       * new Child({foo: 'set-value'}).foo
       * ).to.be.equal('set-value'); // true
       * ```
       * or use the wrapper below, that will do it for you.
       */

      // Detection of custom constructors:
      // We need to distinguish between:
      // 1. Truly custom constructors (written by developer)
      // 2. Compiler-generated constructors for property initializers
      const classSource = target.toString();

      const hasExplicitConstructor =
        /constructor\s*\([^)]*\)\s*\{[\s\S]*?\}/m.test(classSource);

      // Check if this is a compiler-generated constructor for property initializers
      // These typically have the pattern: constructor() { super(...arguments); this.prop = value; }
      const isCompilerGenerated =
        hasExplicitConstructor &&
        /constructor\s*\(\s*\)\s*\{\s*super\s*\(\s*\.\.\.arguments\s*\)\s*;/.test(
          classSource
        );

      // Check if this is a truly custom constructor by looking for:
      // - Parameters in constructor signature
      // - Method calls other than property assignments
      // - Console logs, throws, conditionals, etc.
      const hasCustomLogic =
        hasExplicitConstructor &&
        !isCompilerGenerated &&
        (/constructor\s*\([^)]+\)/.test(classSource) || // has parameters
          /this\.\w+\([^)]*\)/.test(classSource) || // calls to this.methodName()
          /console\.log/.test(classSource) || // console.log calls
          /throw\s+/.test(classSource) || // throw statements
          /if\s*\(/.test(classSource) || // conditional logic
          /for\s*\(/.test(classSource) || // loops
          /while\s*\(/.test(classSource)); // while loops

      // console.log(`${target.name} - hasExplicitConstructor: ${hasExplicitConstructor}, isCompilerGenerated: ${isCompilerGenerated}, hasCustomLogic: ${hasCustomLogic}`);

      let Wrapped: any;

      if (hasCustomLogic) {
        // If class has truly custom constructor logic, don't wrap it
        Wrapped = target;
        // console.log(`${target.name} has custom constructor logic - preserving original`);
      } else {
        // Apply the wrapper for classes without custom constructors
        // This includes classes with compiler-generated constructors for property initializers
        // console.log(`${target.name} applying wrapper for property initializers`);

        Wrapped = new Function(
          'target',
          `return class ${target.name} extends target {
             constructor(...ctorArgs) {
               super(...ctorArgs);
              //  console.log('After super() call, this:', Object.keys(this), this);

               // If no properties were set by super() call, it means property initializers
               // from the original class weren't applied. We need to apply them manually.
               if (Object.keys(this).length === 0) {
                 // Create a temporary instance of the original class to get default values
                 const tempInstance = new target();
                //  console.log('Temp instance with initializers:', Object.keys(tempInstance), tempInstance);
                 // Copy the property initializers
                 Object.assign(this, tempInstance);
                //  console.log('After copying initializers, this:', Object.keys(this), this);
               }

               const props = ctorArgs[0];
               if (props && typeof props === "object") {
                //  console.log('Applying props:', props);
                 Object.assign(this, props);
                //  console.log('After Object.assign, this:', Object.keys(this), this);
               }
             }
           }`
        )(target);

        // CRITICAL: Ensure prototype chain is properly maintained
        // The wrapped class must have the same prototype chain as the original
        const originalPrototype = Object.getPrototypeOf(target);
        const originalInstancePrototype = Object.getPrototypeOf(
          target.prototype
        );

        // Set up the constructor prototype chain
        if (originalPrototype && originalPrototype !== Function.prototype) {
          Object.setPrototypeOf(Wrapped, originalPrototype);
        }

        // Set up the instance prototype chain
        if (originalInstancePrototype) {
          Object.setPrototypeOf(Wrapped.prototype, originalInstancePrototype);
        }

        // Copy *own* properties from original prototype to wrapped prototype
        // This is crucial for preserving method definitions and property descriptors
        for (const key of Reflect.ownKeys(target.prototype)) {
          if (key !== 'constructor' && !Wrapped.prototype.hasOwnProperty(key)) {
            const descriptor = Object.getOwnPropertyDescriptor(
              target.prototype,
              key
            );
            if (descriptor) {
              Object.defineProperty(Wrapped.prototype, key, descriptor);
            }
          }
        }

        // Copy static properties from original class
        for (const key of Reflect.ownKeys(target)) {
          if (key !== 'prototype' && key !== 'name' && key !== 'length') {
            const descriptor = Object.getOwnPropertyDescriptor(target, key);
            if (descriptor) {
              Object.defineProperty(Wrapped, key, descriptor);
            }
          }
        }

        // CRITICAL: Copy ALL metadata from original to wrapped class
        // This includes both reflect-metadata and any custom metadata
        const metadataKeys = Reflect.getMetadataKeys(target);
        for (const key of metadataKeys) {
          const value = Reflect.getMetadata(key, target);
          Reflect.defineMetadata(key, value, Wrapped);
        }

        // Also copy metadata from the prototype
        const prototypeMetadataKeys = Reflect.getMetadataKeys(target.prototype);
        for (const key of prototypeMetadataKeys) {
          const value = Reflect.getMetadata(key, target.prototype);
          Reflect.defineMetadata(key, value, Wrapped.prototype);
        }

        // Set the name for debugging
        Object.defineProperty(Wrapped, 'name', { value: target.name });
      }

      // ALWAYS ensure the reflected type metadata is on the final class
      // Store the reflected type metadata on the wrapped class
      Reflect.defineMetadata(REFLECTED_TYPE_KEY, reflectedType, Wrapped);
      Reflect.defineMetadata(TYPE_KEY, true, Wrapped);

      // Apply tsruntime metadata to the wrapped class
      defineReflectMetadata(Wrapped, reflectedType);

      return Wrapped as any as T;
    };
  }

  const reflect: MarkReflective<types.ClassDecorator> =
    createReflective(reflectiveFn);
  return reflect;
}

/**
 * Before Type hook.
 * @param target - Class constructor.
 * @param args - Optional arguments that were passed back to Type decorator.
 */
Type.beforeHook = function (target: any, ...args: any[]): void {
  return target && args ? undefined : undefined;
};

/**
 * After Type hook.
 * @param target - Class constructor.
 * @param args - Optional arguments that were passed back to Type decorator.
 */
Type.afterHook = function (target: any, ...args: any[]): void {
  return target && args ? undefined : undefined;
};
