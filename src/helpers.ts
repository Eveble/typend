import 'reflect-metadata';
import { Types as tsrTypes } from 'tsruntime';
import { has, isPlainObject } from 'lodash';
import { getPrototypeListOf } from 'polytype';
import { isClass, isConstructor } from '@eveble/helpers';
import { TYPE_KEY, VALIDATION_KEY } from './constants/metadata-keys';
import { types } from './types';
import { Class } from './patterns/class';
import { InstanceOf } from './patterns/instance-of';
import { Interface } from './patterns/interface';
import { VALIDATION_TYPE_KEY } from './constants/literal-keys';
import { Collection } from './patterns/collection';

/**
 * Returns resolvable path to nearest node from deeply-nested object.
 * @param path - Path to resolve.
 * @param definition - Definition from which resolvable path should be determined.
 * @returns Determined nearest resolvable path as a string.
 * @example
 *```ts
 * const defWithPattern = {
 * foo: {
 *   baz: {
 *     properties: {
 *       c: 'value',
 *     },
 *   },
 * },
 * getResolvablePath('foo.baz.properties', defWithPattern); // 'foo.baz'
 *
 * const defWithMissingProps = {
 * foo: {
 *   baz: {},
 * },
 * getResolvablePath('foo.baz.qux.quux', defWithMissingProps) // 'foo.baz'
 *```
 */
export function getResolvablePath(
  path: string,
  properties: Record<keyof any, any>
): string {
  const pathParts: string[] = path.split('.');
  const nearestPathParts = [].concat(pathParts as []);

  for (const pathPart of pathParts.reverse()) {
    const nearestPath: string = nearestPathParts.join('.');
    const isNested = !has(properties, nearestPath);

    if (isNested || pathPart === 'properties') {
      nearestPathParts.pop();
    } else {
      return nearestPath;
    }
  }
  return path;
}

/**
 * Evaluates if `key` is resolvable on expected `properties`. This covers
 * scenarios where iterating through each level of expected nested properties
 * yields undefined for resolved `key` for both - expected `properties`
 * and provided validated value. This will happen when additional, nested property
 * difference was found on validated value and is not covered by expected
 * `properties`.
 * @param key - Key that needs to be resolved on evaluated value and
 * the expectation as properties.
 * @param properties - Expected properties for which resolvable key is evaluated.
 * @returns Returns `true` if property expectation is resolvable by `key`, else `false`.
 */
export function isResolvablePath(
  key: string,
  properties: Record<keyof any, any>
): boolean {
  return has(properties, key);
}

/**
 * Returns prototype from parent(s) that matches matcher(for use case with 'polytype' package)
 * @param childProto - Child class prototype.
 * @param matcher - Matcher function, that returns boolean on matching prototype.
 * @returns Parent's matching prototype, else `undefined`.
 */
export function getMatchingParentProto(
  childProto: any,
  matcher: (proto: types.Prototype) => boolean
): types.Prototype | undefined {
  const parentProtos = getPrototypeListOf(childProto);
  for (const evaluatedProto of parentProtos) {
    if (matcher(evaluatedProto)) {
      return evaluatedProto;
    }
  }
  return undefined;
}

/**
 * Evaluates if provided argument is a pattern class.
 * @param arg - Evaluated argument.
 * @returns Returns `true` if provided argument is pattern constructor, else `false`.
 */
export function isPatternClass(arg: any): boolean {
  return arg?.prototype?.getKind !== undefined;
}

/**
 * Evaluates if provided argument is a pattern instance.
 * @param arg - Evaluated argument.
 * @returns Returns `true` if provided argument is pattern instance, else `false`.
 */
export function isPattern(arg: any): boolean {
  return arg?.getKind !== undefined;
}

/**
 * Evaluates if provided argument is a matching instanceOf expectation.
 * @param arg - Evaluated argument.
 * @returns Returns `true` if provided argument is a matching instanceOf expectation(is instance of pattern: `Class`, `InstanceOf` or `Interface`), else `false`.
 */
export function isInstanceOfExpectation(arg: any): boolean {
  return (
    arg instanceof Class ||
    arg instanceof InstanceOf ||
    arg instanceof Interface ||
    isClass(arg) ||
    isConstructor(arg)
  );
}

/**
 * Evaluates if provided argument is a utility instance.
 * @param arg - Evaluated argument.
 * @returns Returns `true` if provided argument is utility instance, else `false`.
 */
export function isUtility(arg: any): boolean {
  return arg?.generate !== undefined;
}

/**
 * Evaluates if provided class constructor has `@Type` decorator applied.
 * @param ctor - Class constructor.
 * @returns Returns `true` if provided class is definable, else `false`.
 */
export function isType(ctor: any): boolean {
  if (ctor === undefined) {
    return false;
  }
  return Reflect.getOwnMetadata(TYPE_KEY, ctor) || false;
}

/**
 * Evaluates if provided class is validable.
 * @param ctor - Class constructor.
 * @returns Returns `true` if provided class is validable, else `false`.
 */
export function isValidable(ctor: any): boolean {
  if (Reflect.hasOwnMetadata(VALIDATION_KEY, ctor)) {
    return Reflect.getOwnMetadata(VALIDATION_KEY, ctor);
  }
  return true;
}

/**
 * Evaluates whether reflected type is a special 'utility type'.
 * @param reflectedType - Reflected type that will be converted.
 * @returns Returns `true` if reflected type is special utility type, `else` false.
 */
export function isSpecial(reflectedType: tsrTypes.ReflectedType): boolean {
  if (reflectedType.kind !== 15) {
    return false;
  }
  const props = (reflectedType as tsrTypes.ObjectType).properties as Record<
    keyof any,
    any
  >;

  return props?.[VALIDATION_TYPE_KEY] !== undefined;
}

/**
 * Evaluates if provided argument is a plain record(plain object or `Collection`).
 * @param arg - Evaluated argument.
 * @returns Returns `true` if argument is an record(literal object or `Collection` instance), else `false`.
 */
export function isPlainRecord(arg: any): boolean {
  return isPlainObject(arg) || arg instanceof Collection;
}

/**
 * Determines whether plain object
 * @param obj - Evaluated object.
 * @returns `True` if object is a plain object, otherwise `false`.
 */
export function isPlainObjectFast(obj: any): boolean {
  if (obj === null || typeof obj !== 'object') return false;
  const proto = Object.getPrototypeOf(obj);
  return proto === Object.prototype || proto === null;
}
