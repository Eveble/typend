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
      return target;
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
