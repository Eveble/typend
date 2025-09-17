import 'reflect-metadata';
import merge from 'deepmerge';
import { INJECTABLE_PROPERTIES_KEY } from '../../constants/metadata-keys';
import { types } from '../../types';
import { Class } from '../../patterns/class';
import { isPlainObjectFast } from '../../helpers';

export class InjectingPropsTransformer implements types.TypeTransformer {
  /**
   * Evaluates whether transformation can be done on type.
   * @param type - Evaluated type to be transformed.
   * @returns Returns `true` if type is instance of `Class` pattern that contains a type that has injectable properties metadata assigned, else `false`.
   */
  canTransform(type: types.Type): boolean {
    return (
      type instanceof Class &&
      Reflect.hasOwnMetadata(INJECTABLE_PROPERTIES_KEY, type.type)
    );
  }

  /**
   * Transforms class type by injecting additional properties in to type's existing properties.
   * @param classType - `Class` pattern instance as a type to be transformed.
   * @returns Instance of `Class` pattern as a type with injected properties.
   */
  transform(classType: Class): Class {
    const injectableProps: types.Type =
      Reflect.getOwnMetadata(INJECTABLE_PROPERTIES_KEY, classType.type) || {};
    classType.properties = merge(classType.properties, injectableProps, {
      isMergeableObject: isPlainObjectFast,
    });
    return classType;
  }
}
