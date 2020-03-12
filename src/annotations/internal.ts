import 'reflect-metadata';
import {
  INTERNAL_PROPS_KEY,
  INTERNAL_METHODS_KEY,
} from '../constants/metadata-keys';
import { types } from '../types';

/**
 * Annotates internal element of a class(like property that is not a part of
 * 'exposed' type definition, or method handling routed message) that will be ignored
 * durning validation or processing.
 * @param proto - Prototype.
 * @param propertyKey - Property or method name(key) as a string.
 * @example
 *```ts
 * class MyClass {
 *  name: string;
 *  @internal engine: Engine
 *
 *  @internal
 *  MyMessage(message: MyMessage): void {}
 * }
 * ```
 */
export function internal(proto: types.Prototype, propertyKey: string): void {
  const target: any = proto.constructor;
  const descriptor:
    | PropertyDescriptor
    | undefined = Object.getOwnPropertyDescriptor(proto, propertyKey);

  const type: 'property' | 'method' =
    descriptor === undefined ? 'property' : 'method';

  const typeKey: symbol =
    type === 'property' ? INTERNAL_PROPS_KEY : INTERNAL_METHODS_KEY;

  if (!Reflect.hasOwnMetadata(typeKey, target)) {
    const internals: types.InternalCollection = {};
    // Define new metadata with completely new object reference so parent class metadata is not modified in any way
    Reflect.defineMetadata(typeKey, internals, target);
  }
  const internals: types.InternalCollection = Reflect.getOwnMetadata(
    typeKey,
    target
  );
  internals[propertyKey] = true;
  // Store new metadata with additional new entry
  Reflect.defineMetadata(typeKey, internals, target);
}
