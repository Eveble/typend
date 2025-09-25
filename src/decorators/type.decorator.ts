import {
  createReflective,
  Types as tsruntimeTypes,
  defineReflectMetadata,
  MarkReflective,
} from 'tsruntime';
import { REFLECTED_TYPE_PROPS_KEY } from '../constants/keys';
import { types } from '../types';
import { TYPE_KEY } from '../constants/metadata-keys';

export function Type(...args: any[]): MarkReflective<types.ClassDecorator> {
  function reflectiveFn(reflectedType: tsruntimeTypes.ReflectedType): any {
    return <T extends { new (...cargs: any[]): any }>(target: T): T => {
      Type.beforeDefine(target, reflectedType, ...args);
      defineReflectMetadata(target, reflectedType);

      Type.afterDefine(target, reflectedType, ...args);

      /**
       * [⚠️][⚠️][⚠️]
       * Wrap constructor to apply properties AFTER initializers
       * [⚠️][⚠️][⚠️]
       * **Property initializers** on current implementation of TypeScript v3.7 are counterintuitive
       * when inheritance is involved. If we define a PARENT class like:
       *
       * class Struct {
       *   constructor(props: Partial<Struct> = {}) {
       *    Object.assign(this, props);
       *   }
       * }
       * and then a CHILD:
       *
       * ```ts
       * @define('MyClass')
       * class MyClass extends Struct {
       *  foo = 'default-value';
       *  // [⚠️] there is no constructor here
       * }
       * expect(
       * new MyClass({foo: 'set-value'}).foo
       * ).to.be.equal('set-value'); // false, its 'default-value' [⚠️]
       * ```
       *
       * Normally in such cases developer expects, that - since underlying parent of
       * `MyClass` i.e. `Struct` class assings properties via `Object.assign` - they will
       * override the default values of property initializer(so the `default-value` will be
       * overridden by `set-value`).
       *
       * **However since `MyClass` does not override constructor - that will not happen.**
       *
       * This will instantiate `MyClass` with the `default-value`, and not the
       * expected one - `set-value`.
       * Conclusion from this is that property initializers are set **AFTER** the
       * construction - not before(where inheritance is in play).
       *
       * To **fix this issue** - define custom constructor for derived class:
       *```ts
       * @define('MyClass')
       * class MyClass extends Struct {
       *  foo = 'default-value';
       *
       *  constructor(props: Partial<MyClass>) {
       *    super();
       *    Object.assign(this, this.processProps(props));
       *  }
       * }
       *
       * expect(
       * new MyClass({foo: 'set-value'}).foo
       * ).to.be.equal('set-value'); // true
       * ```
       * or use the wrapper below, that will do it for you.
       */

      /**
       * Defining class via `class extends target` breaks multiple tests
       * const Wrapped = class extends target {
       *   constructor(...ctorArgs: any[]) {
       *     super(...ctorArgs);
       *     const props = ctorArgs[0];
       *     if (props && typeof props === "object") {
       *       Object.assign(this, props);
       *     }
       *   }
       * };
       */

      const Wrapped = new Function(
        'target',
        `return class ${target.name} extends target {
           constructor(...ctorArgs) {
             super(...ctorArgs);
             const props = ctorArgs[0];
             if (props && typeof props === "object") {
               Object.assign(this, props);
             }
           }
         }`
      )(target);

      // Don't break prototype chain!
      // Handle inheritance chain
      // Only patch if parentCtor is a real class/function and not Object or null
      const parentCtor = Object.getPrototypeOf(target);
      if (parentCtor && parentCtor !== Function.prototype) {
        Object.setPrototypeOf(Wrapped, parentCtor);
      }
      const parentProto = Object.getPrototypeOf(target.prototype);
      if (parentProto) {
        Object.setPrototypeOf(Wrapped.prototype, parentProto);
      }

      // Copy *own* properties (like symbols, non-enumerables)
      // but do NOT replace `prototype`.
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

      // Copy metadata to wrapped class
      defineReflectMetadata(Wrapped, reflectedType);

      // Copy metadata back to wrapped class
      Reflect.defineMetadata(REFLECTED_TYPE_PROPS_KEY, reflectedType, Wrapped);

      Reflect.defineMetadata(TYPE_KEY, true, Wrapped);

      // Rename the constructor for debugging
      // Object.defineProperty(Wrapped, "name", { value: target.name });

      return Wrapped as any as T;
    };
  }

  const reflect: MarkReflective<types.ClassDecorator> =
    createReflective(reflectiveFn);
  return reflect;
}
/**
 * Before define hook.
 * @param target - Class constructor.
 * @param args - Optional arguments that were passed back to define decorator.
 */
Type.beforeDefine = function (target: any, ...args: any[]): void {
  return target && args ? undefined : undefined;
};

/**
 * After define hook.
 * @param target - Class constructor.
 * @param args - Optional arguments that were passed back to define decorator.
 */
Type.afterDefine = function (target: any, ...args: any[]): void {
  return target && args ? undefined : undefined;
};
