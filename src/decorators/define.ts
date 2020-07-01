import 'reflect-metadata';
import {
  createReflective,
  Types as tsruntimeTypes,
  defineReflectMetadata,
  MarkReflective,
} from 'tsruntime';
import { DEFINABLE_KEY } from '../constants/metadata-keys';
import { types } from '../types';

/**
 * Defines a type by enabling declaration reflection so it can be converted later on for runtime validation.
 * @param args - Optional arguments that will be passed back to before/after hooks.
 * @returns Marked class as reflective.
 * @example
 *```ts
 * define()
 * class MyType {}
 * ```
 */
export function define(...args: any[]): MarkReflective<types.ClassDecorator> {
  function reflectiveFn(
    reflectedType: tsruntimeTypes.ReflectedType
  ): types.ClassDecorator {
    // This is the anonymous function that would normally be returned back as any other class decorator
    return <T>(target: T): T => {
      define.beforeDefine(target, reflectedType, ...args);

      defineReflectMetadata(target, reflectedType);
      Reflect.defineMetadata(DEFINABLE_KEY, true, target);

      define.afterDefine(target, reflectedType, ...args);
      return target;
    };
  }

  const reflect: MarkReflective<types.ClassDecorator> = createReflective(
    reflectiveFn
  );

  return reflect;
}

/**
 * Before define hook.
 * @param target - Class constructor.
 * @param args - Optional arguments that were passed back to define decorator.
 */
define.beforeDefine = function (target: any, ...args: any[]): void {
  return target && args ? undefined : undefined;
};

/**
 * After define hook.
 * @param target - Class constructor.
 * @param args - Optional arguments that were passed back to define decorator.
 */
define.afterDefine = function (target: any, ...args: any[]): void {
  return target && args ? undefined : undefined;
};
