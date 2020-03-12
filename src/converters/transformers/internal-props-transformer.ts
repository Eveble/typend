import 'reflect-metadata';
import { INTERNAL_PROPS_KEY } from '../../constants/metadata-keys';
import { types } from '../../types';
import { Internal } from '../../patterns/internal';
import { Class } from '../../patterns/class';

export class InternalPropsTransformer implements types.TypeTransformer {
  /**
   * Evaluates whether transformation can be done on type.
   * @param type - Evaluated type to be transformed.
   * @returns Returns `true` if type is instance of `Class` pattern that contains a type that has internal properties metadata assigned, else `false`.
   */
  canTransform(type: types.Type): boolean {
    return (
      type instanceof Class &&
      Reflect.hasOwnMetadata(INTERNAL_PROPS_KEY, type.type)
    );
  }

  /**
   * Transforms class type's internal properties by wrapping their values with `Internal` pattern.
   * @param classType - `Class` pattern instance as a type to be transformed.
   * @returns Instance of `Class` pattern as a type with internal
   * properties wrapped with `Internal` pattern.
   */
  transform(classType: Class): Class {
    const internalKeys: string[] = Object.keys(
      Reflect.getOwnMetadata(INTERNAL_PROPS_KEY, classType.type) || {}
    );
    // In case internal keys are required on validation(will be resolved as instances Internal)
    for (const key of internalKeys) {
      classType.properties[key] = new Internal(classType.properties[key]);
    }
    return classType;
  }
}
